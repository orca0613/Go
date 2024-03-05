import { API_URL, PROBLEMINFO_DB_PATH, USERINFO, initialUserInfo } from "../util/constants"
import { ProblemInformation, ReplyForm, UserInfo } from "../util/types"

export async function changeCount(problemId:string, where: string, name: string, count: number) {
  const userInfo: UserInfo = JSON.parse(localStorage.getItem(USERINFO) || initialUserInfo)
  const token = userInfo.token
  await fetch(`${API_URL}${PROBLEMINFO_DB_PATH}/change-count`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'authorization': `Bearer ${token}`
    },
    body: JSON.stringify({problemId, where, name, count}),
  })
    .catch(error => console.error("Error: ", error))
}

export async function addReply(problemId: string, reply: ReplyForm, name: string) {
  const userInfo: UserInfo = JSON.parse(localStorage.getItem(USERINFO) || initialUserInfo)
  const token = userInfo.token
  await fetch(`${API_URL}${PROBLEMINFO_DB_PATH}/add-reply`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'authorization': `Bearer ${token}`
    },
    body: JSON.stringify({problemId, reply, name}),
  })
    .then(response => response.json())
    .then(r => {
      alert(r.response)
    })
    .catch(error => console.error("Error: ", error))
}

export async function getProblemInformations(problemId: string): Promise<ProblemInformation> {
  const info = await fetch(`${API_URL}${PROBLEMINFO_DB_PATH}/get/${problemId}`)
  const informations: ProblemInformation = await info.json()
  return informations
}

export async function getReply(problemId: string): Promise<ReplyForm[]> {
  const response = await fetch(`${API_URL}${PROBLEMINFO_DB_PATH}/get-reply/${problemId}`)
  const replies: ReplyForm[] = await response.json()
  return replies
}

export async function addUsername(username: string, problemId: string, where: string) {
  const userInfo: UserInfo = JSON.parse(localStorage.getItem(USERINFO) || initialUserInfo)
  const token = userInfo.token
  await fetch(`${API_URL}${PROBLEMINFO_DB_PATH}/add-name`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'authorization': `Bearer ${token}`
    },
    body: JSON.stringify({username, problemId, where}),
  })
    .catch(error => console.error("Error: ", error))
}

export async function deleteUsername(username: string, problemId: string, where: string) {
  const userInfo: UserInfo = JSON.parse(localStorage.getItem(USERINFO) || initialUserInfo)
  const token = userInfo.token
  await fetch(`${API_URL}${PROBLEMINFO_DB_PATH}/delete-name`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'authorization': `Bearer ${token}`
    },
    body: JSON.stringify({username, problemId, where}),
  })
    .catch(error => console.error("Error: ", error))
}

export async function addCorrectUser(problemId:string, name: string, level: number) {
  const userInfo: UserInfo = JSON.parse(localStorage.getItem(USERINFO) || initialUserInfo)
  const token = userInfo.token
  await fetch(`${API_URL}${PROBLEMINFO_DB_PATH}/add-correct`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'authorization': `Bearer ${token}`
    },
    body: JSON.stringify({problemId, name, level}),
  })
    .catch(error => console.error("Error: ", error))
}

export async function addWrong(problemId:string, name: string, level: number) {
  const userInfo: UserInfo = JSON.parse(localStorage.getItem(USERINFO) || initialUserInfo)
  const token = userInfo.token
  await fetch(`${API_URL}${PROBLEMINFO_DB_PATH}/add-wrong`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'authorization': `Bearer ${token}`
    },
    body: JSON.stringify({problemId, name, level}),
  })
    .catch(error => console.error("Error: ", error))
}
