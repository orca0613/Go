import { string } from "zod"
import { getDeadGroup, handleMove } from "../gologic/logic"
import { CREATED, LANGUAGE_IDX, LIKED, PAGE, PROBLEM_INDEX, PROBLEM_INDICES, REQUESTS, SOLVED, SORTING_IDX, UNRESOLVED, USERINFO, expires } from "./constants"
import { initialUserInfo } from "./initialForms"
import { menuWords } from "./menuWords"
import { Board, Coordinate, FilterForm, SampleProblemInformation, UserInfo, Variations } from "./types/types"
import _ from 'lodash'
import { LOGIN_PATH } from "./paths"
import { errorMessages } from "./errorMessages"

export function playMoveAndReturnNewBoard(board: Board, coord: Coordinate, color: string) {
  const newBoard = handleMove(board, color, coord)
  return newBoard
}

export function makeRandomNumber(n: number) {
  return Math.floor(Math.random() * n)
}

export function makingEmptyBoard(size: number): Board {
  const board: Board = []
  for (let i = 0; i < size; i++) {
    board.push([])
    for (let j = 0; j < size; j++) {
      board[i].push('.')
    }
  }
  return board
}

export function divmod(num1: number, num2: number): Coordinate {
  const share = Math.floor(num1 / num2)
  const remainder = num1 % num2
  return [share, remainder]
}

export function addCurrentVariation(currentKey: string, variations: Variations, l: string[]) {
  if (currentKey in variations) {
    return variations
  }
  const newVariations = _.cloneDeep(variations)
  newVariations[currentKey] = []
  let key = currentKey
  for (let i = l.length - 1; i > 0; i--) {
    const value = l[i]
    key = key.slice(0, key.length - (value.length + 1))
    if (key in newVariations) {
      newVariations[key].push(value)
    } else {
      newVariations[key] = [value]
    }
    if (key in variations) {
      break
    }
  }
  return newVariations
}

export function removeCurrentVariation(currentKey: string, variations: Variations) {
  const newVariations = _.cloneDeep(variations)
  let key = currentKey
  const newKey = currentKey + "-"
  Object.keys(newVariations).forEach(k => {
    if (k.startsWith(newKey)) {
      delete newVariations[k]
    }
  })
  const l = currentKey.split("-")
  while (l) {
    if (!newVariations.hasOwnProperty(key)) return newVariations
    delete newVariations[key]
    const lastMove = l.pop()
    key = lastMove? key.slice(0, key.length - (lastMove.length + 1)) : key
    newVariations[key] = newVariations[key].filter(element => element !== lastMove)
    if (!newVariations.hasOwnProperty(key) || newVariations[key].length > 0 || key === '0') {
      break
    } 
  }
  return newVariations
}

export function isLegalBoard(board: Board) {
  const size = board.length
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      const color = board[i][j]
      if (color !== ".") {
        const opponentColor = color === "b"? "w" : "b"
        const deadGroup = getDeadGroup(board, [i, j], color, opponentColor)
        if (deadGroup.length > 0) {
          return false
        }
      }
    }
  }
  return true
}

export function addToKey(coord: Coordinate, lines: number, key: string) {
  const y = coord[0], x = coord[1]
  const k = String(y * lines + x)
  return key + '-' + k
}

export function getAverageLevel(total: number, divider:number): number {
  if (divider === 0) {
    return 19
  }
  const average = total / divider
  if (average <= 18 && average <= 1) {
    return Math.round(average)
  }
  if (average <= -1 && average <= -9) {
    return Math.round(average)
  }
  if (average > 0) {
    return 1
  }
  return -1
}

export function isValidEmail(email: string): boolean {
  const emailRegex: RegExp = /^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

export function loginWarning() {
  const languageIdx = getLanguageIdx()
  alert(menuWords.loginWarning[languageIdx])
}

export function getTier(level: number) {
  if (level < -9 || level > 18) {return 0}
  if (level < -4) {return 1}
  if (level < 0) {return 2}
  if (level < 7) {return 3}
  if (level < 13) {return 4}
  return 5
}

export function getRangeByTier(tier: number): number[] {
  switch (tier) {
    case 1:
      return [-10, -4]
    case 2:
      return [-5, 0]
    case 3:
      return [0, 7]
    case 4:
      return [6, 13]
    case 5:
      return [12, 19]
    default:
      return [-10, 19]
  }
}

export function ownStringify(filter: FilterForm) {
  let r = ""
  const entries = Object.entries(filter)
  entries.forEach(([key, value]) => {
    r += key + "=" + value + "&"
  })
  return r
}

export function ownParse(param: string) {
  interface myObject {
    [key: string]: number | string
  }
  const filter: myObject = {}
  const parts = param.split("&")
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i]
    if (!part) {
      continue
    }
    const [key, value] = part.split("=")
    filter[key] = value
  }
  return filter
}

