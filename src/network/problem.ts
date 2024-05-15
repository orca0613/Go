import _ from "lodash";
import { API_URL, LANGUAGE_IDX, QUESTIONS, USERINFO } from "../util/constants";
import { loginWarning } from "../util/functions";
import { menuWords } from "../util/menuWords";
import { Board, ProblemAndVariations, UserInfo } from "../util/types";
import { PROBLEM_DB_PATH } from "../util/paths";
import { initialUserInfo, initialVariations } from "../util/initialForms";

export async function createProblem(comment: string, problem: Board, creator: string | null, level: number, color: string) {
  const languageIdx = Number(localStorage.getItem(LANGUAGE_IDX))

  const initialState = problem;
  const variations = initialVariations
  const answers = initialVariations
  const questions = initialVariations
  const userInfo: UserInfo = JSON.parse(sessionStorage.getItem(USERINFO) || initialUserInfo)
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
    return alert(menuWords.registered[languageIdx])
  }
  if (response.status === 401 || response.status === 403) {
    return loginWarning()
  }
  throw new Error(`Error: ${response.status}`)
}

export async function deleteProblem(problemIdx: number, creator: string, level: number) {
  const languageIdx = Number(localStorage.getItem(LANGUAGE_IDX))
  const userInfo: UserInfo = JSON.parse(sessionStorage.getItem(USERINFO) || initialUserInfo)
  const token = userInfo.token
  const response = await fetch(`${API_URL}${PROBLEM_DB_PATH}/delete`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'authorization': `Bearer ${token}`
    },
    body: JSON.stringify({problemIdx, creator, level}),
  })
  if (response.ok) {
    return alert(menuWords.deletedProblemWarning[languageIdx])
  } 
  if (response.status === 401 || response.status === 403) {
    return loginWarning()
  }
  throw new Error(`Error: ${response.status}`)
}

export async function getProblemByIdx(problemIdx: number): Promise<ProblemAndVariations | undefined> {
  const response = await fetch(`${API_URL}${PROBLEM_DB_PATH}/get-by-idx/${problemIdx}`)
  if (response.status === 404) {
    return 
  }
  const problem = await response.json()
  return problem
}

export async function updateVariations(problemIdx: number, where: string, variations: object, name: string, creator: string, save: boolean) {
  const languageIdx = Number(localStorage.getItem(LANGUAGE_IDX))
  const userInfo: UserInfo = JSON.parse(sessionStorage.getItem(USERINFO) || initialUserInfo)
  const token = userInfo.token
  const response = await fetch(`${API_URL}${PROBLEM_DB_PATH}/update-variations`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'authorization': `Bearer ${token}`
    },
    body: JSON.stringify({problemIdx, where, variations, name, creator}),
  })
  if (response.ok) {
    if (save) {
      return alert(menuWords.saved[languageIdx])
    } else {
      if (!_.isEqual(where, QUESTIONS)) {
        alert(menuWords.deletedNotice[languageIdx])
      }
      return
    }
  }
  if (response.status === 401 || 403) {
    return loginWarning()
  }
  throw new Error(`Error: ${response.status}`)
}

export async function modifyProblem(problemIdx: number, problem: Board, comment: string, level: number, color: string, creator: string) {
  const languageIdx = Number(localStorage.getItem(LANGUAGE_IDX))
  const initialState = problem
  const userInfo: UserInfo = JSON.parse(sessionStorage.getItem(USERINFO) || initialUserInfo)
  const token = userInfo.token
  const response = await fetch(`${API_URL}${PROBLEM_DB_PATH}/modify-problem`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'authorization': `Bearer ${token}`
    },
    body: JSON.stringify({problemIdx, initialState, comment, level, color, creator}),
  })
  if (response.ok) {
    return alert(menuWords.modifiedNotice[languageIdx])
  } 
  if (response.status === 401 || 403) {
    return loginWarning()
  }
  throw new Error(`Error: ${response.status}`)
}
