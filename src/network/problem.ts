import _ from "lodash";
import { API_URL, DELETE, LANGUAGE_IDX, PATCH, POST, QUESTIONS, TOKEN, USERINFO } from "../util/constants";
import { getLanguageIdx, getRequestForm } from "../util/functions";
import { menuWords } from "../util/menuWords";
import { Board, ProblemAndVariations, UserInfo } from "../util/types";
import { PROBLEM_DB_PATH } from "../util/paths";
import { initialUserInfo, initialVariations } from "../util/initialForms";

export async function createProblem(comment: string, problem: Board, creator: string, level: number, color: string) {
  const languageIdx = getLanguageIdx()

  const initialState = problem;
  const variations = initialVariations
  const answers = initialVariations
  const questions = initialVariations
  const token = sessionStorage.getItem(TOKEN) || ""
  const requestForm = getRequestForm(POST, token, JSON.stringify({initialState, creator, variations, answers, questions, level, comment, color}))
  const response = await fetch(`${API_URL}${PROBLEM_DB_PATH}/create`, requestForm)
  if (response.ok) {
    const r = await response.json()
    return Number(r.problemIndex)
  }
  if (response.status === 401 || response.status === 403) {
    sessionStorage.clear()
    return 0
  }
  throw new Error(`Error: ${response.status}`)
}

export async function deleteProblem(problemIdx: number, creator: string, level: number) {
  const languageIdx = getLanguageIdx()
  const token = sessionStorage.getItem(TOKEN) || ""
  const requestForm = getRequestForm(DELETE, token, JSON.stringify({problemIdx, creator, level}))
  const response = await fetch(`${API_URL}${PROBLEM_DB_PATH}/delete`, requestForm)
  if (response.ok) {
    alert(menuWords.deletedProblemWarning[languageIdx])
    return
  } 
  if (response.status === 401 || response.status === 403) {
    sessionStorage.clear()
    return
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
  const languageIdx = getLanguageIdx()
  const token = sessionStorage.getItem(TOKEN) || ""
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
    return
  }
  if (response.status === 401 || 403) {
    sessionStorage.clear()
    return
  }
  throw new Error(`Error: ${response.status}`)
}

export async function modifyProblem(problemIdx: number, problem: Board, comment: string, level: number, color: string, creator: string) {
  const languageIdx = getLanguageIdx()
  const initialState = problem
  const token = sessionStorage.getItem(TOKEN) || ""
  const requestForm = getRequestForm(PATCH, token, JSON.stringify({problemIdx, initialState, comment, level, color, creator}))
  const response = await fetch(`${API_URL}${PROBLEM_DB_PATH}/modify-problem`, requestForm)
  if (response.ok) {
    alert(menuWords.modifiedNotice[languageIdx])
    return
  } 
  if (response.status === 401 || 403) {
    sessionStorage.clear()
    return
  }
  throw new Error(`Error: ${response.status}`)
}
