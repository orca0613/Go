import { API_URL, PATCH, TOKEN, } from "../util/constants"
import { getRequestForm } from "../util/functions"
import { USERDETAIL_DB_PATH } from "../util/paths"
import { UserDetailFromServer, UserInfo } from "../util/types"

export async function addElement(element: number, name: string, where: string) {
  const token = sessionStorage.getItem(TOKEN) || ""
  const requestForm = getRequestForm(PATCH, token, JSON.stringify({element, name, where}))
  const response = await fetch(`${API_URL}${USERDETAIL_DB_PATH}/add-element`, requestForm)
  if (response.ok) {
    return
  }
  if (response.status === 401 || 403) {
    sessionStorage.clear()
    return
  }
  throw new Error(`Error: ${response.status}`)

}

export async function addTried(problemIndex: number, name: string) {
  const token = sessionStorage.getItem(TOKEN) || ""
  const requestForm = getRequestForm(PATCH, token, JSON.stringify({problemIndex, name}))
  const response = await fetch(`${API_URL}${USERDETAIL_DB_PATH}/add-tried`, requestForm)
  if (response.ok) {
    return
  }
  if (response.status === 401 || 403) {
    sessionStorage.clear()
    return
  }
  throw new Error(`Error: ${response.status}`)

}


export async function addSolved(problemIndex: number, name: string) {
  const token = sessionStorage.getItem(TOKEN) || ""
  const requestForm = getRequestForm(PATCH, token, JSON.stringify({problemIndex, name}))
  const response = await fetch(`${API_URL}${USERDETAIL_DB_PATH}/add-solved`, requestForm)
  if (response.ok) {
    return
  }
  if (response.status === 401 || 403) {
    sessionStorage.clear()
    return
  }
  throw new Error(`Error: ${response.status}`)

}


