import { API_URL, LANGUAGE_IDX, PATCH, POST, USERINFO } from "../util/constants"
import { getRequestForm } from "../util/functions"
import { initialUserInfo } from "../util/initialForms"
import { menuWords } from "../util/menuWords"
import { MESSAGE_DB_PATH } from "../util/paths"
import { UserInfo } from "../util/types"

export async function sendMessage(sender: string, receiver: string, title: string, contents: string, quotation: string) {
  const languageIdx = Number(localStorage.getItem(LANGUAGE_IDX))
  if (!title) {
    title = "No title"
  }
  if (!contents) {
    contents = "No content"
  }
  const userInfo: UserInfo = JSON.parse(sessionStorage.getItem(USERINFO) || initialUserInfo)
  const token = userInfo.token
  const requestForm = getRequestForm(POST, token, JSON.stringify({sender, receiver, title, contents, quotation}))
  const response = await fetch(`${API_URL}${MESSAGE_DB_PATH}/send`, requestForm)
  if (response.ok) {
    alert(menuWords.sent[languageIdx])
    return
  }
  if (response.status === 401 || 403) {
    sessionStorage.clear()
    return
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

export async function checkMessage(id: string) {
  const userInfo: UserInfo = JSON.parse(sessionStorage.getItem(USERINFO) || initialUserInfo)
  const name = userInfo.name
  const token = userInfo.token
  const requestForm = getRequestForm(PATCH, token, JSON.stringify({id, name}))
  const response = await fetch(`${API_URL}${MESSAGE_DB_PATH}/check`, requestForm)
  if (response.ok) {
    return
  }
  if (response.status === 401 || 403) {
    sessionStorage.clear()
    return
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

export async function hideMessage(idList: string, where: string) {
  const userInfo: UserInfo = JSON.parse(sessionStorage.getItem(USERINFO) || initialUserInfo)
  const name = userInfo.name
  const token = userInfo.token
  const requestForm = getRequestForm(PATCH, token, JSON.stringify({idList, name, where}))
  const response = await fetch(`${API_URL}${MESSAGE_DB_PATH}/hide-message`, requestForm)
  if (response.ok) {
    return 
  }
  if (response.status === 401 || 403) {
    sessionStorage.clear()
    return
  }
  throw new Error(`Error: ${response.status}`)
}
