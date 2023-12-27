export const SET_USERNAME = "SET_USERNAME"
export const SET_USERLEVEL = "SET_USERLEVEL"
export const SET_USERPOINT = "SET_USERPOINT"
export const SET_USERSOLVED = "SET_USERSOLVED"
export const SET_USERTRIED = "SET_USERTRIED"
export const SET_USERCREATED = "SET_USERCREATED"
export const SET_USERASKED = "SET_USERASKED"

export interface SetUserNameAction {
    type: typeof SET_USERNAME
    payload: string | null
}

export interface SetUserLevelAction {
    type: typeof SET_USERLEVEL
    payload: number
}

export interface SetUserPointAction {
    type: typeof SET_USERPOINT
    payload: number
}

export interface SetUserSolvedAction {
    type: typeof SET_USERSOLVED
    payload: string[]
}

export interface SetUserTriedAction {
    type: typeof SET_USERTRIED
    payload: string[]
}

export interface SetUserCreatedAction {
    type: typeof SET_USERCREATED
    payload: string[]
}

export interface SetUserAskedAction {
    type: typeof SET_USERASKED
    payload: string[]
}





export type UserActionType = SetUserNameAction | SetUserLevelAction | 
    SetUserPointAction | SetUserSolvedAction | SetUserTriedAction |SetUserCreatedAction |
    SetUserAskedAction
