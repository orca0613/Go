import { useState } from "react"
import { Board, Coordinate } from "../util/types"
import { GoPosition } from "../util/GoPosition"
import { boardWidth } from "../util/constants"
import { Button } from "@mui/material"
import { getCoordinate } from "../util/functions"
import { isOutside } from "../gologic/logic"

interface MakingProblemProps {
    boardSize: number
}

export function MakingProblem(props: MakingProblemProps) {
    const boardSize = props.boardSize
    const cellWidth = Math.round(boardWidth / boardSize)
    const width = cellWidth * boardSize
    let emptyBoard: Board = []
    for (let i = 0; i < boardSize; i++) {
        emptyBoard.push([])
        for (let j = 0; j < boardSize; j++) {
            emptyBoard[i].push('.')
        }
    }

    const [problem, setProblem] = useState(emptyBoard)
    const [color, setColor] = useState('b')

    function addMove(coord: Coordinate) {
        const y = coord[0], x = coord[1]
        const newProblem = [...problem]
        newProblem[y][x] = color
        setProblem(newProblem)
    }

    function colorChange(c: string) {
        setColor(c)
    }

    function handleClick(e: React.MouseEvent) {
        const coord: Coordinate = getCoordinate(e, cellWidth)
        if (isOutside(coord, boardSize)) {return}
        addMove(coord)
    }
    



    return (
        <div onClick={handleClick}>
            <GoPosition 
                cellWidth={cellWidth} 
                lines={boardSize - 1} 
                board={problem} 
            ></GoPosition>
            <Button onClick={() => colorChange('w')}>white</Button>
            <Button onClick={() => colorChange('b')}>black</Button>
            <Button onClick={() => colorChange('.')}>remove</Button>
            <Button onClick={() => setProblem(emptyBoard)}>empty</Button>
            
        </div>
    )
}