import { API_URL, CREATED, LANGUAGE_IDX, PROBLEM_DB_PATH, TOKEN, initialVariations } from "../util/constants";
import { convertFromTwoDToString } from "../util/functions";
import { menuWords } from "../util/menuWords";
import { Board, ProblemFromServer } from "../util/types";

export function createProblem(comment: string, problem: Board, creator: string | null, level: number, color: string) {
  const languageIdx = Number(localStorage.getItem(LANGUAGE_IDX))

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
      alert(menuWords.registered[languageIdx])
    })
    .catch(error => console.error('Error:', error));
}

export function deleteProblem(problemId: string, creator: string) {
  const languageIdx = Number(localStorage.getItem(LANGUAGE_IDX))
  const created = localStorage.getItem(CREATED)?.split("&")?? []
  const idx = created.indexOf(problemId)
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
    body: JSON.stringify({problemId, creator}),
  })
    .then(response => response.json())
    .then(data => {
      alert(menuWords.deletedProblemWarning[languageIdx])
      created.splice(idx, 1)
      localStorage.setItem(CREATED, created.join("&"))
    })
    .catch(error => {console.log("Error", error)})
}

export async function getAllProblems(): Promise<ProblemFromServer[]> {
  const response = await fetch(`${API_URL}${PROBLEM_DB_PATH}/get-all`)
  const problems = await response.json()
  return problems 
}

export async function getProblemByCreator(creator: string | null): Promise<ProblemFromServer[]> {
  const response = await fetch(`${API_URL}${PROBLEM_DB_PATH}/get-by-creator/${creator}`)
  const problems = await response.json()
  return problems
}

export async function getProblemByLevel(level: number): Promise<ProblemFromServer[]> {
  const response = await fetch(`${API_URL}${PROBLEM_DB_PATH}/get-by-level/${level}`)
  const problems = await response.json()
  return problems
}

export async function getProblemById(problemId: string): Promise<ProblemFromServer> {
  const response = await fetch(`${API_URL}${PROBLEM_DB_PATH}/get-by-id/${problemId}`)
  const problem = await response.json()
  return problem
}

export async function getProblemByIdList(problemIdList: string): Promise<ProblemFromServer[]> {
  const response = await fetch(`${API_URL}${PROBLEM_DB_PATH}/get-by-id-list/${problemIdList}`)
  const problem = await response.json()
  return problem
}


export function updateVariations(problemId: string, variations: object, answers: object, questions: object, name: string, creator?: string) {
  const token = localStorage.getItem(TOKEN)
  fetch(`${API_URL}${PROBLEM_DB_PATH}/update-variations`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'authorization': `Bearer ${token}`
    },
    body: JSON.stringify({problemId, variations, answers, questions, name, creator}),
  })
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
