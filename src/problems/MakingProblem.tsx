import { useState } from "react"
import { Coordinate } from "../util/types"
import { GoPosition } from "../util/GoPosition"
import { boardWidth } from "../util/constants"
import { Button, TextField } from "@mui/material"
import { getCoordinate, makingEmptyBoard } from "../util/functions"
import { isOutside } from "../gologic/logic"
import { useSelector } from "react-redux"
import { rootState } from "../redux/rootReducer"

interface MakingProblemProps {
    boardSize: number
}

export function MakingProblem(props: MakingProblemProps) {
    const level = useSelector((state: rootState) => state.user.userlevel)
    const creator = useSelector((state: rootState) => state.user.username)
    const boardSize = props.boardSize
    const cellWidth = Math.round(boardWidth / boardSize)
    let emptyBoard = makingEmptyBoard(boardSize)
    const [problem, setProblem] = useState(emptyBoard)
    const [color, setColor] = useState('b')
    const [comment, setComment] = useState('')

    const commentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setComment(e.target.value)
    }

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

    function registerProblem() {
        console.log(comment)
        const initialState = problem;
        const variations = {"0": []}

        fetch('http://localhost:3001/problems/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({initialState, creator, variations, level, comment}),
        })
          .then(response => response.json())
          .then(data => console.log(data))
          .catch(error => console.error('Error:', error));
      }



    return (
        <>
            <div onClick={handleClick}>
                <GoPosition 
                    cellWidth={cellWidth} 
                    lines={boardSize - 1} 
                    board={problem} 
                ></GoPosition>
            </div>
            <div>
                <Button onClick={() => colorChange('w')}>white</Button>
                <Button onClick={() => colorChange('b')}>black</Button>
                <Button onClick={() => colorChange('.')}>remove</Button>
                <Button onClick={() => setProblem(emptyBoard)}>empty</Button>
                <Button onClick={registerProblem}>click</Button>
            </div>
            <div>
                <TextField 
                name='level'
                label='comment' 
                variant='outlined' 
                value={comment}
                onChange={commentChange}
                />
            </div>
        </>

    )
}