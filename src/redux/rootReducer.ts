import { combineReducers } from "redux"
import { userReducer } from "./userReducer"

export type rootState = ReturnType<typeof rootReducer>

export const rootReducer = combineReducers({
    user: userReducer
})