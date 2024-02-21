import { ProblemInfo } from "../util/types";
import { SET_PROBLEMS, SET_PROBLEM_INDEX, SetProblemIndexAction, SetProblemListAction } from "./problemActionType";

export function setProblemList(problemList: ProblemInfo[]): SetProblemListAction {
  return {
    type: SET_PROBLEMS,
    payload: problemList,
  }
}

export function setProblemIndex(index: number): SetProblemIndexAction {
  return {
    type: SET_PROBLEM_INDEX,
    payload: index,
  }
}
