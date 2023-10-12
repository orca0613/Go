import React, { useEffect, useState } from 'react'
import { GoPosition } from '../util/GoPosition'
import { Board, BoardInfo, Coordinate, Variations } from '../util/types'
import _ from 'lodash'
import { getCoordinate, playMoveAndReturnNewBoard } from '../util/functions'
import { Button } from '@mui/material'
import { boardWidth } from '../util/constants'
import { MoveNumber } from '../util/MoveNumber'


interface MakingProps {
  problem: BoardInfo
}


export function MakingVariations(props: MakingProps) {
  // const [data, setData] = useState()
  // useEffect(() => {
  //   fetch("some-endpoint")
  //     .then((response) => response.json())
  //     .then((data) => {
  //       setData(data)
  //     })
  //     .catch(error => console.log(JSON.stringify(error)))
  // }, [])
  
  const initialState = props.problem.board
  const N = initialState.length
  const cellWidth = Math.round(boardWidth / N)
  const initialVariations: Variations = {
    '0': []
  }

  const [problem, setProblem] = useState(initialState)
  const [currentKey, setCurrentKey] = useState('0')
  const [color, setColor] = useState(props.problem.color)
  const [variations, setVariations] = useState(initialVariations)
  const [history, setHistory] = useState([props.problem])



  function addVariations(key: string) {
    const newVariations = { ...variations }
    if (!newVariations[currentKey].includes(key)) {
      newVariations[currentKey].push(key)
    }
    const newKey = currentKey + '-' + key
    if (!(newKey in newVariations)) {
      newVariations[newKey] = []
    }
    setVariations(newVariations)
    setCurrentKey(newKey)
  }

  function addHistory(board: Board, color: string) {
    const newHistory: BoardInfo = {
      board: board,
      color: color
    }
    setHistory(history.concat([newHistory]))
  }

  function goToPreviousMove() {
    const newProblem = history.pop()
    if (newProblem === undefined) {
      return
    } else {
      setProblem(newProblem.board)
      setColor(newProblem.color)
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
    const coord: Coordinate = getCoordinate(e, cellWidth)
    const y = coord[0], x = coord[1]
    const modified = String(y * N + x)
    const newProblem = playMoveAndReturnNewBoard(problem, coord, color)
    if (_.isEqual(newProblem, problem)) {
      return
    }

    addHistory(problem, color)
    addVariations(modified)
    setProblem(newProblem)
    color === 'b' ? setColor('w') : setColor('b')
    console.log(variations)
  }


  return (
    <div onClick={handleClick}>
      <GoPosition cellWidth={cellWidth} lines={N - 1} board={problem}></GoPosition>
      <MoveNumber cellWidth={cellWidth} moves={currentKey} board={problem} ></MoveNumber>
      <Button onClick={goToPreviousMove}>previous</Button>
    </div>
  )
}
