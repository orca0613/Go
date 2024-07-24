import { API_URL, LANGUAGE_IDX, PATCH, POST, TOKEN, USERINFO } from "../util/constants"
import { getRequestForm } from "../util/functions"
import { initialUserInfo } from "../util/initialForms"
import { REQUESTS_DB_PATH } from "../util/paths"
import { UserInfo } from "../util/types"

export async function sendRequest(problemIdx: number, creator: string, client: string, key: string) {
  const token = sessionStorage.getItem(TOKEN) || ""
  const language = Number(localStorage.getItem(LANGUAGE_IDX))
  const requestForm = getRequestForm(POST, token, JSON.stringify({problemIdx, creator, client, language, key}))
  const response = await fetch(`${API_URL}${REQUESTS_DB_PATH}/send`, requestForm)
  if (response.ok) {
    return
  }
  if (response.status === 401 || 403) {
    sessionStorage.clear()
    return
  }
  throw new Error(`Error: ${response.status}`)
}

export async function checkRequest(problemIdx: number, creator: string, key: string) {
  const token = sessionStorage.getItem(TOKEN) || ""
  const requestForm = getRequestForm(PATCH, token, JSON.stringify({problemIdx, creator, key}))
  const response = await fetch(`${API_URL}${REQUESTS_DB_PATH}/check`, requestForm)
  if (response.ok) {
    return
  }
  if (response.status === 401 || 403) {
    sessionStorage.clear()
    return
  }
  throw new Error(`Error: ${response.status}`)
}