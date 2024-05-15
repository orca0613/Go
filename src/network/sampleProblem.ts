import { API_URL } from "../util/constants"
import { SAMPLE_PATH } from "../util/paths"
import { SampleProblemInformation } from "../util/types"

export async function getSampleProblemByTier(tier: number): Promise<SampleProblemInformation[]> {
  const response = await fetch(`${API_URL}${SAMPLE_PATH}/get-by-tier/${tier}`)
  if (!response.ok) {
    throw new Error(`Error: ${response.status}`)
  }
  const problem = await response.json()
  return problem
}

export async function getSampleProblemByFilter(filter: string): Promise<SampleProblemInformation[]> {
  const response = await fetch(`${API_URL}${SAMPLE_PATH}/get-by-filter/${filter}`)
  if (!response.ok) {
    throw new Error(`Error: ${response.status}`)
  }
  const problem = await response.json()
  return problem
}


export async function getSampleProblemByLevel(path: string, level: number): Promise<SampleProblemInformation[]> {
  const response = await fetch(`${API_URL}${path}/get/${level}`)
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



