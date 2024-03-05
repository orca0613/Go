import { API_URL, USERDETAIL_DB_PATH, USERINFO, initialUserInfo, } from "../util/constants"
import { CreatorInfo, UserDetailFromServer, UserInfo } from "../util/types"

export async function addElement(element: string, name: string, where: string) {
  const userInfo: UserInfo = JSON.parse(localStorage.getItem(USERINFO) || initialUserInfo)
  const token = userInfo.token
  await fetch(`${API_URL}${USERDETAIL_DB_PATH}/add-element`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'authorization': `Bearer ${token}`
    },
    body: JSON.stringify({element, name, where}),
  })
   .catch(error => console.error("Error: ", error))
}


export async function deleteElement(element: string, name: string, where: string) {
  const userInfo: UserInfo = JSON.parse(localStorage.getItem(USERINFO) || initialUserInfo)
  const token = userInfo.token
  await fetch(`${API_URL}${USERDETAIL_DB_PATH}/delete-element`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'authorization': `Bearer ${token}`
    },
    body: JSON.stringify({element, name, where}),
  })
   .catch(error => console.error("Error: ", error))
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

export async function changeInfoAndPoint(problemId: string, where: string, point: number) {
  const userInfo: UserInfo = JSON.parse(localStorage.getItem(USERINFO) || initialUserInfo)
  const name = userInfo.name
  const token = userInfo.token
  userInfo.point += point
  localStorage.setItem(USERINFO, JSON.stringify(userInfo))
  await fetch(`${API_URL}${USERDETAIL_DB_PATH}/change`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      'authorization': `Bearer ${token}`
    },
    body: JSON.stringify({name, point, problemId, where})
  })
    .catch(error => console.error("Error: ", error))
}

