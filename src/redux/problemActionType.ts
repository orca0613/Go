import { ProblemInformation } from "../util/types"

export const SET_PROBLEMS = 'SET_PROBLEMS'
export const SET_PROBLEM_INDEX = 'SET_PROBLEM_INDEX'

export interface SetProblemListAction {
    type: typeof SET_PROBLEMS
    payload: ProblemInformation[]
}

export interface SetProblemIndexAction {
    type: typeof SET_PROBLEM_INDEX
    payload: number
}

export type ProblemActionType = SetProblemListAction | SetProblemIndexAction
