import _ from 'lodash'
import { Board, Coordinate } from '../util/types/types'

export function isOutside(coord: Coordinate, size: number) {
    const y = coord[0], x = coord[1]
    return !(0 <= x && x < size && 0 <= y && y < size)
}

export function addNeighbors(coord: Coordinate) {
    const y = coord[0], x = coord[1]
    const neighbors: Coordinate[] = [[y + 1, x], [y - 1, x], [y, x + 1], [y, x - 1]]
    return neighbors
}


export function getStatus(board: Board, coord: Coordinate) {
    const y = coord[0], x = coord[1]
    return board[y][x]
}

export function changeStatus(board: Board, coord: Coordinate, value: string) {
    const newBoard = board, y = coord[0], x = coord[1]
    newBoard[y][x] = value
    return newBoard
}

export function removeDeadGroup(board: Board, group: Coordinate[]) {
    const newBoard = _.cloneDeep(board)
    for (let i = 0; i < group.length; i++) {
        const y = group[i][0], x = group[i][1]
        newBoard[y][x] = '.'
    }
    return newBoard
}

export function getDeadGroup(board: Board, coord: Coordinate, color: string, opponentColor: string): Coordinate[] {
    let newBoard: Board = _.cloneDeep(board)
    const size = board.length
    const y = coord[0], x = coord[1]
    let group: Coordinate[] = [[y, x]]
    let idx = 0

    while (idx < group.length) {
        const c = group[idx]
        if (isOutside(c, size) || getStatus(newBoard, c) === opponentColor) {
            group.splice(idx, 1)
            continue
        } else if (getStatus(newBoard , c) === color) {
            group = group.concat(addNeighbors(c))
            newBoard = changeStatus(newBoard, c, opponentColor)
            idx += 1
        } else {
            return []
        }
    }

    return group
}

export function handleMove(board: Board, color: string, currentMove: Coordinate) {
    let boardState = _.cloneDeep(board)
    const opponentColor = color === 'b'? 'w' : 'b'
    const neighbors = addNeighbors(currentMove)

    if (isOutside(currentMove, boardState.length) || getStatus(boardState, currentMove) !== '.') {
        return board
    }
    boardState = changeStatus(boardState, currentMove, color)
    let dead: Coordinate[] = []
    for (let i = 0; i < neighbors.length; i ++) {
        dead = dead.concat(getDeadGroup(boardState, neighbors[i], opponentColor, color))
    }
    const suicide: Coordinate[] = getDeadGroup(boardState, currentMove, color, opponentColor)
    if (dead.length === 0 && suicide.length > 0) {
        return board
    }
    boardState = removeDeadGroup(boardState, dead)
    return boardState
}
