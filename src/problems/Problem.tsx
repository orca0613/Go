import React, { useState } from "react";
import { GoPosition } from "../util/GoPosition";
import { Coordinate, Board, Variations, BoardInfo } from "../util/types" 
import _ from 'lodash'
import { Button } from "@mui/material";
import { makeRandomNumber, playMoveAndReturnNewBoard } from "../util/functions";
import { boardWidth } from "../util/constants";

interface ProblemProps {
  problem: BoardInfo
  variations: Variations
}
export function Problem(props: ProblemProps) {

  const initialState = props.problem.board
  const variations = props.variations
  const N = initialState.length
  const lineSpacing = boardWidth / N

  const [problem, setProblem] = useState(initialState)
  const [currentKey, setCurrentKey] = useState('0')
  const [color, setColor] = useState(props.problem.color)
  const [selfPlay, setSelfPlay] = useState(false)
  const [history, setHistory] = useState([props.problem])
  const [steps, setSteps] = useState(0)

  function reset() {
    setProblem(initialState)
    setCurrentKey('0')
    setColor(props.problem.color)
    setHistory([props.problem])
    setSteps(0)
  }

  function addHistory(board: Board, color: string) {
    const newHistory: BoardInfo = {
      board: board,
      color: color
    }
    const H = history.slice(0, steps)
    setHistory(H.concat([newHistory]))
    setSteps(steps + 1)
  }

  function previous() {
    const pre = history[steps - 1]
    if (pre === undefined) {
      return
    } else {
      setProblem(pre.board)
      setColor(pre.color)
      if (steps > 0) {setSteps(steps - 1)}
    }
  }

  function next() {
    const next = history[steps + 1]
    if (next === undefined) {
      return
    } else {
      setProblem(next.board)
      setColor(next.color)
      if (steps < history.length) {setSteps(steps + 1)}
    }
  }
  
  function handleClick(e: React.MouseEvent) {
    const x = Math.floor(e.clientX / lineSpacing)
    const y = Math.floor(e.clientY / lineSpacing)
    const coord: Coordinate = [y, x]
    if (selfPlay) {
      const newProblem = playMoveAndReturnNewBoard(problem, coord, color)
      if (_.isEqual(newProblem, problem)) {
        return
      }
      addHistory(problem, color)
      setProblem(newProblem)
      color === 'b'? setColor('w') : setColor('b')

    } else {
      const key = String(y * N + x)
      if (variations[currentKey].includes(key)) {
        const newProblem = playMoveAndReturnNewBoard(problem, coord, color)
        setProblem(newProblem)
        const newKey = currentKey + '-' + key
        setCurrentKey(newKey)
        response(newProblem, newKey)
      } else {
        alert('wrong')
      }
    }
  }

  function response(board: Board, key: string) {
    if (variations[key].length > 0) {
      const random = makeRandomNumber(variations[key].length)
      const r = Number(variations[key][random])
      const y = Math.floor(r / N), x = r % N
      const coord: Coordinate = [y, x]
      const newProblem = playMoveAndReturnNewBoard(board, coord, color === 'b'? 'w' : 'b')
      const newKey = key + '-' + String(r)
      setCurrentKey(newKey)
      setProblem(newProblem)
      if (variations[newKey].length === 0) {
        alert('wrong')
      }
    } else {
      alert('correct')
    }
  }

  function changeMode() {
    setSelfPlay(!selfPlay)
    reset()
  }


  return (
    <>
      <div onClick={handleClick}>
        <GoPosition lineSpacing={lineSpacing} lines={N - 1} board={problem}></GoPosition>
      </div>
      <Button onClick={reset}>reset</Button>
      <Button onClick={changeMode}>{selfPlay? 'try' : 'practice'}</Button>
      {selfPlay? <Button onClick={previous}>previous</Button> : <></>}
      {selfPlay? <Button onClick={next}>next</Button> : <></>}
    </>


  )

}
