import { useState } from 'react'
import { Board, BoardInfo, Coordinate, ProblemInfo } from '../../util/types'
import _ from 'lodash'
import { addCurrentVariation, playMoveAndReturnNewBoard, removeCurrentVariation } from '../../util/functions'
import { Box, Button, Divider, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Typography, useMediaQuery } from '@mui/material'
import { LANGUAGE_IDX, boardWidth } from '../../util/constants'
import FinalBoard from '../board/FinalBoard'
import { updateVariations } from '../../util/network'
import { menuWords } from '../../util/menuWords'


interface MakingProps {
  problemInfo: ProblemInfo
}


export function MakingVariations(props: MakingProps) {

  const problemId = props.problemInfo._id
  const initialState = props.problemInfo.initialState
  const lines = initialState.length
  const creator = props.problemInfo.creator
  const [problem, setProblem] = useState(initialState)
  const [currentKey, setCurrentKey] = useState('0')
  const [color, setColor] = useState(props.problemInfo.color)
  const [variations, setVariations] = useState(props.problemInfo.variations)
  const [answers, setAnswers] = useState(props.problemInfo.answers)
  const [questions, setQuestions] = useState(props.problemInfo.questions)
  const [playable, setPlayable] = useState(variations[currentKey])
  const [answerMove, setAnswerMove] = useState(answers[currentKey])
  const [questionMove, setQuestionMove] = useState(questions[currentKey])
  const [update, setUpdate] = useState(false)
  const boardInfo = {
    board: problem,
    color: color,
  }
  const [history, setHistory] = useState<BoardInfo[]>([])
  const [correct, setCorrect] = useState(true)
  const divider = <Divider orientation="horizontal" sx={{mt: 1, mb: 2, borderColor: "whitesmoke"}} /> 
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
      setPlayable(variations[newKey])
      setAnswerMove(answers[newKey])
      setQuestionMove(questions[newKey])
    }

  }

  function addVariationsAndSetVariations() {
    const l = currentKey.split('-')
    if ((l.length % 2)) {
      if (correct) {
        alert(menuWords.invalidResultWarning[languageIdx])
        return
      } else {
        const newVariations = addCurrentVariation(currentKey, variations, l)
        setVariations(newVariations)
        alert(menuWords.saved[languageIdx])
      }
    } else {
      if (!correct) {
        alert(menuWords.invalidResultWarning[languageIdx])
        return
      } else {
        const newAnswers = addCurrentVariation(currentKey, answers, l)
        setAnswers(newAnswers)
        alert(menuWords.saved[languageIdx])
      }
    }
    setUpdate(false)
  }

  function updateAll() {
    updateVariations(problemId, variations, "variations", creator)
    updateVariations(problemId, answers, "answers", creator)
    updateVariations(problemId, questions, "questions", creator, creator)
    setUpdate(true)
  }

  function removeVariationsAndSetVariations() {
    if (variations.hasOwnProperty(currentKey) && variations[currentKey].length === 0) {
      const newVariations = removeCurrentVariation(currentKey, variations)
      setVariations(newVariations)
    } else if (answers.hasOwnProperty(currentKey) && answers[currentKey].length === 0) {
      const newAnswers = removeCurrentVariation(currentKey, answers)
      setAnswers(newAnswers)
    } else if (questions.hasOwnProperty(currentKey) && questions[currentKey].length === 0) {
      const newQuestions = removeCurrentVariation(currentKey, questions)
      setQuestions(newQuestions)
    } else {
      alert(menuWords.invalidConditionWarning[languageIdx])
      return
    }
  }



  function handleClick(coord: Coordinate) {
    const y = coord[0], x = coord[1]
    const modified = String(y * lines + x)
    const newProblem = playMoveAndReturnNewBoard(problem, coord, color)
    if (_.isEqual(newProblem, problem)) {
      return
    }

    addHistory(problem, color)
    const newKey = currentKey + '-' + modified
    setCurrentKey(newKey)
    setPlayable(variations[newKey])
    setAnswerMove(answers[newKey])
    setQuestionMove(questions[newKey])
    setProblem(newProblem)
    color === 'b' ? setColor('w') : setColor('b')
  }

  function reset() {
    setProblem(initialState)
    setColor(props.problemInfo.color)
    setCurrentKey('0')
    setPlayable(variations['0'])
    setAnswerMove(answers['0'])
    setQuestionMove(questions['0'])
    setHistory([])
  }

  function handleResultChange(e: SelectChangeEvent) {
    const newResult = e.target.value
    newResult === "correct"? setCorrect(true) : setCorrect(false)
  }

  function playPass() {

    addHistory(problem, color)
    const newKey = currentKey + '-p'
    setCurrentKey(newKey)
    setPlayable(variations[newKey])
    setAnswerMove(answers[newKey])
    setQuestionMove(questions[newKey])
    color === 'b' ? setColor('w') : setColor('b')
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
          questions={questionMove}
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
          <Button onClick={playPass}>{menuWords.pass[languageIdx]}</Button>
          {divider}
          <Button onClick={addVariationsAndSetVariations}>{menuWords.addVariation[languageIdx]}</Button>
          {divider}
          <Button onClick={updateAll}>{menuWords.updateVariation[languageIdx]}</Button>
          {update? <Typography sx={{ fontSize: 10, color: "inherit" }}>수정 완료</Typography> : <Typography sx={{ fontSize: 10, color: "red" }}>수정 미완료</Typography>}
          {divider}
          <Button onClick={removeVariationsAndSetVariations}>{menuWords.removeVariation[languageIdx]}</Button>
          {divider}
          <Button sx={{color: "red"}} onClick={() => reset()}>{menuWords.reset[languageIdx]}</Button>
          {divider}
          <FormControl sx={{mt: 3, ml:2}}>
            <InputLabel id="result-select-label">{menuWords.result[languageIdx]}</InputLabel>
            <Select
              labelId="result-select-label"
              id="result-select"
              value={correct? "correct" : "wrong"}
              label="result"
              variant='standard'
              onChange={handleResultChange}
            >
              <MenuItem value={"correct"}>{menuWords.correct[languageIdx]}</MenuItem>
              <MenuItem value={"wrong"}>{menuWords.wrong[languageIdx]}</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>
    </>
  )
}
