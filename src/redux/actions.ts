import { ProblemInfo } from "../util/types";
import { SET_PROBLEMS, SET_PROBLEM_INDEX, SetProblemIndexAction, SetProblemListAction } from "./problemActionType";
import { SET_USERLEVEL, SET_USERNAME, SetUserlevelAction, SetUsernameAction } from "./userActionTypes";

export function setUsername(username: string): SetUsernameAction {
  return {
    type: SET_USERNAME,
    payload: username
  }
}

export function setUserlevel(userlevel: number): SetUserlevelAction {
  return {
    type: SET_USERLEVEL,
    payload: userlevel
  }
}

export function setProblemList(problemList: ProblemInfo[]): SetProblemListAction {
  return {
    type: SET_PROBLEMS,
    payload: problemList
  }
}

export function setProblemIndex(index: number): SetProblemIndexAction {
  return {
    type: SET_PROBLEM_INDEX,
    payload: index
  }
}