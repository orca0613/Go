import { handleMove } from "../gologic/logic"
import { Board, Coordinate } from "./types"
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

export function convertFromStringToOneD(board: string) {
  return board.split("")
}

export function convertFromOneDToString(board: string[]) {
  return board.join("")
}

export function convertFromOneDToTwoD(board: string[]) {
  const boardSize = Math.round(board.length ** 0.5)
  if (boardSize !== board.length ** 0.5) {
    throw Error("bad board!")
  }

  const newBoard = []
  
  for (let i = 0; i < boardSize; i++) {
    const line = board.slice(0, boardSize)
    newBoard.push(line)
    board = board.slice(boardSize)
  }
  return newBoard
}

export function convertFromTwoDToOneD(board: string[][]) {
  const newBoard = []
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board.length; j++) {
      newBoard.push(board[i][j])
    }
  }
  return newBoard
}

