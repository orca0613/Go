import { useState } from 'react'
import { Board, BoardInfo, Coordinate, ProblemInfo } from '../../util/types'
import _ from 'lodash'
import { playMoveAndReturnNewBoard, } from '../../util/functions'
import { Box, Button, Divider, useMediaQuery } from '@mui/material'
import { LANGUAGE_IDX, boardWidth } from '../../util/constants'
import FinalBoard from '../board/FinalBoard'
import { menuWords } from '../../util/menuWords'


interface MakingProps {
  problemInfo: ProblemInfo
}


export function ShowAnswer(props: MakingProps) {

  const problemId = props.problemInfo._id
  const initialState = props.problemInfo.initialState
  const N = initialState.length
  const [problem, setProblem] = useState(initialState)
  const [currentKey, setCurrentKey] = useState('0')
  const [color, setColor] = useState(props.problemInfo.color)
  const answers = props.problemInfo.answers
  const variations = props.problemInfo.variations
  const [answerMove, setAnswerMove] = useState(answers["0"])
  const [playable, setPlayable] = useState(variations["0"])
  const boardInfo = {
    board: problem,
    color: color,
  }
  const [history, setHistory] = useState([boardInfo])
  const divider = <Divider orientation="horizontal" sx={{mt: 1, mb: 2, borderColor: "white"}} /> 
  const isMobile = useMediaQuery("(max-width: 600px)")
  const languageIdx = Number(localStorage.getItem(LANGUAGE_IDX))

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
      setAnswerMove(answers[newKey])
      setPlayable(variations[newKey])
    }

  }

  function handleClick(coord: Coordinate) {
    const y = coord[0], x = coord[1]
    const modified = String(y * N + x)
    const newProblem = playMoveAndReturnNewBoard(problem, coord, color)
    if (_.isEqual(newProblem, problem)) {
      return
    }

    addHistory(problem, color)
    const newKey = currentKey + '-' + modified
    setCurrentKey(newKey)
    setAnswerMove(answers[newKey])
    setPlayable(variations[newKey])
    setProblem(newProblem)
    color === 'b' ? setColor('w') : setColor('b')
  }

  function reset() {
    setProblem(initialState)
    setColor(props.problemInfo.color)
    setCurrentKey('0')
    setAnswerMove(answers['0'])
    setPlayable(variations["0"])
    setHistory([boardInfo])
  }


  return (
    <>
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
          variations={playable}
          answers={answerMove}
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
          <Button onClick={goToPreviousMove}>{menuWords.previous[languageIdx]}</Button>
          {divider}
          <Button sx={{color: "red"}} onClick={() => reset()}>{menuWords.reset[languageIdx]}</Button>
          {divider}
        </Box>
      </Box>
    </>
  )
}
