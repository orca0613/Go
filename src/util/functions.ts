import { useNavigate } from "react-router-dom"
import { getDeadGroup, handleMove } from "../gologic/logic"
import { LANGUAGE_IDX } from "./constants"
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

export function divmod(num1: number, num2: number): Coordinate {
  const share = Math.floor(num1 / num2)
  const remainder = num1 % num2
  return [share, remainder]
}

export function addCurrentVariation(currentKey: string, variations: Variations, l: string[]) {
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
  console.log(average)
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

export function removeElement(list: string[], val: string) {
  const idx = list.indexOf(val)
  if (idx < 0) {
    return list
  } else {
    list.splice(idx, 1)
    return list
  }
}

export function isValidEmail(email: string): boolean {
  const emailRegex: RegExp = /^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

export function loginWarning() {
  const languageIdx = Number(localStorage.getItem(LANGUAGE_IDX))
  sessionStorage.clear()
  alert(menuWords.loginWarning[languageIdx])
}