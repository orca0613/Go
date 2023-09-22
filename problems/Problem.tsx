import React, { useState } from "react";
import { GoPosition } from "../util/board/GoPosition";
import { Coordinate, Board, Variations } from "../util/board/types" 
import _ from 'lodash'
import { Button } from "@mui/material";
import { handleMove } from "../gologic/logic";

interface ProblemProps {
  problem: Board
  variations: Variations
}
export function Problem(props: ProblemProps) {

  const initialState = props.problem
  const variations = props.variations
  const N = initialState.length
  const lineSpacing = 600 / N


  const [problem, setProblem] = useState(initialState)
  const [currentKey, setCurrentKey] = useState('0')

  function reset() {
    setProblem(initialState)
    setCurrentKey('0')
  }

  function playMoveAndReturnNewBoard(coord: Coordinate, color: string) {
    let newProblem: Board = _.cloneDeep(problem)
    newProblem = handleMove(
      {
        board: newProblem,
        color: color,
        currentMove: coord,
      }
    )
    setProblem(newProblem)
    return newProblem
  }
  
  function handleClick(e: React.MouseEvent) {
    const x = Math.floor(e.clientX / lineSpacing)
    const y = Math.floor(e.clientY / lineSpacing)
    const key = String(y * (N) + x)
    if (variations[currentKey].includes(key)) {
      const coord: Coordinate = [y, x]
      const newBoard = playMoveAndReturnNewBoard(coord, 'b')
      const newKey = currentKey + '-' + key
      setCurrentKey(newKey)
      response(newBoard, newKey)
    } else {
      console.log('wrong')
      return
    }
  }

  function response(board: Board, key: string) {
    if (variations[key].length > 0) {
      const r = Number(variations[key][0])
      const y = Math.floor(r / (N)), x = r % (N)
      const coord: Coordinate = [y, x]

      let newProblem: Board = _.cloneDeep(board)
      newProblem = handleMove({
        board: newProblem,
        color: 'w',
        currentMove: coord,
      })
      setProblem(newProblem)
      const newKey = key + '-' + String(r)
      setCurrentKey(key + '-' + String(r))
      if (variations[newKey].length === 0) {
        console.log('wrong')
      }
    } else {
      console.log('correct')
    }
  }


  return (
    <>
      <div onClick={handleClick}>
        <GoPosition lineSpacing={lineSpacing} lines={N - 1} board={problem}></GoPosition>
      </div>
      <Button onClick={reset}>reset</Button>
    </>


  )

}
