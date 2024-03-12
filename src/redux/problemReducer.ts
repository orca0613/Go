import { ProblemInformation } from "../util/types"
import { ProblemActionType, SET_PROBLEMS, SET_PROBLEM_INDEX } from "./problemActionType"

interface ProblemListState {
  problemList: ProblemInformation[]
  curIndex: number
}

const initialState: ProblemListState = {
  problemList: [],
  curIndex: -1
}

export function problemReducer(state = initialState, action: ProblemActionType): ProblemListState {
  switch (action.type) {
      case SET_PROBLEMS:
          return {
              ...state,
              problemList: action.payload
          }
      case SET_PROBLEM_INDEX:
          return {
              ...state,
              curIndex: action.payload
          }
      default:
          return state
  }
}