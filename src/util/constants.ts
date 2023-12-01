import { Coordinate } from "./types"

export const boardWidth: number = 600

export const sampleBoardSize: number = 120

export const flowerPointPosition: Coordinate[][] = [
    [],
    [],
    [],
    [],
    [[2, 2]],
    [],
    [[3, 3]],
    [[2, 2], [2, 5], [5, 2], [5, 5]],
    [[2, 2], [2, 6], [4, 4], [6, 2], [6, 6]],
    [[2, 2], [2, 7], [7, 2], [7, 7]],
    [[2, 2], [2, 8], [5, 5], [8, 2], [8, 8]],
    [[3, 3], [3, 8], [8, 3], [8, 8]],
    [[3, 3], [3, 9], [6, 6],[9, 3], [9, 9]],
    [[3, 3], [3, 10], [10, 3], [10, 10]],
    [[3, 3], [3, 11], [7, 7], [11, 3], [11, 11]],
    [[3, 3], [3, 12], [12, 3], [12, 12]],
    [[3, 3], [3, 8], [3, 13], [8, 3], [8, 8], [8, 13], [13, 3], [13, 8], [13, 13]],
    [[3, 3], [3, 14], [14, 3], [14, 14]],
    [[3, 3], [3, 9], [3, 15], [9, 3], [9, 9], [9, 15], [15, 3], [15, 9], [15, 15]],
]

export const USER_NAME = "userName"
export const USER_LEVEL = "userLevel"
export const API_URL = "http://localhost:3001"
export const HOME = "http://localhost:5173/home"
export const PROBLEM_PATH = "problems"
export const REGISTER_PATH = "register"
export const VARIATION_PATH = "test-variations"
export const SIGNUP_PATH = "signup"
export const LOGIN_PATH = ""
export const SEARCH_PATH = "search"
