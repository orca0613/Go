import { API_URL, LANGUAGE_IDX, USERINFO, USER_DB_PATH, initialUserInfo } from "../util/constants"
import { menuWords } from "../util/menuWords"
import { UserInfo } from "../util/types"

export async function checkMail(email: string) {
  const response = await fetch(`${API_URL}${USER_DB_PATH}/check-email/${email}`)
  if (!response.ok) {
    throw new Error(`Error: ${response.status}`)
  }
  const duplicated: boolean = await response.json()
  return duplicated
}

export async function checkUserName(name: string) {
  const response = await fetch(`${API_URL}${USER_DB_PATH}/check-name/${name}`)
  if (!response.ok) {
    throw new Error(`Error: ${response.status}`)
  }
  const duplicated: boolean = await response.json()
  return duplicated
}

export async function createUser(email: string, password: string, name: string, level: number, language: number) {
  const languageIdx = Number(localStorage.getItem(LANGUAGE_IDX))
  const response = await fetch(`${API_URL}${USER_DB_PATH}/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({email, password, name, level, language}),
  })
  if (response.ok) {
    return alert(menuWords.checkMailWarning[languageIdx])
  }
  throw new Error(`Error: ${response.status}`)
}

export async function logIn(email: string, password: string): Promise<string> {
  // 이메일과 패스워드를 통해 로그인 시도. 로그인에 성공하면 서버로부터 유저의 정보가 리턴됨.
  const languageIdx = Number(localStorage.getItem(LANGUAGE_IDX))
  const userInfo: UserInfo = JSON.parse(sessionStorage.getItem(USERINFO) || initialUserInfo)
  const response = await fetch(`${API_URL}${USER_DB_PATH}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  })
  if (!response.ok) {
    if (response.status === 404) {
      alert(menuWords.noMailWarning[languageIdx])
    } else if (response.status === 403) {
      alert(menuWords.verifyWarning[languageIdx])
    } else if (response.status === 400) {
      alert(menuWords.incorrectPasswordWarning[languageIdx])
    } else {
      throw new Error(`Error: ${response.status}`)
    }
    return ""
  }
  const userData = await response.json()
  const newUserInfo: UserInfo = {
    ...userInfo,
    name: userData.name,
    level: userData.level,
    token: userData.token,
    language: userData.language
  }
  localStorage.setItem(LANGUAGE_IDX, userData.language)
  sessionStorage.setItem(USERINFO, JSON.stringify(newUserInfo))
  return userData.name
}

export async function verifyMail(userId: string): Promise<boolean> {
  const response = await fetch(`${API_URL}${USER_DB_PATH}/verify/${userId}`, {method: 'PATCH'})
  if (!response.ok) {
    if (response.status === 404) {
      return false
    }
    throw new Error(`Error: ${response.status}`)
  }
  return true
}

export async function changePassword(id: string, password: string) {
  const languageIdx = Number(localStorage.getItem(LANGUAGE_IDX))
  const response = await fetch(`${API_URL}${USER_DB_PATH}/change-password`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id, password }),
  })
  if (response.ok) {
    alert(menuWords.modifiedNotice[languageIdx])
    return true
  }
  return false
}

export async function checkPassword(name: string, password: string) {
  const info = name + " " + password
  const response = await fetch(`${API_URL}${USER_DB_PATH}/check-password/${info}`)
  if (response.ok) {
    const data = await response.json()
    return data.id
  }
  if (response.status === 401 || response.status === 403 || response.status === 404) {
    return undefined
  }
  throw new Error(`Error: ${response.status}`)
}

export async function checkMailAndSendUrl(email: string) {
  const response = await fetch(`${API_URL}${USER_DB_PATH}/check-mail/${email}`)
  if (response.ok) {
    return true
  } 
  if (response.status === 404) {
    return false
  }
  throw new Error(`Error: ${response.status}`)
}

