import _ from "lodash";
import { API_URL } from "../util/constants";
import { ProblemAndVariations } from "../util/types";
import { PROBLEM_DB_PATH } from "../util/paths";

export async function getProblemByIdx(problemIdx: number): Promise<ProblemAndVariations | undefined> {
  const response = await fetch(`${API_URL}${PROBLEM_DB_PATH}/get-by-idx/${problemIdx}`)
  if (response.status === 404) {
    return 
  }
  const problem = await response.json()
  return problem
}
