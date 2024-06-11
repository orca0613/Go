import { API_URL, PATCH, USERINFO } from "../util/constants"
import { getRequestForm } from "../util/functions"
import { initialUserInfo } from "../util/initialForms"
import { PROBLEMINFO_DB_PATH } from "../util/paths"
import { ProblemInformation, UserInfo } from "../util/types"

export async function changeCount(problemIdx: number, where: string, name: string, count: number) {
  const userInfo: UserInfo = JSON.parse(sessionStorage.getItem(USERINFO) || initialUserInfo)
  const token = userInfo.token
  const requestForm = getRequestForm(PATCH, token, JSON.stringify({problemIdx, where, name, count}))
  const response = await fetch(`${API_URL}${PROBLEMINFO_DB_PATH}/change-count`, requestForm)
  if (response.ok) {
    return
  }
  if (response.status === 401 || 403) {
    sessionStorage.clear()
    return
  }
  throw new Error(`Error: ${response.status}`)
}

export async function getProblemInformations(problemIdx: number): Promise<ProblemInformation> {
  const response = await fetch(`${API_URL}${PROBLEMINFO_DB_PATH}/get/${problemIdx}`)
  if (!response.ok) {
    throw new Error(`Error: ${response.status}`)
  }
  const informations: ProblemInformation = await response.json()
  return informations
}

export async function addCorrectUser(problemIndex:number, name: string, level: number, problemLevel: number) {
  const userInfo: UserInfo = JSON.parse(sessionStorage.getItem(USERINFO) || initialUserInfo)
  const token = userInfo.token
  const requestForm = getRequestForm(PATCH, token, JSON.stringify({problemIndex, name, level, problemLevel}))
  const response = await fetch(`${API_URL}${PROBLEMINFO_DB_PATH}/add-correct`, requestForm)
  if (response.ok) {
    return
  }
  if (response.status === 401 || 403) {
    sessionStorage.clear()
    return
  }
  throw new Error(`Error: ${response.status}`)
}

export async function addWrong(problemIndex:number, name: string, level: number, problemLevel: number) {
  const userInfo: UserInfo = JSON.parse(sessionStorage.getItem(USERINFO) || initialUserInfo)
  const token = userInfo.token
  const requestForm = getRequestForm(PATCH, token, JSON.stringify({problemIndex, name, level, problemLevel}))
  const response = await fetch(`${API_URL}${PROBLEMINFO_DB_PATH}/add-wrong`, requestForm)
  if (response.ok) {
    return
  }
  if (response.status === 401 || 403) {
    sessionStorage.clear()
    return
  }
  throw new Error(`Error: ${response.status}`)
}
