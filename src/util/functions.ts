
import { getDeadGroup, handleMove } from "../gologic/logic"
import { LANGUAGE_IDX, PAGE, PROBLEM_INDICES, SORTING_IDX } from "./constants"
import { menuWords } from "./menuWords"
import { Board, Coordinate, Filter, SampleProblemInformation, Variations } from "./types"
import _ from 'lodash'

export function playMoveAndReturnNewBoard(board: Board, coord: Coordinate, color: string) {
  let newBoard = _.cloneDeep(board)
  newBoard = handleMove(
    {
      board: newBoard,
      color: color,
      currentMove: coord
    }
  )
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
  const l = currentKey.split("-")
  while (true) {
    if (newVariations[key].length === 0 && key !== '0') {
      delete newVariations[key]
      const lastMove = l.pop()
      key = lastMove? key.slice(0, key.length - (lastMove.length + 1)) : key
      newVariations[key] = newVariations[key].filter(element => element !== lastMove)
    } else {
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
  const languageIdx = Number(localStorage.getItem(LANGUAGE_IDX))
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

export function ownStringify(filter: Filter) {
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

export function sortingProblemList(problemList: SampleProblemInformation[], option: number) {
  const newProblemList = problemList
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

export function setProblemIndicies(problemList: SampleProblemInformation[]) {
  const indices: number[] = []
  problemList.map(p => {
    indices.push(p.problemIndex)
  })
  sessionStorage.setItem(PROBLEM_INDICES, JSON.stringify(indices))
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

export function ExcludeSolvedProblems(problemList: SampleProblemInformation[], solved: number[]) {
  const newProblemList: SampleProblemInformation[] = []
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

