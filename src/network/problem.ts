import _ from "lodash";
import { API_URL, DELETE, LANGUAGE_IDX, PATCH, POST, QUESTIONS, USERINFO } from "../util/constants";
import { getRequestForm, loginWarning } from "../util/functions";
import { menuWords } from "../util/menuWords";
import { Board, ProblemAndVariations, UserInfo } from "../util/types";
import { PROBLEM_DB_PATH } from "../util/paths";
import { initialUserInfo, initialVariations } from "../util/initialForms";

export async function createProblem(comment: string, problem: Board, creator: string | null, level: number, color: string): Promise<boolean> {
  const languageIdx = Number(localStorage.getItem(LANGUAGE_IDX))

  const initialState = problem;
  const variations = initialVariations
  const answers = initialVariations
  const questions = initialVariations
  const userInfo: UserInfo = JSON.parse(sessionStorage.getItem(USERINFO) || initialUserInfo)
  const token = userInfo.token
  const requestForm = getRequestForm(POST, token, JSON.stringify({initialState, creator, variations, answers, questions, level, comment, color}))
  const response = await fetch(`${API_URL}${PROBLEM_DB_PATH}/create`, requestForm)
  if (response.ok) {
    alert(menuWords.registered[languageIdx])
    return true
  }
  if (response.status === 401 || response.status === 403) {
    loginWarning()
    return false
  }
  throw new Error(`Error: ${response.status}`)
}

export async function deleteProblem(problemIdx: number, creator: string, level: number): Promise<boolean> {
  const languageIdx = Number(localStorage.getItem(LANGUAGE_IDX))
  const userInfo: UserInfo = JSON.parse(sessionStorage.getItem(USERINFO) || initialUserInfo)
  const token = userInfo.token
  const requestForm = getRequestForm(DELETE, token, JSON.stringify({problemIdx, creator, level}))
  const response = await fetch(`${API_URL}${PROBLEM_DB_PATH}/delete`, requestForm)
  if (response.ok) {
    alert(menuWords.deletedProblemWarning[languageIdx])
    return true
  } 
  if (response.status === 401 || response.status === 403) {
    loginWarning()
    return false
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

export async function updateVariations(problemIdx: number, where: string, variations: object, name: string, creator: string, save: boolean): Promise<boolean> {
  const languageIdx = Number(localStorage.getItem(LANGUAGE_IDX))
  const userInfo: UserInfo = JSON.parse(sessionStorage.getItem(USERINFO) || initialUserInfo)
  const token = userInfo.token
  const requestForm = getRequestForm(PATCH, token, JSON.stringify({problemIdx, where, variations, name, creator}))
  const response = await fetch(`${API_URL}${PROBLEM_DB_PATH}/update-variations`, requestForm)
  if (response.ok) {
    if (save) {
      alert(menuWords.saved[languageIdx])
    } else {
      if (!_.isEqual(where, QUESTIONS)) {
        alert(menuWords.deletedNotice[languageIdx])
      }
    }
    return true
  }
  if (response.status === 401 || 403) {
    loginWarning()
    return false
  }
  throw new Error(`Error: ${response.status}`)
}

export async function modifyProblem(problemIdx: number, problem: Board, comment: string, level: number, color: string, creator: string): Promise<boolean> {
  const languageIdx = Number(localStorage.getItem(LANGUAGE_IDX))
  const initialState = problem
  const userInfo: UserInfo = JSON.parse(sessionStorage.getItem(USERINFO) || initialUserInfo)
  const token = userInfo.token
  const requestForm = getRequestForm(PATCH, token, JSON.stringify({problemIdx, initialState, comment, level, color, creator}))
  const response = await fetch(`${API_URL}${PROBLEM_DB_PATH}/modify-problem`, requestForm)
  if (response.ok) {
    alert(menuWords.modifiedNotice[languageIdx])
    return true
  } 
  if (response.status === 401 || 403) {
    loginWarning()
    return false
  }
  throw new Error(`Error: ${response.status}`)
}
