import { useState } from 'react'
import { Board, BoardInfo, Coordinate, ProblemInfo, Variations } from '../../util/types'
import _ from 'lodash'
import { addCurrentVariation, addToKey, playMoveAndReturnNewBoard, removeFromKey } from '../../util/functions'
import { LANGUAGE_IDX, boardWidth } from '../../util/constants'
import FinalBoard from '../board/FinalBoard'
import { Box, Button, Divider, useMediaQuery } from '@mui/material'
import { menuWords } from '../../util/menuWords'
import { updateVariations } from '../../util/network'


interface SelfModeProps {
  problemInfo: ProblemInfo
}


export function SelfMode({ problemInfo }: SelfModeProps) {
  
  const initialState = problemInfo.initialState
  const answers = problemInfo.answers
  const variations = problemInfo.variations
  const creator = problemInfo.creator
  const [color, setColor] = useState(problemInfo.color)
  const lines = initialState.length
  const [problem, setProblem] = useState(initialState)
  const [currentKey, setCurrentKey] = useState('0')
  const [history, setHistory] = useState<BoardInfo[]>([])
  const [questions, setQuestions] = useState(problemInfo.questions)
  const [moves, setMoves] = useState<Coordinate[]>([])
  const [nextMove, setNextMove] = useState<Coordinate | null>(null)
  const isMobile = useMediaQuery("(max-width: 600px)")
  const divider = <Divider orientation="horizontal" sx={{mt: 1, mb: 2, borderColor: "white"}} /> 
  const languageIdx = Number(localStorage.getItem(LANGUAGE_IDX))

  function addHistory(board: Board, color: string) {
    const newHistory: BoardInfo = {
      board: board,
      color: color
    }
    const newLength = history.length + 1
    if (newLength >= moves.length) {
      setNextMove(null)
    } else {
      setNextMove(moves[newLength])
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
      const newKey = removeFromKey(currentKey)
      setCurrentKey(newKey)
      setNextMove(moves[history.length])
    }
  }

  function changeMoves(coord: Coordinate) {
    while (moves.length > history.length) {
      moves.pop()
    }
    const newMoves = moves.concat([coord])
    setMoves(newMoves)
  }

  function goToNextMove() {
    if (nextMove === null) {
      return
    }
    const y = nextMove[0], x = nextMove[1]
    if (y >= lines || x >= lines) {
      playPass()
    } else {
      playMove(nextMove)
    }
  }

  function playMove(coord: Coordinate) {
    const newProblem = playMoveAndReturnNewBoard(problem, coord, color)
    if (_.isEqual(newProblem, problem)) {
      return
    }
    if (!_.isEqual(coord, nextMove)) {
      changeMoves(coord)
    }
    const newKey = addToKey(coord, lines, currentKey)
    addHistory(problem, color)
    setCurrentKey(newKey)
    setProblem(newProblem)
    color === 'b' ? setColor('w') : setColor('b')
  }

  function reset() {
    setProblem(initialState)
    setColor(problemInfo.color)
    setCurrentKey('0')
    setHistory([])
  }

  function handleClick(coord: Coordinate) {
    if (coord !== nextMove)
    playMove(coord)
  }

  function playPass() {
    const coord: Coordinate = [lines, lines]
    if (!_.isEqual(coord, nextMove)) {
      changeMoves(coord)
    }
    const newKey = currentKey + "-p"
    addHistory(problem, color)
    setCurrentKey(newKey)
    color === 'b' ? setColor('w') : setColor('b')
  }

  function checkAnswer() {
    if (answers.hasOwnProperty(currentKey)) {
      if (answers[currentKey].length > 0) {
        alert("You are on the right way")
      } else {
        alert("Perfect")
      } 
    } else if (variations.hasOwnProperty(currentKey)) {
      alert("Think a little more")
    } else {
      alert("There is no this variation")
    }
  }

  async function request() {
    if (variations.hasOwnProperty(currentKey) || answers.hasOwnProperty(currentKey)) {
      alert("this variation already has been registered")
      return
    }
    const l = currentKey.split("-")
    const newQuestions = addCurrentVariation(currentKey, questions, l)
    setQuestions(newQuestions)
    updateVariations(problemInfo._id, newQuestions, "questions", creator)
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
            <Button onClick={goToPreviousMove}>{menuWords.previous[languageIdx]}</Button>
            {divider}
            <Button onClick={goToNextMove}>{menuWords.next[languageIdx]}</Button>
            {divider}
            <Button onClick={playPass}>{menuWords.pass[languageIdx]}</Button>
            {divider}
            <Button sx={{color: "red"}} onClick={reset}>{menuWords.reset[languageIdx]}</Button>
            {divider}
            <Button onClick={checkAnswer}>{menuWords.checkAnswer[languageIdx]}</Button>
            {divider}
            <Button onClick={request}>{menuWords.requestVariation[languageIdx]}</Button>
          </Box>
        </Box>

  )
}
