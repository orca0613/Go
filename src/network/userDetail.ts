import { API_URL, LANGUAGE_IDX, USERDETAIL_DB_PATH, USERINFO, initialUserInfo, } from "../util/constants"
import { loginWarning } from "../util/functions"
import { menuWords } from "../util/menuWords"
import { CreatorInfo, UserDetailFromServer, UserInfo } from "../util/types"

export async function addElement(element: number, name: string, where: string) {
  const userInfo: UserInfo = JSON.parse(sessionStorage.getItem(USERINFO) || initialUserInfo)
  const token = userInfo.token
  const response = await fetch(`${API_URL}${USERDETAIL_DB_PATH}/add-element`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'authorization': `Bearer ${token}`
    },
    body: JSON.stringify({element, name, where}),
  })
  if (response.ok) {
    return
  }
  if (response.status === 401 || 403) {
    return loginWarning()
  }
  throw new Error(`Error: ${response.status}`)

}


export async function deleteElement(element: number, name: string, where: string) {
  const userInfo: UserInfo = JSON.parse(sessionStorage.getItem(USERINFO) || initialUserInfo)
  const token = userInfo.token
  const response = await fetch(`${API_URL}${USERDETAIL_DB_PATH}/delete-element`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'authorization': `Bearer ${token}`
    },
    body: JSON.stringify({element, name, where}),
  })
  if (response.ok) {
    return
  }
  if (response.status === 401 || 403) {
    return loginWarning()
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
  const username = userInfo.name
  const token = userInfo.token
  const update = await fetch(`${API_URL}${USERDETAIL_DB_PATH}/setting`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      'authorization': `Bearer ${token}`
    },
    body: JSON.stringify({username, language, level, auto})
  })
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

