import { API_URL, PATCH, POST, USERINFO } from "../util/constants"
import { getRequestForm, loginWarning } from "../util/functions"
import { initialUserInfo } from "../util/initialForms"
import { REPLY_DB_PATH } from "../util/paths"
import { ReplyForm, UserInfo } from "../util/types"

export async function addReply(problemId: string, comment: string, name: string): Promise<boolean> {
  const userInfo: UserInfo = JSON.parse(sessionStorage.getItem(USERINFO) || initialUserInfo)
  const token = userInfo.token
  const requestForm = getRequestForm(POST, token, JSON.stringify({problemId, comment, name}))
  const response = await fetch(`${API_URL}${REPLY_DB_PATH}/add`, requestForm)
  if (response.ok) {
    return true
  }
  if (response.status === 401 || 403) {
    loginWarning()
    return false
  }
  throw new Error(`Error: ${response.status}`)
}

export async function hideReply(id: string, name: string): Promise<boolean> {
  const userInfo: UserInfo = JSON.parse(sessionStorage.getItem(USERINFO) || initialUserInfo)
  const token = userInfo.token
  const requestForm = getRequestForm(PATCH, token, JSON.stringify({id, name}))
  const response = await fetch(`${API_URL}${REPLY_DB_PATH}/hide`, requestForm)
  if (response.ok) {
    return true
  }
  if (response.status === 401 || 403) {
    return false
  }
  throw new Error(`Error: ${response.status}`)


}

export async function getReplies(problemId: string): Promise<ReplyForm[]> {
  const response = await fetch(`${API_URL}${REPLY_DB_PATH}/get/${problemId}`)
  if (!response.ok) {
    throw new Error(`Error: ${response.status}`)
  }
  const replies: ReplyForm[] = await response.json()
  return replies
}