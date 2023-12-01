export const SET_USERNAME = 'SET_USERNAME'
export const SET_USERLEVEL = 'SET_USERLEVEL'

export interface SetUsernameAction {
    type: typeof SET_USERNAME
    payload: string
}

export interface SetUserlevelAction {
    type: typeof SET_USERLEVEL
    payload: number
}

export type UserActionType = SetUsernameAction | SetUserlevelAction
