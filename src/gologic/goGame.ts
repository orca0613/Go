import _ from "lodash";
import { Board, Coordinate, Variations, nBoardInfo } from "../util/types";

class Game {
  private board: Board;
  private answers: Variations;
  private variations: Variations;
  private lines: number;
  private storage: nBoardInfo[];
  private idx: number;
  private key: string;

  constructor(board: Board, answers: Variations, variations: Variations, lines: number) {
    this.board = board;
    this.answers = answers
    this.variations = variations;
    this.lines = lines
    this.storage = []
    this.idx = 0
    this.key = "0"
  }

  private isOutside(coord: Coordinate) {
    const y = coord[0], x = coord[1]
    return !(0 <= y && y <= this.lines && 0 <= x && x < this.lines)
  }

  private addNeighbors(coord: Coordinate) {
    const y = coord[0], x = coord[1]
    const neighbors: Coordinate[] = [[y + 1, x], [y - 1, x], [y, x + 1], [y, x - 1]]
    return neighbors
  }

  private getStatus(board: Board, coord: Coordinate) {
    const y = coord[0], x = coord[1]
    return board[y][x]
  }

  private changeStatus(board: Board, coord: Coordinate, value: string) {
    const newBoard = board, y = coord[0], x = coord[1]
    newBoard[y][x] = value
    return newBoard
  }

  private removeDeadGroup(board: Board, group: Coordinate[]) {
    const newBoard = _.cloneDeep(board)
    for (const c of group) {
      const y = c[0], x = c[1]
      newBoard[y][x] = "."
    }
    return newBoard
  }

  private getDeadGroup(board: Board, coord: Coordinate, color: string, opponentColor: string): Coordinate[] {
    let newBoard = _.cloneDeep(board)
    const y = coord[0], x = coord[1]
    let group: Coordinate[] = [[y, x]]
    let idx = 0

    while (idx < group.length) {
      const c = group[idx]
      if (this.isOutside(c) || this.getStatus(newBoard, c) === opponentColor) {
        group.splice(idx, 1)
      } else if (this.getStatus(newBoard, c) === color) {
        group = group.concat(this.addNeighbors(c))
        newBoard = this.changeStatus(newBoard, c, opponentColor)
        idx += 1
      } else {
        return []
      }
    }
    return group
  }

  public playMove(color: string, currentMove: Coordinate, currentKey: string) {
    let board = this.board
    this.addHistory(board, color, currentKey)
    if (this.isOutside(currentMove) || this.getStatus(board, currentMove) !== ".") {
      return board
    }
    board = this.changeStatus(board, currentMove, color)
    const opponentColor = color === "b"? "w" : "b"
    const neighbors = this.addNeighbors(currentMove)
    let dead: Coordinate[] = []
    for (const neighbor of neighbors) {
      dead = dead.concat(this.getDeadGroup(board, neighbor, opponentColor, color))
    }
    const suicideGroup: Coordinate[] = this.getDeadGroup(board, currentMove, color, opponentColor)
    if (dead.length === 0 && suicideGroup.length > 0) {
      board = this.changeStatus(board, currentMove, ".")
      return board
    }
    board = this.removeDeadGroup(board, dead)
    const newBoardInfo: nBoardInfo = {
      board: board,
      color: opponentColor,
      key: currentKey,
    }
    return newBoardInfo
  }

  private addHistory(board: Board, color: string, key: string) {
    const newBoardInfo: nBoardInfo = {
      board: board,
      color: color,
      key: key,
    }
    this.storage.splice(this.idx)
    this.storage.push(newBoardInfo)
    this.idx = this.storage.length - 1
    this.key = key
  }

  public previousMove() {
    if (this.idx > 0) {
      this.idx -= 1
    }
    return this.storage[this.idx]
  }
  
  public nextMove() {
    if (this.idx + 1 < this.storage.length) {
      this.idx += 1
    }
    return this.storage[this.idx]
  }
  
}