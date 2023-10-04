import React, { useState } from 'react'
import { GoPosition } from '../util/GoPosition'
import { Board, BoardInfo, Coordinate, Variations } from '../util/types'
import _ from 'lodash'
import { handleMove } from '../gologic/logic'
import { ProblemsList } from './problemsList'
import { playMoveAndReturnNewBoard } from '../util/functions'
import { Button } from '@mui/material'


interface MakingProps {
  problem: BoardInfo
}


export function Making_variations(props: MakingProps) {


    const initialState = props.problem.board
    const N = initialState.length
    const lineSpacing = Math.floor(700 / N)
    const initialVariations: Variations = {
      '0': []
  }

    const [problem, setProblem] = useState(initialState)
    const [currentKey, setCurrentKey] = useState('0')
    const [color, setColor] = useState(props.problem.color)
    const [variations, setVariations] = useState(initialVariations)
    const [history, setHistory] = useState([props.problem])


    
    function addVariations(key: string) {
      const newVariations = {...variations}
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

    function previous() {
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
        const y = Math.floor(e.clientY / lineSpacing)
        const x = Math.floor(e.clientX / lineSpacing)
        const modified = String(y * N + x)
        const coord: Coordinate = [y, x]
        const newProblem = playMoveAndReturnNewBoard(problem, coord, color)
        if (_.isEqual(newProblem, problem)) {
          return
        }

        addHistory(problem, color)
        addVariations(modified)
        setProblem(newProblem)
        color === 'b'? setColor('w') : setColor('b')
        console.log(variations)
    }


  return (
    <>
    <div onClick={handleClick}>
      <GoPosition lineSpacing={lineSpacing} lines={N - 1} board={problem}></GoPosition>
      <Button onClick={previous}>previous</Button>
    </div>
  </>
  )
}
