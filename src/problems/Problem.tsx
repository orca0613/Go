import React, { useState } from "react";
import { GoPosition } from "../util/GoPosition";
import { Coordinate, Board, Variations, BoardInfo } from "../util/types" 
import _ from 'lodash'
import { Box, Button } from "@mui/material";
import { getCoordinate, makeRandomNumber, playMoveAndReturnNewBoard } from "../util/functions";
import { boardWidth } from "../util/constants";
import { MoveNumber } from "../util/MoveNumber";

interface ProblemProps {
  problem: BoardInfo
  variations: Variations
}
export function Problem(props: ProblemProps) {

  const initialState = props.problem.board
  const variations = props.variations
  const N = initialState.length
  const cellWidth = Math.round(boardWidth / N)

  const [problem, setProblem] = useState(initialState)
  const [currentKey, setCurrentKey] = useState('0')
  const [color, setColor] = useState(props.problem.color)
  const [selfPlay, setSelfPlay] = useState(false)
  const [history, setHistory] = useState([props.problem])

  function reset() {
    setProblem(initialState)
    setCurrentKey('0')
    setColor(props.problem.color)
    setHistory([props.problem])
  }

  function addHistory(board: Board, color: string) {
    const newHistory: BoardInfo = {
      board: board,
      color: color
    }
    setHistory(history.concat([newHistory]))
  }

  function goToPreviousMove() {
    const pre = history.pop()
    if (pre === undefined) {
      return
    } else {
      setProblem(pre.board)
      setColor(pre.color)
      let newKey = currentKey
      for (let i = currentKey.length - 1; i >= 0; i--) {
        if (currentKey[i] === '-') {
          newKey = currentKey.slice(0, i)
          break
        }
      }
      setCurrentKey(newKey)
    }
  }
  
  function handleClick(e: React.MouseEvent) {
    const coord = getCoordinate(e, cellWidth)
    const y = coord[0], x = coord[1]
    if (selfPlay) {
      const newProblem = playMoveAndReturnNewBoard(problem, coord, color)
      if (_.isEqual(newProblem, problem)) {
        return
      }
      const key = String(y * N + x)
      const newKey = currentKey + '-' + key
      setCurrentKey(newKey)
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
      <Box onClick={handleClick}>
        <GoPosition cellWidth={cellWidth} lines={N - 1} board={problem}></GoPosition>
        <MoveNumber cellWidth={cellWidth} moves={currentKey} board={problem} ></MoveNumber>
      </Box>
      <Button onClick={reset}>reset</Button>
      <Button onClick={changeMode}>{selfPlay? 'try' : 'practice'}</Button>
      {selfPlay? <Button onClick={goToPreviousMove}>previous</Button> : <></>}
    </>


  )

}
