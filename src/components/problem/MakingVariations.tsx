import { useState } from 'react'
import { Board, BoardInfo, Coordinate, ProblemInfo } from '../../util/types'
import _ from 'lodash'
import { addCurrentVariation, playMoveAndReturnNewBoard, removeCurrentVariation } from '../../util/functions'
import { Box, Button, Divider, Typography, useMediaQuery } from '@mui/material'
import { LANGUAGE_IDX, USERNAME, boardWidth } from '../../util/constants'
import FinalBoard from '../board/FinalBoard'
import { menuWords } from '../../util/menuWords'
import { updateVariations } from '../../network/problem'


interface MakingProps {
  problemInfo: ProblemInfo
}

export function MakingVariations({problemInfo}: MakingProps) {

  const problemId = problemInfo._id
  const initialState = problemInfo.initialState
  const lines = initialState.length
  const creator = problemInfo.creator
  const username = localStorage.getItem(USERNAME)?? ""
  const [problem, setProblem] = useState(initialState)
  const [currentKey, setCurrentKey] = useState("0")
  const boardInfo = {
    board: problem,
    color: problemInfo.color,
  }
  const [history, setHistory] = useState<BoardInfo[]>([])
  const divider = <Divider orientation="horizontal" sx={{mt: 1, mb: 2, borderColor: "whitesmoke"}} /> 
  const isMobile = useMediaQuery("(max-width: 600px)")
  const languageIdx = Number(localStorage.getItem(LANGUAGE_IDX))
  const [info, setInfo] = useState({
    variations: problemInfo.variations,
    answers: problemInfo.answers,
    questions: problemInfo.questions,
    color: problemInfo.color,
    update: false,
  })

  function changeInfo(where: string, val: any) {
    setInfo({
      ...info,
      [where]: val
    })

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
      let newKey = currentKey
      for (let i = newKey.length - 1; i >= 0; i--) {
        if (newKey[i] === '-') {
          newKey = currentKey.slice(0, i)
          break
        }
      }
      setInfo({
        ...info,
        color: newProblem.color,
      })
      setCurrentKey(newKey)
    }

  }

  function addVariationsAndSetVariations() {
    const l = currentKey.split('-')
    if ((l.length % 2 === 0)) {
      alert(menuWords.invalidResultWarning[languageIdx])
      return
    }
    const newVariations = addCurrentVariation(currentKey, info.variations, l)
    setInfo({
      ...info,
      variations: newVariations,
      update: false
    })
    alert(menuWords.saved[languageIdx])
  }

  function addAnswersAndSetAnswers() {
    const l = currentKey.split('-')
    if ((l.length % 2)) {
      alert(menuWords.invalidResultWarning[languageIdx])
      return
    } 
    const newAnswers = addCurrentVariation(currentKey, info.answers, l)
    setInfo({
      ...info,
      answers: newAnswers,
      update: false
    })
    alert(menuWords.saved[languageIdx])
  }

  function updateAll() {
    updateVariations(problemId, info.variations, "variations", username, creator)
    updateVariations(problemId, info.answers, "answers", username, creator)
    updateVariations(problemId, info.questions, "questions", username, creator)
    changeInfo("update", true)
  }

  function removeVariationsAndSetVariations() {
    if (info.variations.hasOwnProperty(currentKey) && info.variations[currentKey].length === 0) {
      const newVariations = removeCurrentVariation(currentKey, info.variations)
      changeInfo("variations", newVariations)
    } else if (info.answers.hasOwnProperty(currentKey) && info.answers[currentKey].length === 0) {
      const newAnswers = removeCurrentVariation(currentKey, info.answers)
      changeInfo("answers", newAnswers)
    } else if (info.questions.hasOwnProperty(currentKey) && info.questions[currentKey].length === 0) {
      const newQuestions = removeCurrentVariation(currentKey, info.questions)
      changeInfo("questions", newQuestions)
    } else {
      alert(menuWords.invalidConditionWarning[languageIdx])
      return
    }
  }



  function handleClick(coord: Coordinate) {
    const y = coord[0], x = coord[1]
    const modified = String(y * lines + x)
    const newProblem = playMoveAndReturnNewBoard(problem, coord, info.color)
    if (_.isEqual(newProblem, problem)) {
      return
    }

    addHistory(problem, info.color)
    const newKey = currentKey + '-' + modified
    setCurrentKey(newKey)
    setProblem(newProblem)
    info.color === 'b' ? changeInfo("color", "w") : changeInfo("color", "b")
  }

  function reset() {
    setProblem(initialState)
    changeInfo("color", problemInfo.color)
    setCurrentKey('0')
    setHistory([])
  }

  function playPass() {

    addHistory(problem, info.color)
    const newKey = currentKey + '-p'
    setCurrentKey(newKey)
    info.color === 'b' ? changeInfo("color", "w") : changeInfo("color", "b")
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
          variations={info.variations[currentKey]}
          answers={info.answers[currentKey]}
          questions={info.questions[currentKey]}
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
          <Button sx={{color:"green"}} onClick={addAnswersAndSetAnswers}>{menuWords.addAnswers[languageIdx]}</Button>
          {divider}
          <Button sx={{ color: "red" }} onClick={removeVariationsAndSetVariations}>{menuWords.removeVariation[languageIdx]}</Button>
          {divider}
          <Button onClick={() => reset()}>{menuWords.reset[languageIdx]}</Button>
          {divider}
          <Button onClick={updateAll}>{menuWords.updateVariation[languageIdx]}</Button>
          {info.update? <Typography sx={{ fontSize: 10, color: "inherit" }}>{menuWords.complete[languageIdx]}</Typography> : <Typography sx={{ fontSize: 10, color: "red" }}>{menuWords.incomplete[languageIdx]}</Typography>}
          {divider}
        </Box>
      </Box>
    </>
  )
}
