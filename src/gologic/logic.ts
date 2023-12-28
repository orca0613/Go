import _ from 'lodash'
import { Board, Coordinate } from '../util/types'

export function isOutside(coord: Coordinate, size: number) {
    const y = coord[0], x = coord[1]
    return !(0 <= x && x < size && 0 <= y && y < size)
}

export function getNeighbors(coord: Coordinate) {
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
            group = group.concat(getNeighbors(c))
            newBoard = changeStatus(newBoard, c, opponentColor)
            idx += 1
        } else {
            return []
        }
    }

    return group
}
interface handleMoveProps {

    board: Board
    color: string
    currentMove: Coordinate;
}

export function handleMove(props: handleMoveProps) {
    let boardState = props.board;
    const currentMove = props.currentMove;
    const color = props.color;
    const opponentColor = color === 'b'? 'w' : 'b'
    const neighbors = getNeighbors(currentMove)

    if (isOutside(currentMove, boardState.length) || getStatus(boardState, currentMove) !== '.') {
        return boardState
    } else {
        boardState = changeStatus(boardState, currentMove, color)
    }

    let dead: Coordinate[] = []
    for (let i = 0; i < neighbors.length; i ++) {
        dead = dead.concat(getDeadGroup(boardState, neighbors[i], opponentColor, color))
    }

    const suicideGroup: Coordinate[] = getDeadGroup(boardState, currentMove, color, opponentColor)
    if (dead.length === 0 && suicideGroup.length > 0) {
        boardState = changeStatus(boardState, currentMove, '.')
        return boardState
    }


    boardState = removeDeadGroup(boardState, dead)
    return boardState
}
