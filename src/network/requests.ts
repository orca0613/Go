import { API_URL, LANGUAGE_IDX, USERINFO } from "../util/constants"
import { loginWarning } from "../util/functions"
import { initialUserInfo } from "../util/initialForms"
import { REQUESTS_DB_PATH } from "../util/paths"
import { UserInfo } from "../util/types"

export async function sendRequest(problemIdx: number, creator: string, client: string, key: string) {
  const userInfo: UserInfo = JSON.parse(sessionStorage.getItem(USERINFO) || initialUserInfo)
  const token = userInfo.token
  const language = Number(localStorage.getItem(LANGUAGE_IDX))
  const response = await fetch(`${API_URL}${REQUESTS_DB_PATH}/send`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'authorization': `Bearer ${token}`
    },
    body: JSON.stringify({problemIdx, creator, client, language, key}),
  })
  if (response.ok) {
    return
  }
  if (response.status === 401 || 403) {
    return loginWarning()
  }
  throw new Error(`Error: ${response.status}`)
}

export async function checkRequest(problemIdx: number, creator: string, key: string) {
  const userInfo: UserInfo = JSON.parse(sessionStorage.getItem(USERINFO) || initialUserInfo)
  const token = userInfo.token
  const response = await fetch(`${API_URL}${REQUESTS_DB_PATH}/check`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'authorization': `Bearer ${token}`
    },
    body: JSON.stringify({problemIdx, creator, key}),
  })
  if (response.ok) {
    return 
  }
  if (response.status === 401 || 403) {
    return loginWarning()
  }
  throw new Error(`Error: ${response.status}`)
}