import _ from "lodash";
import { Board, Coordinate, Variations, BoardInfo } from "../util/types";
import { addToKey, makeRandomNumber, playMoveAndReturnNewBoard } from "../util/functions";

export class Game {
  private answers: Variations
  private variations: Variations
  private lines: number
  private history: BoardInfo[]
  private idx: number
  private state: BoardInfo
  private initState: BoardInfo

  constructor(board: Board, answers: Variations, variations: Variations, color: string) {
    this.answers = answers
    this.variations = variations
    this.lines = board.length
    this.state = {
      board: board,
      color: color,
      key: "0"
    }
    this.initState = {
      board: board,
      color: color,
      key: "0"
    }
    this.history = [this.initState]
    this.idx = 0
  }

  public getState() {
    return this.state
  }

  public clearHistory() {
    this.history = [this.initState]
    this.idx = 0
  }

  public playMove(info: BoardInfo, currentMove: Coordinate): BoardInfo {
    const color = info.color
    const key = info.key
    let board = info.board
    const newBoard = playMoveAndReturnNewBoard(board, currentMove, color)
    if (_.isEqual(board, newBoard)) {
      return info
    }
    const newColor = color === "b"? "w" : "b"
    const newKey = addToKey(currentMove, this.lines, key)
    const newState: BoardInfo = {
      board: newBoard,
      color: newColor,
      key: newKey
    }
    this.addHistory(newState)
    this.state = newState
    return newState
  }

  public tryMove(info: BoardInfo, currentMove: Coordinate): BoardInfo {
    const key = info.key
    const y = currentMove[0], x = currentMove[1]
    const converted = String(y * this.lines + x)
    if (this.variations.hasOwnProperty(key) && this.variations[key].includes(converted) || 
    this.answers.hasOwnProperty(key) && this.answers[key].includes(converted)) {
      const newBoard = playMoveAndReturnNewBoard(info.board, currentMove, info.color)
      const newColor = info.color === "b"? "w" : "b"
      const newKey = addToKey(currentMove, this.lines, info.key)
      const newState: BoardInfo = {
        board: newBoard,
        color: newColor,
        key: newKey
      }
      return this.response(newState)
    } else {
      return this.playMove(info, currentMove)
    }
  }

  private response(info: BoardInfo): BoardInfo {
    const key = info.key
    if (this.variations.hasOwnProperty(key)) {
      const random = makeRandomNumber(this.variations[key].length)
      const nextMove = Number(this.variations[key][random])
      const y = Math.floor(nextMove / this.lines), x = nextMove % this.lines
      const coord: Coordinate = [y, x]
      return this.playMove(info, coord)
    } else {
      if (this.answers[key].length === 0) {
        this.addHistory(info)
        return info
      } else {
        const random = makeRandomNumber(this.answers[key].length)
        const nextMove = Number(this.answers[key][random])
        const y = Math.floor(nextMove / this.lines), x = nextMove % this.lines
        const coord: Coordinate = [y, x]
        return this.playMove(info, coord)
      }
    }
  }

  private addHistory(boardInfo: BoardInfo) {
    const newHistory = this.history.slice(0, this.idx + 1)
    this.idx = newHistory.length
    newHistory.push(boardInfo)
    this.history = newHistory
  }

  public previousMove(): BoardInfo {
    if (this.idx > 0) {
      this.idx -= 1
    }
    const newState = this.history[this.idx]
    this.state = newState
    return newState
  }
  
  public nextMove(): BoardInfo {
    if (this.idx + 1 < this.history.length) {
      this.idx += 1
    }
    const newState = this.history[this.idx]
    this.state
    return newState
  }
}