export function sortingProblemList(problemList: SampleProblemInformation[] | undefined, option: number) {
  const newProblemList = problemList? [...problemList] : []
  switch (option) {
    case 0:
      newProblemList.sort((a, b) => b.problemIndex - a.problemIndex)
      break
    case 1:
      newProblemList.sort((a, b) => a.problemIndex - b.problemIndex)
      break
    case 2:
      newProblemList.sort((a, b) => {
        if (a.level === b.level) {
          return b.problemIndex - a.problemIndex
        } else {
          return a.level - b.level
        }
      })
      break
    case 3:
      newProblemList.sort((a, b) => {
        if (a.level === b.level) {
          return b.problemIndex - a.problemIndex
        } else {
          return b.level - a.level
        }
      })
      break
    case 4:
      newProblemList.sort((a, b) => {
        if (a.liked === b.liked) {
          return b.problemIndex - a.problemIndex
        } else {
          return b.liked - a.liked
        }
      })
      break
    default:
      break
  }
  return newProblemList
}

export function resetSortingForm(page: number, sortingIdx: number) {
  sessionStorage.setItem(PAGE, String(page))
  sessionStorage.setItem(SORTING_IDX, String(sortingIdx))
}

export function setProblemIndicies(problemList: SampleProblemInformation[], problemIndex?: number) {
  const indices: number[] = []
  problemList.map(p => {
    indices.push(p.problemIndex)
  })
  sessionStorage.setItem(PROBLEM_INDICES, JSON.stringify(indices))
  if (problemIndex !== undefined) sessionStorage.setItem(PROBLEM_INDEX, String(problemIndex))
}

export function getGreetings(name: string, language: number) {
  switch (language) {
    case 0:
      return `Recommended problems for ${name}`
    case 1:
      return `${name}님을 위한 추천 문제`
    case 2:
      return `为您精选的问题`
    case 3:
      return `${name}様におすすめの問題`
    default:
      return `Recommended problems for ${name}`
  }
}

export function excludeSolvedProblems(problemList: SampleProblemInformation[] | undefined, solved: number[]): SampleProblemInformation[] {
  const newProblemList: SampleProblemInformation[] = []
  if (!problemList) {
    return newProblemList
  }
  problemList.map(p => {
    if (!solved.includes(p.problemIndex)) {
      newProblemList.push(p)
    }
  })
  return newProblemList
}

export function getRequestForm(method: string, token: string, body: string) {
  const requestForm = {
    method: method,
    headers: {
      'Content-Type': 'application/json',
      'authorization': `Bearer ${token}`
    },
    body: body,
  }
  return requestForm
}

export function saveChanging(language: number, level: number, auto: boolean) {
  const userInfo: UserInfo = JSON.parse(sessionStorage.getItem(USERINFO) || initialUserInfo)
  localStorage.setItem(LANGUAGE_IDX, String(language))
  userInfo.auto = auto,
  userInfo.level = level,
  userInfo.language = language
  sessionStorage.setItem(USERINFO, JSON.stringify(userInfo))
}

export function getUnsolvedIdxArray(tried: number[] | undefined, solved: number[] | undefined) {
  const newTried = tried? tried : []
  const newSolved = solved? solved : []
  const unsolved = newTried.filter(idx => !newSolved.includes(idx))
  return unsolved
}

// export function getUserInfo(): UserInfo {
//   const userInfo: UserInfo = JSON.parse(sessionStorage.getItem(USERINFO) || initialUserInfo)
//   return userInfo
// }


export function getLanguageIdx(): number {
  const languageIdx = Number(localStorage.getItem(LANGUAGE_IDX))
  return languageIdx
}

