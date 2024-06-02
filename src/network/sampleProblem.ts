import { API_URL, PATCH, USERINFO } from "../util/constants"
import { getRequestForm, loginWarning } from "../util/functions"
import { initialUserInfo } from "../util/initialForms"
import { SAMPLE_PATH } from "../util/paths"
import { SampleProblemInformation, UserInfo } from "../util/types"

export async function getRecommended(name: string): Promise<SampleProblemInformation[]> {
  const response = await fetch(`${API_URL}${SAMPLE_PATH}/get-recommended/${name}`)
  if (!response.ok) {
    throw new Error(`Error: ${response.status}`)
  }
  const recommended = response.json()
  return recommended
}

export async function getNewest(): Promise<SampleProblemInformation[]> {
  const response = await fetch(`${API_URL}${SAMPLE_PATH}/get-newest/`)
  if (!response.ok) {
    throw new Error(`Error: ${response.status}`)
  }
  const newest = response.json()
  return newest
}

export async function getRepresentativeProblem(name: string): Promise<SampleProblemInformation[]> {
  const response = await fetch(`${API_URL}${SAMPLE_PATH}/get-representative/${name}`)
  if (!response.ok) {
    throw new Error(`Error: ${response.status}`)
  }
  const rep = response.json()
  return rep
}

export async function getSolvedProblem(name: string): Promise<SampleProblemInformation[]> {
  const response = await fetch(`${API_URL}${SAMPLE_PATH}/get-solved/${name}`)
  if (!response.ok) {
    throw new Error(`Error: ${response.status}`)
  }
  const recommended = response.json()
  return recommended
}


export async function getSampleProblemByFilter(filter: string): Promise<SampleProblemInformation[]> {
  const response = await fetch(`${API_URL}${SAMPLE_PATH}/get-by-filter/${filter}`)
  if (!response.ok) {
    throw new Error(`Error: ${response.status}`)
  }
  const problem = await response.json()
  return problem
}

export async function getSampleProblemByIndexList(problemIndexList: number[]): Promise<SampleProblemInformation[]> {
  const stringify = JSON.stringify(problemIndexList)
  const response = await fetch(`${API_URL}${SAMPLE_PATH}/get-by-idx-list/${stringify}`)
  if (!response.ok) {
    throw new Error(`Error: ${response.status}`)
  }
  const problem = await response.json()
  return problem
}

export async function getSampleProblemByIdx(problemIndex: number): Promise<number> {
  const response = await fetch(`${API_URL}${SAMPLE_PATH}/get-by-index/${problemIndex}`)
  if (!response.ok) {
    throw new Error(`Error: ${response.status}`)
  }
  const problem = await response.json()
  return problem
}

export async function handleLiked(problemIndex: number, name: string, creator: string, add: boolean): Promise<boolean> {
  const userInfo: UserInfo = JSON.parse(sessionStorage.getItem(USERINFO) || initialUserInfo)
  const token = userInfo.token
  const requestForm = getRequestForm(PATCH, token, JSON.stringify({name, problemIndex, creator, add}))
  const response = await fetch(`${API_URL}${SAMPLE_PATH}/handle-liked`, requestForm)
  if (response.ok) {
    return true
  }
  if (response.status === 401 || 403) {
    loginWarning()
    return false
  }
  throw new Error(`Error: ${response.status}`)
}



