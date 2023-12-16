import { getDeadGroup, handleMove } from "../gologic/logic"
import { setUserLevel, setUserName, setUserPoint } from "../redux/actions"
import problemStore from "../store/problemStore"
import userStore from "../store/userStore"
import { LANGUAGE_IDX, USERLEVEL, USERNAME, USERPOINT } from "./constants"
import { menuWords } from "./menuWords"
import { Board, Coordinate, Variations } from "./types"
import _ from 'lodash'

const languageIdx = Number(localStorage.getItem(LANGUAGE_IDX))

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

export function getCoordinate(e: React.MouseEvent, lineSpacing: number) {
  const x = Math.floor(e.clientX / lineSpacing)
  const y = Math.floor(e.clientY / lineSpacing)
  const coord: Coordinate = [y, x]
  return coord
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

export function convertFromStringToTwoD(board: string): Board {
  const boardSize = Math.round(board.length ** 0.5)
  if (boardSize !== board.length ** 0.5) {
    throw Error("bad board!")
  }

  const newBoard: Board = []
  for (let i = 0; i < boardSize; i++) {
    const line = board.slice(0, boardSize).split("")
    newBoard.push(line)
    board = board.slice(boardSize)
  }
  return newBoard
}

export function convertFromTwoDToString(board: Board): string {
  let newBoard = ""
  for (let i = 0; i < board.length; i++) {
    newBoard += board[i].join("")
  }
  return newBoard
}

export function divmod(num1: number, num2: number): Coordinate {
  const share = Math.floor(num1 / num2)
  const remainder = num1 % num2
  return [share, remainder]
}

export function addVariations(currentKey: string, variations: Variations, l: string[]) {
  if (currentKey in variations) {
    console.log(menuWords.duplicateVariationWarning[languageIdx])
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

export function addAnswers(currentKey: string, answers: Variations, l: string[]) {
  if (currentKey in answers) {
    console.log(menuWords.duplicateVariationWarning[languageIdx])
    return answers
  }
  const newAnswers = _.cloneDeep(answers)
  newAnswers[currentKey] = []
  let key = currentKey
  for (let i = l.length - 1; i > 0; i--) {
    const value = l[i]
    key = key.slice(0, key.length - (value.length + 1))
    if (key in newAnswers) {
      newAnswers[key].push(value)
    } else {
      newAnswers[key] = [value]
    }
    if (key in answers) {
      break
    }
  }
  return newAnswers
}


export function removeVariations(currentKey: string, variations: Variations) {
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

export function removeAnswers(currentKey: string, answers: Variations) {
  const newAnswers = _.cloneDeep(answers)
  let key = currentKey
  const l = currentKey.split("-")
  while (true) {
    if (newAnswers[key].length === 0 && key !== '0') {
      delete newAnswers[key]
      const lastMove = l.pop()
      key = lastMove? key.slice(0, key.length - (lastMove.length + 1)) : key
      newAnswers[key] = newAnswers[key].filter(element => element !== lastMove)
    } else {
      break
    }
  }
  return newAnswers
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

export function removeFromKey(key: string) {
  let newKey = key
  for (let i = key.length - 1; i >= 0; i--) {
    if (key[i] === '-') {
      newKey = key.slice(0, i)
      break
    }
  }
  return newKey
}


export function addToKey(coord: Coordinate, lines: number, key: string) {
  const y = coord[0], x = coord[1]
  const k = String(y * lines + x)
  return key + '-' + k
}

export function logout() {
  localStorage.removeItem(USERNAME)
  localStorage.removeItem(USERLEVEL)
  localStorage.removeItem(USERPOINT)
}

export function checkSolved() {
  const idx = problemStore.getState().curIndex
  const problemId = problemStore.getState().problemList[idx]._id
  const solved = userStore.getState().userSolved
  return solved.includes(problemId)
}

export function checkTried() {
  const idx = problemStore.getState().curIndex
  const problemId = problemStore.getState().problemList[idx]._id
  const tried = userStore.getState().userTried
  console.log(tried)
  return tried.includes(problemId)
}