import { API_URL, LANGUAGE_IDX, PROBLEM_DB_PATH, USERINFO, initialUserInfo, initialVariations } from "../util/constants";
import { convertFromTwoDToString } from "../util/functions";
import { menuWords } from "../util/menuWords";
import { Board, ProblemFromServer, UserInfo } from "../util/types";

export async function createProblem(comment: string, problem: Board, creator: string | null, level: number, color: string) {
  const languageIdx = Number(localStorage.getItem(LANGUAGE_IDX))

  const initialState = convertFromTwoDToString(problem);
  const variations = initialVariations
  const answers = initialVariations
  const questions = initialVariations
  const userInfo: UserInfo = JSON.parse(localStorage.getItem(USERINFO) || initialUserInfo)
  const token = userInfo.token
  const response = await fetch(`${API_URL}${PROBLEM_DB_PATH}/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'authorization': `Bearer ${token}`

    },
    body: JSON.stringify({initialState, creator, variations, answers, questions, level, comment, color}),
  })
  if (response.ok) {
    alert(menuWords.registered[languageIdx])
    console.log(response)
  } else {
    throw new Error(`Error: ${response.status}`)
  }
}

export async function deleteProblem(problemId: string, creator: string) {
  const languageIdx = Number(localStorage.getItem(LANGUAGE_IDX))
  const userInfo: UserInfo = JSON.parse(localStorage.getItem(USERINFO) || initialUserInfo)
  const idx = userInfo.created.indexOf(problemId)
  if (idx < 0) {
    return
  }
  const token = userInfo.token
  const response = await fetch(`${API_URL}${PROBLEM_DB_PATH}/delete`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'authorization': `Bearer ${token}`
    },
    body: JSON.stringify({problemId, creator}),
  })
  if (response.ok) {
    alert(menuWords.deletedProblemWarning[languageIdx])
    userInfo.created.splice(idx, 1)
    localStorage.setItem(USERINFO, JSON.stringify(userInfo))
  } else {
    throw new Error(`Error: ${response.status}`)
  }
}

export async function getAllProblems(): Promise<ProblemFromServer[]> {
  const response = await fetch(`${API_URL}${PROBLEM_DB_PATH}/get-all`)
  if (!response.ok) {
    throw new Error(`Error: ${response.status}`)
  }
  const problems = await response.json()
  return problems 
}

export async function getProblemByCreator(creator: string | null): Promise<ProblemFromServer[]> {
  const response = await fetch(`${API_URL}${PROBLEM_DB_PATH}/get-by-creator/${creator}`)
  if (!response.ok) {
    throw new Error(`Error: ${response.status}`)
  }
  const problems = await response.json()
  return problems
}

export async function getProblemByLevel(level: number): Promise<ProblemFromServer[]> {
  const response = await fetch(`${API_URL}${PROBLEM_DB_PATH}/get-by-level/${level}`)
  if (!response.ok) {
    throw new Error(`Error: ${response.status}`)
  }
  const problems = await response.json()
  return problems
}

export async function getProblemById(problemId: string): Promise<ProblemFromServer> {
  const response = await fetch(`${API_URL}${PROBLEM_DB_PATH}/get-by-id/${problemId}`)
  if (!response.ok) {
    throw new Error(`Error: ${response.status}`)
  }
  const problem = await response.json()
  return problem
}

export async function getProblemByIdList(problemIdList: string[]): Promise<ProblemFromServer[]> {
  const stringify = JSON.stringify(problemIdList)
  const response = await fetch(`${API_URL}${PROBLEM_DB_PATH}/get-by-id-list/${stringify}`)
  if (!response.ok) {
    throw new Error(`Error: ${response.status}`)
  }
  const problem = await response.json()
  return problem
}


export async function updateVariations(problemId: string, where: string, variations: object, name: string, creator?: string) {
  const languageIdx = Number(localStorage.getItem(LANGUAGE_IDX))
  const userInfo: UserInfo = JSON.parse(localStorage.getItem(USERINFO) || initialUserInfo)
  const token = userInfo.token
  const response = await fetch(`${API_URL}${PROBLEM_DB_PATH}/update-variations`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'authorization': `Bearer ${token}`
    },
    body: JSON.stringify({problemId, where, variations, name, creator}),
  })
  if (response.ok) {
    console.log(menuWords.saved[languageIdx])
  }
}

export async function modifyProblem(problemId: string, problem: Board, comment: string, level: number, color: string, creator: string) {
  const initialState = convertFromTwoDToString(problem)
  const userInfo: UserInfo = JSON.parse(localStorage.getItem(USERINFO) || initialUserInfo)
  const token = userInfo.token
  const response = await fetch(`${API_URL}${PROBLEM_DB_PATH}/modify-problem`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'authorization': `Bearer ${token}`
    },
    body: JSON.stringify({problemId, initialState, comment, level, color, creator}),
  })
  if (!response.ok) {
    throw new Error(`Error: ${response.status}`)
  }
  const data = await response.json()
  alert(data.response)
}
