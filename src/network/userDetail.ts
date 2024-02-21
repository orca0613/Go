import { API_URL, TOKEN, USERDETAIL_DB_PATH, USERNAME, USERPOINT } from "../util/constants"
import { CreatorInfo } from "../util/types"

export function addElement(element: string, name: string, where: string) {
  const token = localStorage.getItem(TOKEN)
  fetch(`${API_URL}${USERDETAIL_DB_PATH}/add-element`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'authorization': `Bearer ${token}`
    },
    body: JSON.stringify({element, name, where}),
  })
    .catch(error => console.error("Error: ", error))
}


export function deleteElement(element: string, name: string, where: string) {
  const token = localStorage.getItem(TOKEN)
  fetch(`${API_URL}${USERDETAIL_DB_PATH}/delete-element`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'authorization': `Bearer ${token}`
    },
    body: JSON.stringify({element, name, where}),
  })
    .catch(error => console.error("Error: ", error))
}

export async function getUserDetail(name: string | null) {
  if (name === null) {
    return
  }
  const response = await fetch(`${API_URL}${USERDETAIL_DB_PATH}/get/${name}`)
  const detail = await response.json()
  return detail
}

export async function getAllCreators(): Promise<string[]> {
  const result: string[] = []
  const response = await fetch(`${API_URL}${USERDETAIL_DB_PATH}/get-creators`)
  const creators: CreatorInfo[] = await response.json()
  creators.map(c => {
    result.push(c.name)
  })
  return result 
}

export function changeInfoAndPoint(problemId: string, where: string, point: number) {
  const name = localStorage.getItem(USERNAME)
  const curPoint = Number(localStorage.getItem(USERPOINT))
  const newPoint = curPoint + point
  const token = localStorage.getItem(TOKEN)
  localStorage.setItem(USERPOINT, String(newPoint))
  fetch(`${API_URL}${USERDETAIL_DB_PATH}/change`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      'authorization': `Bearer ${token}`
    },
    body: JSON.stringify({name, point, problemId, where})
  })
    .catch(error => console.error("Error: ", error))
}

