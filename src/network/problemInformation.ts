import { API_URL, PROBLEMINFO_DB_PATH, TOKEN } from "../util/constants"
import { InformationOfProblem, ReplyForm } from "../util/types"

export function changeCount(problemId:string, where: string, name: string, negative?: boolean) {
  const token = localStorage.getItem(TOKEN)
  let count = 1
  if (negative) {
    count *= -1
  }
  fetch(`${API_URL}${PROBLEMINFO_DB_PATH}/change-count`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'authorization': `Bearer ${token}`
    },
    body: JSON.stringify({problemId, where, name, count}),
  })
    .catch(error => console.error("Error: ", error))
}

export function addReply(problemId: string, reply: ReplyForm, name: string) {
  const token = localStorage.getItem(TOKEN)
  fetch(`${API_URL}${PROBLEMINFO_DB_PATH}/add-reply`, {
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

export async function getProblemInformations(problemId: string): Promise<InformationOfProblem> {
  const info = await fetch(`${API_URL}${PROBLEMINFO_DB_PATH}/get/${problemId}`)
  const informations: InformationOfProblem = await info.json()
  return informations
}

export async function getReply(problemId: string): Promise<ReplyForm[]> {
  const response = await fetch(`${API_URL}${PROBLEMINFO_DB_PATH}/get-reply/${problemId}`)
  const replies: ReplyForm[] = await response.json()
  return replies
}

