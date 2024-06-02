import { API_URL, USERINFO } from "../util/constants"
import { loginWarning } from "../util/functions"
import { initialUserInfo } from "../util/initialForms"
import { MESSAGE_DB_PATH } from "../util/paths"
import { UserInfo } from "../util/types"

export async function sendMessage(sender: string, receiver: string, title: string, contents: string, quotation: string) {
  if (!title) {
    title = "No title"
  }
  if (!contents) {
    contents = "No content"
  }
  const userInfo: UserInfo = JSON.parse(sessionStorage.getItem(USERINFO) || initialUserInfo)
  const token = userInfo.token
  const response = await fetch(`${API_URL}${MESSAGE_DB_PATH}/send`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'authorization': `Bearer ${token}`
    },
    body: JSON.stringify({sender, receiver, title, contents, quotation}),
  })
  if (response.ok) {
    return true
  }
  if (response.status === 401 || 403) {
    return loginWarning()
  }
  throw new Error(`Error: ${response.status}`)
}

export async function getReceivedMessage() {
  const userInfo: UserInfo = JSON.parse(sessionStorage.getItem(USERINFO) || initialUserInfo)
  const username = userInfo.name
  const response = await fetch(`${API_URL}${MESSAGE_DB_PATH}/get-by-receiver/${username}`)
  if (!response.ok) {
    throw new Error(`Error: ${response.status}`)
  }
  const messageList = await response.json()
  return messageList
}

export async function getSentMessage() {
  const userInfo: UserInfo = JSON.parse(sessionStorage.getItem(USERINFO) || initialUserInfo)
  const username = userInfo.name
  const response = await fetch(`${API_URL}${MESSAGE_DB_PATH}/get-by-sender/${username}`)
  if (!response.ok) {
    throw new Error(`Error: ${response.status}`)
  }
  const messageList = await response.json()
  return messageList
}

export async function getMessageById(id: string) {
  const response = await fetch(`${API_URL}${MESSAGE_DB_PATH}/get-by-id/${id}`)
  if (!response.ok) {
    throw new Error(`Error: ${response.status}`)
  }
  const messageList = await response.json()
  return messageList
}

export async function checkMessage(id: string): Promise<boolean> {
  const userInfo: UserInfo = JSON.parse(sessionStorage.getItem(USERINFO) || initialUserInfo)
  const name = userInfo.name
  const token = userInfo.token
  const response = await fetch(`${API_URL}${MESSAGE_DB_PATH}/check`, {
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
    loginWarning()
    return false
  }
  throw new Error(`Error: ${response.status}`)
}

export async function getNumberUnchecked(): Promise<number> {
  const userInfo: UserInfo = JSON.parse(sessionStorage.getItem(USERINFO) || initialUserInfo)
  const name = userInfo.name
  const response = await fetch(`${API_URL}${MESSAGE_DB_PATH}/get-unchecked/${name}`)
  if (!response.ok) {
    throw new Error(`Error: ${response.status}`)
  }
  const unchecked = await response.json()
  return unchecked
}

export async function hideMessage(idList: string, where: string): Promise<boolean> {
  const userInfo: UserInfo = JSON.parse(sessionStorage.getItem(USERINFO) || initialUserInfo)
  const name = userInfo.name
  const token = userInfo.token
  const response = await fetch(`${API_URL}${MESSAGE_DB_PATH}/hide-message`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'authorization': `Bearer ${token}`
    },
    body: JSON.stringify({idList, name, where}),
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
