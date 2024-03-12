import { API_URL, LANGUAGE_IDX, PROBLEMINFO_DB_PATH, USERINFO, initialUserInfo } from "../util/constants"
import { loginWarning } from "../util/functions"
import { menuWords } from "../util/menuWords"
import { ProblemInformation, ReplyForm, UserInfo } from "../util/types"

export async function changeCount(problemId:string, where: string, name: string, count: number) {
  const userInfo: UserInfo = JSON.parse(sessionStorage.getItem(USERINFO) || initialUserInfo)
  const token = userInfo.token
  const response = await fetch(`${API_URL}${PROBLEMINFO_DB_PATH}/change-count`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'authorization': `Bearer ${token}`
    },
    body: JSON.stringify({problemId, where, name, count}),
  })
  if (response.ok) {
    return
  }
  if (response.status === 401 || 403) {
    return loginWarning()
  }
  throw new Error(`Error: ${response.status}`)
}

export async function addReply(problemId: string, reply: ReplyForm, name: string) {
  const userInfo: UserInfo = JSON.parse(sessionStorage.getItem(USERINFO) || initialUserInfo)
  const token = userInfo.token
  const response = await fetch(`${API_URL}${PROBLEMINFO_DB_PATH}/add-reply`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'authorization': `Bearer ${token}`
    },
    body: JSON.stringify({problemId, reply, name}),
  })
  if (response.ok) {
    return
  }
  if (response.status === 401 || 403) {
    return loginWarning()
  }
  throw new Error(`Error: ${response.status}`)
}

export async function getProblemInformations(problemId: string): Promise<ProblemInformation> {
  const response = await fetch(`${API_URL}${PROBLEMINFO_DB_PATH}/get/${problemId}`)
  if (!response.ok) {
    throw new Error(`Error: ${response.status}`)
  }
  const informations: ProblemInformation = await response.json()
  return informations
}

export async function getReply(problemId: string): Promise<ReplyForm[]> {
  const response = await fetch(`${API_URL}${PROBLEMINFO_DB_PATH}/get-reply/${problemId}`)
  if (!response.ok) {
    throw new Error(`Error: ${response.status}`)
  }
  const replies: ReplyForm[] = await response.json()
  return replies
}

export async function addUsername(username: string, problemId: string, where: string) {
  const userInfo: UserInfo = JSON.parse(sessionStorage.getItem(USERINFO) || initialUserInfo)
  const token = userInfo.token
  const response = await fetch(`${API_URL}${PROBLEMINFO_DB_PATH}/add-name`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'authorization': `Bearer ${token}`
    },
    body: JSON.stringify({username, problemId, where}),
  })
  if (response.ok) {
    return
  }
  if (response.status === 401 || 403) {
    return loginWarning()
  }
  throw new Error(`Error: ${response.status}`)

}

export async function deleteUsername(username: string, problemId: string, where: string) {
  const userInfo: UserInfo = JSON.parse(sessionStorage.getItem(USERINFO) || initialUserInfo)
  const token = userInfo.token
  const response = await fetch(`${API_URL}${PROBLEMINFO_DB_PATH}/delete-name`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'authorization': `Bearer ${token}`
    },
    body: JSON.stringify({username, problemId, where}),
  })
  if (response.ok) {
    return
  }
  if (response.status === 401 || 403) {
    return loginWarning()
  }
  throw new Error(`Error: ${response.status}`)
}

export async function addCorrectUser(problemId:string, name: string, level: number) {
  const userInfo: UserInfo = JSON.parse(sessionStorage.getItem(USERINFO) || initialUserInfo)
  const token = userInfo.token
  const response = await fetch(`${API_URL}${PROBLEMINFO_DB_PATH}/add-correct`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'authorization': `Bearer ${token}`
    },
    body: JSON.stringify({problemId, name, level}),
  })
  if (response.ok) {
    return
  }
  if (response.status === 401 || 403) {
    return loginWarning()
  }
  throw new Error(`Error: ${response.status}`)
}

export async function addWrong(problemId:string, name: string, level: number) {
  const userInfo: UserInfo = JSON.parse(sessionStorage.getItem(USERINFO) || initialUserInfo)
  const token = userInfo.token
  const response = await fetch(`${API_URL}${PROBLEMINFO_DB_PATH}/add-wrong`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'authorization': `Bearer ${token}`
    },
    body: JSON.stringify({problemId, name, level}),
  })
  if (response.ok) {
    return
  }
  if (response.status === 401 || 403) {
    return loginWarning()
  }
  throw new Error(`Error: ${response.status}`)
}

export async function getRecommended() {
  const response = await fetch(`${API_URL}${PROBLEMINFO_DB_PATH}/get-recommended`)
  if (!response.ok) {
    throw new Error(`Error: ${response.status}`)
  }
  const recommended = response.json()
  return recommended
}

export async function getAllProblems(): Promise<ProblemInformation[]> {
  const response = await fetch(`${API_URL}${PROBLEMINFO_DB_PATH}/get-all`)
  if (!response.ok) {
    throw new Error(`Error: ${response.status}`)
  }
  const problems = await response.json()
  return problems 
}

export async function getProblemByCreator(creator: string | null): Promise<ProblemInformation[]> {
  const response = await fetch(`${API_URL}${PROBLEMINFO_DB_PATH}/get-by-creator/${creator}`)
  if (!response.ok) {
    throw new Error(`Error: ${response.status}`)
  }
  const problems = await response.json()
  return problems
}


export async function getProblemByLevel(level: number): Promise<ProblemInformation[]> {
  const response = await fetch(`${API_URL}${PROBLEMINFO_DB_PATH}/get-by-level/${level}`)
  if (!response.ok) {
    throw new Error(`Error: ${response.status}`)
  }
  const problems = await response.json()
  return problems
}

export async function getProblemByIdList(problemIdList: string[]): Promise<ProblemInformation[]> {
  const stringify = JSON.stringify(problemIdList)
  const response = await fetch(`${API_URL}${PROBLEMINFO_DB_PATH}/get-by-id-list/${stringify}`)
  if (!response.ok) {
    throw new Error(`Error: ${response.status}`)
  }
  const problem = await response.json()
  return problem
}