export function getLevelText(level: number, lang?: number): string {
  const languageIdx = lang? lang : getLanguageIdx()
  let levelText = String(Math.abs(level))
  levelText += level > 0? menuWords.K[languageIdx] : menuWords.D[languageIdx]
  return levelText
}

export function getAdjacentProblemIndex(isNext: boolean): number {
  const problemList: number[] = JSON.parse(sessionStorage.getItem(PROBLEM_INDICES) || "[]")
  const newIndex = isNext? Number(sessionStorage.getItem(PROBLEM_INDEX)) + 1 : Number(sessionStorage.getItem(PROBLEM_INDEX)) - 1
  if (newIndex < 0 || newIndex >= problemList.length) {
    return 0
  }
  sessionStorage.setItem(PROBLEM_INDEX, String(newIndex))
  const nextProblemIdx = problemList[newIndex]
  return nextProblemIdx
}

export function addProblemIndexToUserInfo(where: number, problemIndex: number) {
  const userInfo: UserInfo = JSON.parse(sessionStorage.getItem(USERINFO) || initialUserInfo)
  let idx = NaN
  switch (where) {
    case 0:
      userInfo.created.push(problemIndex)
      break
    case 1:
      userInfo.tried.push(problemIndex)
      break
    case 2:
      userInfo.solved.push(problemIndex)
      break
    case 3:
      userInfo.liked.push(problemIndex)
      break
    case 4:
      idx = userInfo.liked.indexOf(problemIndex)
      userInfo.liked.splice(idx, 1)
      break
    case 5:
      idx = userInfo.withQuestions.indexOf(problemIndex)
      userInfo.withQuestions.splice(idx, 1)
      break

    default:
      break
  }
  sessionStorage.setItem(USERINFO, JSON.stringify(userInfo))
}

export function handleSeeAnswer(problemIndex: number) {
  const userInfo: UserInfo = JSON.parse(sessionStorage.getItem(USERINFO) || initialUserInfo)
  if (userInfo.solved.includes(problemIndex)) {
    return
  }
  addProblemIndexToUserInfo(2, problemIndex)
}

function setCookie(name: string, val: string) {
  let date = new Date()
  date.setTime(date.getTime() + expires)
  document.cookie = `${name}=${val}; expires=${date.toUTCString()}; SameSite=None; Secure`
}

export function getCookie(name: string) {
  const nameEQ = name + "="
  const cookies = document.cookie.split(";")
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trimStart()
    if (cookie.indexOf(nameEQ) === 0) {
      return cookie.substring(nameEQ.length, cookie.length)
    }
  }
  return ""
}

export function saveLoginInfo(email: string, pw: string, save: boolean) {
  if (save) {
    setCookie("email", email)
    setCookie("pw", pw)
    setCookie("saved", JSON.stringify(true))
  } else {
    setCookie("email", "")
    setCookie("pw", "")
    setCookie("saved", "")
  }
}

export function getPageName(part: string) {
  const languageIdx = getLanguageIdx()
  let pageName = ""
  switch (part) {
    case CREATED:
      pageName = menuWords.created[languageIdx]
      break
    case SOLVED:
      pageName = menuWords.solved[languageIdx]
      break
    case UNRESOLVED:
      pageName = menuWords.unresolved[languageIdx]
      break
    case LIKED:
      pageName = menuWords.liked[languageIdx]
      break
    case REQUESTS: 
      menuWords.requestsReceived[languageIdx]
      break
    default:
      break
  }
  return pageName
}

export function alertErrorMessage(status: number, message?: string) {
  const languageIdx = getLanguageIdx()
  if (message) {
    alert(message)
    return
  }
  switch (status) {
    case 400:
      return alert(errorMessages[400][languageIdx])
    case 401:
      alert(errorMessages[401][languageIdx])
      return window.location.replace(LOGIN_PATH)
    case 403:
      alert(errorMessages[403][languageIdx])
      return window.location.replace(LOGIN_PATH)
    case 404:
      return alert(errorMessages[404][languageIdx])
    case 500:
      return alert(errorMessages[500][languageIdx])
    default:
      return alert(errorMessages[0][languageIdx])
  }
}

export function logOut() {
  sessionStorage.clear()
  saveLoginInfo("", "", false)
  window.location.replace(LOGIN_PATH)
}
