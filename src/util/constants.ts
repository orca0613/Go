import { Coordinate, ProblemAndVariations } from "./types"

export const sampleBoardSize: number = 200
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

export const initialProblemInfo: ProblemAndVariations = {
    _id: "",
    initialState: [["."]],
    variations: {},
    answers: {},
    questions: {},
    color: "",
    level: 0,
    creator: "",
    comment: "",
    time: new Date()
}

export const initialUserInfo = '{"name":"","token":"","level":0,"point":0,"created":[],"withQuestions":[],"tried":[],"solved":[],"liked":[],"disliked":[]}'

export const initialVariations = {"0": []}
export const API_URL = "http://localhost:3001"
// export const API_URL = "https://go-problem-test.an.r.appspot.com"
export const HOME = "/"
export const PROBLEM_PATH = "/all-problems"
export const CREATE_PATH = "/create"
export const SIGNUP_PATH = "/signup"
export const LOGIN_PATH = "/login"
export const bonus = 100
export const loginFailCases = ["Not exist email", "Wrong password"]
export const PROBLEM_DB_PATH = "/problems"
export const USER_DB_PATH = "/users"
export const PROBLEMINFO_DB_PATH = "/problem-info"
export const USERDETAIL_DB_PATH = "/user-detail"
export const LANGUAGE_IDX = "languageIdx"
export const USERINFO = "userInfo"
export const CREATED = "created"
export const TRIED = "tried"
export const SOLVED = "solved"
export const UNRESOLVED = "unresolved"
export const WITHQUESTIONS = "withQuestions"
export const LIKED = "liked"
export const DISLIKED = "disliked"
export const TRY = "try"
export const SELF = "self"
export const ANSWER = "answer"
export const VARIATIONS = "variations"
export const ANSWERS = "answers"
export const QUESTIONS = "questions"
export const boardSizeArray = Array.from({length: 17}, (_, index) => index + 3)
export const levelArray = [-9, -8, -7, -6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]
export const resolution = 4
export const MARGIN = 1
export const COMMENT = "comment"
export const TURN = "turn"
export const LEVEL = "level"