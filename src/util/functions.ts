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