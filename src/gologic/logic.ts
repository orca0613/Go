import { Coordinate, Move } from "../util/board/types"
import _ from 'lodash'

export function isOutside(x: number, y: number, size: number) {
    return !(0 < x && x <= size && 0 < y && y <= size)
}

function addNeighbors(x: number, y: number) {
    return [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]]
}

export function checkInclude(coordinates: number[][], coord: number[]) {
    for (let i = 0; i < coordinates.length; i++) {
        if (_.isEqual(coordinates[i], coord)) {
            return true
        }
    }
    return false
}

interface handleMoveProps {

    state: Move
    color: string
    currentMove: Coordinate;
    size: number
}

export function handleMove(props: handleMoveProps) {
    const boardState = props.state;
    const currentMove = props.currentMove;
    const color = props.color;
    const size = props.size;
    const myColor = props.color
    let opponentColor: string, myStones: number[][], opponentStones: number[][];
    if (myColor === 'black') {
        opponentColor = 'white'
        myStones = boardState.black
        opponentStones = boardState.white
    } else {
        opponentColor = 'black'
        myStones = boardState.white
        opponentStones = boardState.black
    }

    function getDeadGroup(x: number, y: number, color: string) {
        
        const visited: number[][] = []

        let group = [[x, y]]
        let idx = 0

        while (idx < group.length) {
            const c = group[idx]
            if (checkInclude(visited, c) || isOutside(c[0], c[1], size) || checkInclude(myStones, c)) {
                group.splice(idx, 1)
                continue
            }
            if (checkInclude(opponentStones, c)) {
                group = group.concat(addNeighbors(c[0], c[1]))
                visited.push(c)
                idx += 1
            } else {
                return []
            }
        }

        return group
    }

    function removeDeadGroup(deadGroup: number[][]) {
        if (opponentColor === 'black') {
            for (let i = 0; i < deadGroup.length; i++) {
                for (let j = boardState.black.length; j > -1; j--) {
                    if (_.isEqual(deadGroup[i], boardState.black[j])) {
                        boardState.black.splice(j, 1)
                    }
                }
            }
        } else {
            for (let i = 0; i < deadGroup.length; i++) {
                for (let j = boardState.white.length; j > -1; j--) {
                    if (_.isEqual(deadGroup[i], boardState.white[j])) {
                        boardState.white.splice(j, 1)
                    }
                }
            }
        }
    }

    let dead: number[][] = []
    const neighbors = addNeighbors(currentMove[0], currentMove[1])
    for (let i = 0; i < 4; i++) {
        dead = dead.concat(getDeadGroup(neighbors[i][0], neighbors[i][1], opponentColor))
    }

    removeDeadGroup(dead)

    return boardState
}