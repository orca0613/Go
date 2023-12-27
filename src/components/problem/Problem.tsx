import { useEffect, useState } from 'react'
import { Board, Coordinate, ProblemInfo, Variations } from '../../util/types'
import _ from 'lodash'
import { addToKey, checkSolved, makeRandomNumber, playMoveAndReturnNewBoard } from '../../util/functions'
import { LANGUAGE_IDX, SOLVED, boardWidth, bonus } from '../../util/constants'
import FinalBoard from '../board/FinalBoard'
import { Box, Button, Divider, useMediaQuery } from '@mui/material'
import { addCount, addElement, addPoint } from '../../util/network'
import { menuWords } from '../../util/menuWords'


interface ProblemProps {
  problemInfo: ProblemInfo
}


export function Problem({ problemInfo }: ProblemProps) {
  
  const turn = problemInfo.color
  const answers = problemInfo.answers
  const variations = problemInfo.variations
  const initialState = problemInfo.initialState
  const [color, setColor] = useState(turn)
  const lines = initialState.length
  const [problem, setProblem] = useState(initialState)
  const [currentKey, setCurrentKey] = useState("0")
  const isMobile = useMediaQuery("(max-width: 600px)")
  const languageIdx = Number(localStorage.getItem(LANGUAGE_IDX))
  const divider = <Divider orientation="horizontal" sx={{mt: 1, mb: 2, borderColor: "white"}} /> 

  useEffect(() => {
    setProblem(initialState)
    setColor(turn)
    setCurrentKey("0")
  }, [initialState])


  function reset() {
    setProblem(initialState)
    setColor(turn)
    setCurrentKey('0')
  }

  function tryMove(coord: Coordinate) {
    const y = coord[0], x = coord[1]
    const key = String(y * lines + x)
    if (variations.hasOwnProperty(currentKey) && variations[currentKey].includes(key)) {
      const newProblem = playMoveAndReturnNewBoard(problem, coord, color)
      setProblem(newProblem)
      const newKey = addToKey(coord, lines, currentKey)
      setCurrentKey(newKey)
      response(newProblem, newKey)
    } else if (answers.hasOwnProperty(currentKey) && answers[currentKey].includes(key)) {
      const newProblem = playMoveAndReturnNewBoard(problem, coord, color)
      setProblem(newProblem)
      const newKey = addToKey(coord, lines, currentKey)
      setCurrentKey(newKey)
      response(newProblem, newKey)
    } else {
      alert(menuWords.wrong[languageIdx])
      if (!checkSolved()) {
        addCount("wrong")
      }
    }
  }

  function response(board: Board, key: string) {
    if (variations.hasOwnProperty(key)) {
      const random = makeRandomNumber(variations[key].length)
      const r = Number(variations[key][random])
      const y = Math.floor(r / lines), x = r % lines
      const coord: Coordinate = [y, x]
      const newProblem = playMoveAndReturnNewBoard(board, coord, color === 'b'? 'w' : 'b')
      const newKey = addToKey(coord, lines, key)
      setCurrentKey(newKey)
      setProblem(newProblem)
    } else if (answers.hasOwnProperty(key) && answers[key]) {
      if (answers[key].length === 0) {
        alert(menuWords.correct[languageIdx])
        if (!checkSolved()) {
          addCount("correct")
          addPoint(bonus)
          addElement(SOLVED)
        }
      } else {
        const random = makeRandomNumber(answers[key].length)
        const r = Number(answers[key][random])
        const y = Math.floor(r / lines), x = r % lines
        const coord: Coordinate = [y, x]
        const newProblem = playMoveAndReturnNewBoard(board, coord, color === 'b'? 'w' : 'b')
        const newKey = addToKey(coord, lines, key)
        setCurrentKey(newKey)
        setProblem(newProblem)
      }
    }
  }

  function handleClick(coord: Coordinate) {
    const newProblem = playMoveAndReturnNewBoard(problem, coord, color)
    if (_.isEqual(newProblem, problem)) {
      return
    }
    tryMove(coord)
  }

  function playPass() {
    const key = "p"
    if (variations.hasOwnProperty(currentKey) && variations[currentKey].includes(key)) {
      const newKey = currentKey + "-p"
      setCurrentKey(newKey)
      response(problem, newKey)
    } else if (answers.hasOwnProperty(currentKey) && answers[currentKey].includes(key)) {
      const newKey = currentKey + "-p"
      setCurrentKey(newKey)
      response(problem, newKey)
    } else {
      alert(menuWords.wrong[languageIdx])
      if (!checkSolved()) {
        addCount("wrong")
      }
    }
  }

  return (

          <Box
          sx={{
            display: 'flex',
            width: isMobile ? '100vw' : '800',
            flexDirection: isMobile ? 'column' : 'row',
            gap: isMobile ? '1ch' : 0,
          }}
        >
          <Box
          >
            <FinalBoard 
            lines={problem.length}
            board={problem}
            boardWidth={boardWidth}
            moves={currentKey}
            onClick={handleClick}
            />
          </Box>
          <Box
            textAlign="center"
            sx={{
              flex: isMobile ? undefined : `1 0 0px`,
              // mr: isMobile ? '0' : '1ch',
              mt: 3
            }}
          >
            <Button onClick={playPass}>{menuWords.pass[languageIdx]}</Button>
            {divider}
            <Button sx={{color: "red"}} onClick={() => reset()}>{menuWords.reset[languageIdx]}</Button>
          </Box>
        </Box>

  )
}
