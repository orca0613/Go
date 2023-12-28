import { ProblemInfo } from "../util/types";
import { SET_PROBLEMS, SET_PROBLEM_INDEX, SetProblemIndexAction, SetProblemListAction } from "./problemActionType";
import { SET_USERASKED, SET_USERCREATED, SET_USERLEVEL, SET_USERNAME, SET_USERPOINT, SET_USERSOLVED, SET_USERTRIED, SetUserAskedAction, SetUserCreatedAction, SetUserLevelAction, SetUserNameAction, SetUserPointAction, SetUserSolvedAction, SetUserTriedAction } from "./userActionTypes";

export function setUserName(userName: string | null): SetUserNameAction {
  return {
    type: SET_USERNAME,
    payload: userName,
  }
}

export function setUserLevel(userLevel: number): SetUserLevelAction {
  return {
    type: SET_USERLEVEL,
    payload: userLevel,
  }
}

export function setUserPoint(userPoint: number): SetUserPointAction {
  return {
    type: SET_USERPOINT,
    payload: userPoint,
  }
}

export function setUserSolved(userSolved: string[]): SetUserSolvedAction {
  return {
    type: SET_USERSOLVED,
    payload: userSolved,
  }
}

export function setUserTried(userTried: string[]): SetUserTriedAction {
  return {
    type: SET_USERTRIED,
    payload: userTried,
  }
}

export function setUserCreated(userCreated: string[]): SetUserCreatedAction {
  return {
    type: SET_USERCREATED,
    payload: userCreated,
  }
}

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

export function setUserAsked(userAsked: string[]): SetUserAskedAction {
  return {
    type: SET_USERASKED,
    payload: userAsked,
  }
}