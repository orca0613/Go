import { API_URL, LANGUAGE_IDX, PATCH, USERINFO, } from "../util/constants"
import { getRequestForm, loginWarning } from "../util/functions"
import { initialUserInfo } from "../util/initialForms"
import { USERDETAIL_DB_PATH } from "../util/paths"
import { CreatorInfo, UserDetailFromServer, UserInfo } from "../util/types"

export async function addElement(element: number, name: string, where: string): Promise<boolean> {
  const userInfo: UserInfo = JSON.parse(sessionStorage.getItem(USERINFO) || initialUserInfo)
  const token = userInfo.token
  const requestForm = getRequestForm(PATCH, token, JSON.stringify({element, name, where}))
  const response = await fetch(`${API_URL}${USERDETAIL_DB_PATH}/add-element`, requestForm)
  if (response.ok) {
    return true
  }
  if (response.status === 401 || 403) {
    loginWarning()
    return false
  }
  throw new Error(`Error: ${response.status}`)

}

export async function getUserDetail(name: string): Promise<UserDetailFromServer> {
  const response = await fetch(`${API_URL}${USERDETAIL_DB_PATH}/get/${name}`)
  if (!response.ok) {
    throw new Error(`Error: ${response.status}`)
  }
  const detail = await response.json()
  return detail
}

export async function getAllCreators(): Promise<string[]> {
  const result: string[] = []
  const response = await fetch(`${API_URL}${USERDETAIL_DB_PATH}/get-creators`)
  if (!response.ok) {
    throw new Error(`Error: ${response.status}`)
  }
  const creators: CreatorInfo[] = await response.json()
  creators.map(c => {
    result.push(c.name)
  })
  return result 
}

export async function settingChange(language: number, level: number, auto: boolean) {
  const userInfo: UserInfo = JSON.parse(sessionStorage.getItem(USERINFO) || initialUserInfo)
  const name = userInfo.name
  const token = userInfo.token
  const requestForm = getRequestForm(PATCH, token, JSON.stringify({name, language, level, auto}))
  const update = await fetch(`${API_URL}${USERDETAIL_DB_PATH}/setting`, requestForm)
  if (update.ok) {
    localStorage.setItem(LANGUAGE_IDX, String(language))
    userInfo.auto = auto
    userInfo.level = level
    userInfo.language = language
    sessionStorage.setItem(USERINFO, JSON.stringify(userInfo))
    return true
  }
  throw new Error(`Error: ${update.status}`)
}
