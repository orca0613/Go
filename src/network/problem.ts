import { API_URL, CREATED, PROBLEM_DB_PATH, TOKEN, initialVariations } from "../util/constants";
import { convertFromTwoDToString } from "../util/functions";
import { Board, ProblemInfoFromServer } from "../util/types";

export function createProblem(comment: string, problem: Board, creator: string | null, level: number, color: string) {
  const initialState = convertFromTwoDToString(problem);
  const variations = initialVariations
  const answers = initialVariations
  const questions = initialVariations
  const token = localStorage.getItem(TOKEN)

  fetch(`${API_URL}${PROBLEM_DB_PATH}/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'authorization': `Bearer ${token}`

    },
    body: JSON.stringify({initialState, creator, variations, answers, questions, level, comment, color}),
  })
    .then(response => response.json())
    .then(data => {
      const created = localStorage.getItem(CREATED)
      localStorage.setItem(CREATED, created + "&" + data.id)
      alert(data.response)
    })
    .catch(error => console.error('Error:', error));
}

export function deleteProblem(id: string, creator: string) {
  const created = localStorage.getItem(CREATED)?.split("&")?? []
  const idx = created.indexOf(id)
  if (idx < 0) {
    return
  }
  const token = localStorage.getItem(TOKEN)
  fetch(`${API_URL}${PROBLEM_DB_PATH}/delete`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'authorization': `Bearer ${token}`
    },
    body: JSON.stringify({id, creator}),
  })
    .then(response => response.json())
    .then(data => {
      alert(data.response)
      created.splice(idx, 1)
      localStorage.setItem(CREATED, created.join("&"))
    })
    .catch(error => {console.log("Error", error)})
}

export async function getAllProblems(): Promise<ProblemInfoFromServer[]> {
  const response = await fetch(`${API_URL}${PROBLEM_DB_PATH}/get-all`)
  const problems = await response.json()
  return problems 
}

export async function getProblemByCreator(creator: string | null): Promise<ProblemInfoFromServer[]> {
  const response = await fetch(`${API_URL}${PROBLEM_DB_PATH}/get-by-creator/${creator}`)
  const problems = await response.json()
  return problems
}

export async function getProblemByLevel(level: number): Promise<ProblemInfoFromServer[]> {
  const response = await fetch(`${API_URL}${PROBLEM_DB_PATH}/get-by-level/${level}`)
  const problems = await response.json()
  return problems
}

export async function getProblemById(problemId: string): Promise<ProblemInfoFromServer> {
  const response = await fetch(`${API_URL}${PROBLEM_DB_PATH}/get-by-id/${problemId}`)
  const problem = await response.json()
  return problem
}

export async function getProblemByIdList(problemIdList: string): Promise<ProblemInfoFromServer[]> {
  const response = await fetch(`${API_URL}${PROBLEM_DB_PATH}/get-by-id-list/${problemIdList}`)
  const problem = await response.json()
  return problem
}


export function updateVariations(problemId: string, variations: object, where: string, name: string, creator?: string) {
  const token = localStorage.getItem(TOKEN)
  fetch(`${API_URL}${PROBLEM_DB_PATH}/update-variations`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'authorization': `Bearer ${token}`
    },
    body: JSON.stringify({problemId, variations, where, name, creator}),
  })
    .then(response => response.json())
    .then(r => alert(r.response))
    .catch(error => console.error('Error: ', error))
}

export function modifyProblem(problemId: string, problem: Board, comment: string, level: number, color: string, creator: string) {
  const initialState = convertFromTwoDToString(problem)
  const token = localStorage.getItem(TOKEN)
  fetch(`${API_URL}${PROBLEM_DB_PATH}/modify-problem`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'authorization': `Bearer ${token}`
    },
    body: JSON.stringify({problemId, initialState, comment, level, color, creator}),
  })
    .then(response => response.json())
    .then(data => alert(data.response))
    .catch(error => console.error('Error: ', error))
}
