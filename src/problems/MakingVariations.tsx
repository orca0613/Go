import React, { useEffect, useState } from 'react'
import { GoPosition } from '../util/GoPosition'
import { Board, BoardInfo, Coordinate, ProblemInfo, Variations } from '../util/types'
import _ from 'lodash'
import { getCoordinate, playMoveAndReturnNewBoard } from '../util/functions'
import { Button } from '@mui/material'
import { boardWidth } from '../util/constants'
import { MoveNumber } from '../util/MoveNumber'


interface MakingProps {
  problemInfo: ProblemInfo
  problemId: string
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
  const problemId = props.problemId
  const initialState = props.problemInfo.problem
  const N = initialState.length
  const cellWidth = Math.round(boardWidth / N)
  const [problem, setProblem] = useState(initialState)
  const [currentKey, setCurrentKey] = useState('0')
  const [color, setColor] = useState(props.problemInfo.color)
  const [variations, setVariations] = useState(props.problemInfo.variations)
  const boardInfo = {
    board: problem,
    color: color,
  }
  const [history, setHistory] = useState([boardInfo])
  const [result, setResult] = useState(true)

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

  function addVariations() {
    if (currentKey in variations) {
      console.log('exist this variation')
      return
    }
    const newVariations = _.cloneDeep(variations)
    const l = currentKey.split('-')
    if ((l.length % 2) && result) {
      console.log('invalid result')
      return
    }
    console.log(variations)
    newVariations[currentKey] = []
    let key = currentKey
    for (let i = l.length - 1; i > 0; i--) {
      const value = l[i]
      key = key.slice(0, key.length - (value.length + 1))
      if (key in newVariations) {
        newVariations[key].push(value)
      } else {
        newVariations[key] = [value]
      }
      if (key in variations) {
        break
      }
    }
    setVariations(newVariations)
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
    // addVariations(modified)
    const newKey = currentKey + '-' + modified
    setCurrentKey(newKey)
    setProblem(newProblem)
    color === 'b' ? setColor('w') : setColor('b')
    console.log(newKey)
  }

  function updateVariations() {
    console.log(variations)
    fetch(`http://localhost:3001/problems/update-variations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({problemId, variations}),
    })
      .then(response => alert('success'))
      .catch(error => console.error('Error: ', error))
  }


  return (
    <div onClick={handleClick}>
      <GoPosition cellWidth={cellWidth} lines={N - 1} board={problem}></GoPosition>
      <MoveNumber cellWidth={cellWidth} moves={currentKey} board={problem} ></MoveNumber>
      <Button onClick={goToPreviousMove}>previous</Button>
      <Button onClick={addVariations}>add variations</Button>
      <Button onClick={updateVariations}>update variations</Button>

    </div>
  )
}
