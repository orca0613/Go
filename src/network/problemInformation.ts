import { API_URL, LANGUAGE_IDX, USERINFO } from "../util/constants"
import { loginWarning } from "../util/functions"
import { initialUserInfo } from "../util/initialForms"
import { menuWords } from "../util/menuWords"
import { PROBLEMINFO_DB_PATH } from "../util/paths"
import { ProblemInformation, UserInfo } from "../util/types"

export async function changeCount(problemIdx: number, where: string, name: string, count: number) {
  const userInfo: UserInfo = JSON.parse(sessionStorage.getItem(USERINFO) || initialUserInfo)
  const token = userInfo.token
  const response = await fetch(`${API_URL}${PROBLEMINFO_DB_PATH}/change-count`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'authorization': `Bearer ${token}`
    },
    body: JSON.stringify({problemIdx, where, name, count}),
  })
  if (response.ok) {
    return
  }
  if (response.status === 401 || 403) {
    return loginWarning()
  }
  throw new Error(`Error: ${response.status}`)
}

export async function getProblemInformations(problemIdx: number): Promise<ProblemInformation> {
  const response = await fetch(`${API_URL}${PROBLEMINFO_DB_PATH}/get/${problemIdx}`)
  if (!response.ok) {
    throw new Error(`Error: ${response.status}`)
  }
  const informations: ProblemInformation = await response.json()
  return informations
}

export async function addUsername(username: string, problemIdx: number, where: string) {
  const userInfo: UserInfo = JSON.parse(sessionStorage.getItem(USERINFO) || initialUserInfo)
  const token = userInfo.token
  const response = await fetch(`${API_URL}${PROBLEMINFO_DB_PATH}/add-name`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'authorization': `Bearer ${token}`
    },
    body: JSON.stringify({username, problemIdx, where}),
  })
  if (response.ok) {
    return
  }
  if (response.status === 401 || 403) {
    return loginWarning()
  }
  throw new Error(`Error: ${response.status}`)

}

export async function deleteUsername(username: string, problemIdx: number, where: string) {
  const userInfo: UserInfo = JSON.parse(sessionStorage.getItem(USERINFO) || initialUserInfo)
  const token = userInfo.token
  const response = await fetch(`${API_URL}${PROBLEMINFO_DB_PATH}/delete-name`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'authorization': `Bearer ${token}`
    },
    body: JSON.stringify({username, problemIdx, where}),
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

export async function getRecommended(name: string): Promise<ProblemInformation[]> {
  const response = await fetch(`${API_URL}${PROBLEMINFO_DB_PATH}/get-recommended/${name}`)
  if (!response.ok) {
    throw new Error(`Error: ${response.status}`)
  }
  const recommended = response.json()
  return recommended
}

export async function getNewest(): Promise<ProblemInformation[]> {
  const response = await fetch(`${API_URL}${PROBLEMINFO_DB_PATH}/get-newest/`)
  if (!response.ok) {
    throw new Error(`Error: ${response.status}`)
  }
  const newest = response.json()
  return newest
}

export async function getRepresentativeProblem(name: string): Promise<ProblemInformation[]> {
  const response = await fetch(`${API_URL}${PROBLEMINFO_DB_PATH}/get-representative/${name}`)
  if (!response.ok) {
    throw new Error(`Error: ${response.status}`)
  }
  const rep = response.json()
  return rep
}

export async function getSolvedProblem(name: string): Promise<ProblemInformation[]> {
  const response = await fetch(`${API_URL}${PROBLEMINFO_DB_PATH}/get-solved/${name}`)
  if (!response.ok) {
    throw new Error(`Error: ${response.status}`)
  }
  const recommended = response.json()
  return recommended
}

export async function getProblemByIndexList(problemIndexList: number[]): Promise<ProblemInformation[]> {
  const stringify = JSON.stringify(problemIndexList)
  const response = await fetch(`${API_URL}${PROBLEMINFO_DB_PATH}/get-by-idx-list/${stringify}`)
  if (!response.ok) {
    throw new Error(`Error: ${response.status}`)
  }
  const problem = await response.json()
  return problem
}

export async function getProblemByFilter(filter: string): Promise<ProblemInformation[]> {
  const response = await fetch(`${API_URL}${PROBLEMINFO_DB_PATH}/get-by-filter/${filter}`)
  if (!response.ok) {
    throw new Error(`Error: ${response.status}`)
  }
  const problem = await response.json()
  return problem
}

export async function getUserPageProblem(name: string): Promise<ProblemInformation[]> {
  const response = await fetch(`${API_URL}${PROBLEMINFO_DB_PATH}/get-userpage/${name}`)
  if (!response.ok) {
    throw new Error(`Error: ${response.status}`)
  }
  const problem = await response.json()
  return problem
}


export async function handleLiked(username: string, problemIdx: number, creator: string, add: boolean) {
  const userInfo: UserInfo = JSON.parse(sessionStorage.getItem(USERINFO) || initialUserInfo)
  const token = userInfo.token
  const response = await fetch(`${API_URL}${PROBLEMINFO_DB_PATH}/handle-liked`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'authorization': `Bearer ${token}`
    },
    body: JSON.stringify({username, problemIdx, creator, add}),
  })
  if (response.ok) {
    return
  }
  if (response.status === 401 || 403) {
    return loginWarning()
  }
  throw new Error(`Error: ${response.status}`)
}
