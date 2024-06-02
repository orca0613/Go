import { API_URL, USERINFO } from "../util/constants"
import { loginWarning } from "../util/functions"
import { initialUserInfo } from "../util/initialForms"
import { REPLY_DB_PATH } from "../util/paths"
import { ReplyForm, UserInfo } from "../util/types"

export async function addReply(problemId: string, comment: string, name: string) {
  const userInfo: UserInfo = JSON.parse(sessionStorage.getItem(USERINFO) || initialUserInfo)
  const token = userInfo.token
  const response = await fetch(`${API_URL}${REPLY_DB_PATH}/add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'authorization': `Bearer ${token}`
    },
    body: JSON.stringify({problemId, comment, name}),
  })
  if (response.ok) {
    return true
  }
  if (response.status === 401 || 403) {
    loginWarning()
    return false
  }
  throw new Error(`Error: ${response.status}`)
}

export async function hideReply(id: string, name: string) {
  const userInfo: UserInfo = JSON.parse(sessionStorage.getItem(USERINFO) || initialUserInfo)
  const token = userInfo.token
  const response = await fetch(`${API_URL}${REPLY_DB_PATH}/hide`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'authorization': `Bearer ${token}`
    },
    body: JSON.stringify({id, name}),
  })
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