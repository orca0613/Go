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
  problemIdx: -1,
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

export const initialUserInfo = '{"name":"","token":"","level":0,"point":0,"created":[],"withQuestions":[],"tried":[],"solved":[],"liked":[],"disliked":[],"asked":[],"language":0,"auto":"false"}'

export const initialVariations = {"0": []}
// export const API_URL = "http://localhost:3001"
export const API_URL = "https://go-problem-test.an.r.appspot.com"
export const HOME = "/"
export const SITE_NAME = "GO-PROBLEM"
export const MYPAGE_PATH = "/mypage"
export const PROBLEM_PATH = "/problems"
export const CREATE_PATH = "/create"
export const SIGNUP_PATH = "/signup"
export const LOGIN_PATH = "/login"
export const bonus = 100
export const loginFailCases = ["Not exist email", "Wrong password"]
export const PROBLEM_DB_PATH = "/problems"
export const USER_DB_PATH = "/users"
export const PROBLEMINFO_DB_PATH = "/problem-info"
export const USERDETAIL_DB_PATH = "/user-detail"
export const REPLY_DB_PATH = "/reply"
export const MESSAGE_DB_PATH = "/message"
export const REQUESTS_DB_PATH = "/requests"
export const LANGUAGE_IDX = "languageIdx"
export const USERINFO = "userInfo"
export const CREATED = "created"
export const TRIED = "tried"
export const SOLVED = "solved"
export const ASKED = "asked"
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
export const SORTING_IDX = "sortingIdx"
export const PAGE = "page"
export const boardSizeArray = Array.from({length: 17}, (_, index) => index + 3)
export const levelArray = [-9, -8, -7, -6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]
export const resolution = 4
export const MARGIN = 1
export const COMMENT = "comment"
export const TURN = "turn"
export const LEVEL = "level"
export const PROBLEM_INDICES = "problemIndices"
export const PROBLEM_INDEX = "problemIndex"
export const sortingMethods = [
  ["Newest", "Oldest", "Level(h - l)", "Level(l - h)", "Like", "View(h - l)", "View(l - h)"],
  ["최신 순", "오래된 순", "레벨 높은 순", "레벨 낮은 순", "좋아요", "조회수 높은 순", "조회수 낮은 순"],
  ["按新排序", "按最旧排序", "级别（高 -> 低)", "级别（低 -> 高)", "喜欢", "观看次数（高 -> 低)", "观看次数（低 -> 高)"],
  ["新しい順", "古い順",  "レベル（高 -> 低)", "レベル（低 -> 高)", "好き", "ヒット（高 -> 低)", "ヒット（低 -> 高"]
]
export const tiersList = [
  ["All levels", "Hardest (5D ~ 9D)", "Hard (1D ~ 4D)", "Medium (6K ~ 1K)", "Easy (12K ~ 7K)", "Easiest (18K ~ 13K)"],
  ["모든 레벨", "가장 어려움 (5단 ~ 9단)", "어려움 (1단 ~ 4단)", "보통 (6급 ~ 1급)", "쉬움 (12급 ~ 7급)", "가장 쉬움 (18급 ~ 13급)"],
  ["所有级别", "最难的 (5段 ~ 9段)", "难的 (1段 ~ 4段)", "中等难度 (6级 ~ 1级)", "简单的 (12级 ~ 7级)", "最简单的 (18级 ~ 13级)"],
  ["すべてのレベル", "最も難しい (5段 ~ 9段)", "難しい (1段 ~ 4段)", "普通 (6級 ~ 1級)", "簡単 (12級 ~ 7級)", "最も簡単 (18級 ~ 13級)"]
]
export const mobileFontSize = "80%"
export const languageList = ["ENG", "한국어", "中文", "日本語"]
export const initFilter = {
  tier: 0,
  low: -10,
  high: 19,
  creator: "",
  page: 0,
}
export const initIndices = "[]"
export const expires = 365 * 24 * 60 * 60 * 1000
export const problemsPerPage = 20

export const detailLevel = [
  [0, -9, -8, -7, -6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
  [0, -5, -6, -7, -8, -9],
  [0, -1, -2, -3, -4],
  [0, 6, 5, 4, 3, 2, 1],
  [0, 12, 11, 10, 9, 8, 7],
  [0, 18, 17, 16, 15, 14, 13]
]