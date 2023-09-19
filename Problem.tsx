import React, { useState } from "react";
import { GoPosition } from "../util/board/GoPosition";
import { Coordinate, test_problem } from "../util/board/types" 
import { checkInclude, handleMove, isOutside } from "../gologic/logic";
import _ from 'lodash'
import { Button } from "@mui/material";

const lineSpacing = 60
const N = 12

export function Problem() {

  const [problem, setProblem] = useState(test_problem)
  const [color, setColor] = useState('black')

  function reset() {
    setProblem(test_problem)
  }
  
  function handleClick(e: React.MouseEvent) {
    const x = Math.floor(e.clientX / lineSpacing) + 1
    const y = Math.floor(e.clientY / lineSpacing) + 1
    const coord: Coordinate = [x, y]

    if (checkInclude(problem.black, coord) || checkInclude(problem.white, coord) || isOutside(x, y, N + 1)) {
      return
    }

    let newProblem = _.cloneDeep(problem)
    if (color === 'black') {
      newProblem.black.push(coord)
      newProblem = handleMove({state: newProblem, size: N + 1, currentMove: coord, color: color})
      setProblem(newProblem)
      setColor('white')
    } else {
      newProblem.white.push(coord)
      newProblem = handleMove({state: newProblem, size: N + 1, currentMove: coord, color: color})
      setProblem(newProblem)
      setColor('black')
    }
  }

  return (
    <>
      <div onClick={handleClick}>
        <GoPosition lineSpacing={lineSpacing} lines={N} moves={problem}></GoPosition>
      </div>
      <Button onClick={reset}>reset</Button>
    </>


  )

}
