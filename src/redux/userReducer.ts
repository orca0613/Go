import { SET_USERASKED, SET_USERCREATED, SET_USERLEVEL, SET_USERNAME, SET_USERPOINT, SET_USERSOLVED, SET_USERTRIED, UserActionType } from "./userActionTypes"

interface UserState {
    userName: string | null
    userLevel: number
    userPoint: number
    userSolved: string[]
    userTried: string[]
    userCreated: string[]
    userAsked: string[]
}

const initialState: UserState = {
    userName: '',
    userLevel: NaN,
    userPoint: 0,
    userSolved: [],
    userTried: [],
    userCreated: [],
    userAsked: [],
}

export function userReducer(state = initialState, action: UserActionType): UserState {
    switch (action.type) {
        case SET_USERNAME:
            return {
                ...state,
                userName: action.payload
            }
        case SET_USERLEVEL:
            return {
                ...state,
                userLevel: action.payload
            }
        case SET_USERPOINT:
            return {
                ...state,
                userPoint: action.payload
            }
        case SET_USERSOLVED:
            return {
                ...state,
                userSolved: action.payload
            }
        case SET_USERTRIED:
            return {
                ...state,
                userTried: action.payload
            }
        case SET_USERCREATED:
            return {
                ...state,
                userCreated: action.payload
            }
        case SET_USERASKED:
            return {
                ...state,
                userAsked: action.payload
            }

        default:
            return state
    }
}