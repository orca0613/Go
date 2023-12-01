import { SET_USERLEVEL, SET_USERNAME, UserActionType } from "./userActionTypes"

interface UserState {
    username: string
    userlevel: number
}

const initialState: UserState = {
    username: '',
    userlevel: 0,
}

export function userReducer(state = initialState, action: UserActionType): UserState {
    switch (action.type) {
        case SET_USERNAME:
            return {
                ...state,
                username: action.payload
            }
        case SET_USERLEVEL:
            return {
                ...state,
                userlevel: action.payload
            }
        default:
            return state
    }
}