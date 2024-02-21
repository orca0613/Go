import { useEffect, useState } from 'react'
import { BoardInfo, Coordinate, ProblemInfo } from '../../util/types'
import _ from 'lodash'
import { addCurrentVariation, convertFromStringToTwoD, removeCurrentVariation } from '../../util/functions'
import { Box, Button, Divider, Grid, Typography, useMediaQuery } from '@mui/material'
import { LANGUAGE_IDX, USERNAME, initialProblemInfo } from '../../util/constants'
import FinalBoard from '../board/FinalBoard'
import { menuWords } from '../../util/menuWords'
import { deleteProblem, getProblemById, updateVariations } from '../../network/problem'
import { Game } from '../../gologic/goGame'
import { ProblemInformation } from '../problem/ProblemInformation'
import { useNavigate, useParams } from 'react-router-dom'
import { useWindowSize } from 'react-use'

export function ModifyVariations() {

  const { problemId } = useParams()
  const [problemInfo, setProblemInfo] = useState(initialProblemInfo)

  const [update, setUpdate] = useState(false)
  const username = localStorage.getItem(USERNAME)?? ""
  const navigate = useNavigate()
  const divider = <Divider orientation="horizontal" sx={{mt: "2vh", mb: 2, borderColor: "white"}} /> 
  const isMobile = useMediaQuery("(max-width: 800px)")
  const margin = 1
  const {width, height} = useWindowSize()
  const languageIdx = Number(localStorage.getItem(LANGUAGE_IDX))
  const initInfo: BoardInfo = {
    board: problemInfo.initialState,
    color: problemInfo.color,
    key: "0"
  }
  const [info, setInfo] = useState(initInfo)
  const [game, setGame] = useState(new Game(
    problemInfo.initialState,
    problemInfo.answers,
    problemInfo.variations,
    problemInfo.color,
  ))

  function goToPreviousMove() {
    const newInfo = game.previousMove()
    setInfo(newInfo)
  }

  function goToNextMove() {
    const newInfo = game.nextMove()
    setInfo(newInfo)
  }

  function addVariationsAndSetVariations() {
    const l = info.key.split('-')
    if ((l.length % 2 === 0)) {
      alert(menuWords.invalidResultWarning[languageIdx])
      return
    }
    const newVariations = addCurrentVariation(info.key, problemInfo.variations, l)
    setProblemInfo({
      ...problemInfo,
      variations: newVariations
    })
    setUpdate(false)
    alert(menuWords.saved[languageIdx])
  }

  function addAnswersAndSetAnswers() {
    const l = info.key.split('-')
    if ((l.length % 2)) {
      alert(menuWords.invalidResultWarning[languageIdx])
      return
    } 
    const newAnswers = addCurrentVariation(info.key, problemInfo.answers, l)
    setProblemInfo({
      ...problemInfo,
      answers: newAnswers
    })
    setUpdate(false)
    alert(menuWords.saved[languageIdx])
  }

  function updateAll() {
    updateVariations(problemInfo._id, problemInfo.variations, problemInfo.answers, problemInfo.questions, username, problemInfo.creator)
    setUpdate(true)
  }

  function removeVariationsAndSetVariations() {
    if (problemInfo.variations.hasOwnProperty(info.key) && problemInfo.variations[info.key].length === 0) {
      const newVariations = removeCurrentVariation(info.key, problemInfo.variations)
      setProblemInfo({
        ...problemInfo,
        variations: newVariations
      })
      setUpdate(false)
    } else if (problemInfo.answers.hasOwnProperty(info.key) && problemInfo.answers[info.key].length === 0) {
      const newAnswers = removeCurrentVariation(info.key, problemInfo.answers)
      setProblemInfo({
        ...problemInfo,
        answers: newAnswers
      })
      setUpdate(false)
    } else if (problemInfo.questions.hasOwnProperty(info.key) && problemInfo.questions[info.key].length === 0) {
      const newQuestions = removeCurrentVariation(info.key, problemInfo.questions)
      setProblemInfo({
        ...problemInfo,
        questions: newQuestions
      })
      setUpdate(false)
    } else {
      alert(menuWords.invalidConditionWarning[languageIdx])
      return
    }
  }



  function handleClick(coord: Coordinate) {
    const newInfo = game.playMove(info, coord)
    if (problemInfo.questions.hasOwnProperty(newInfo.key) && problemInfo.questions[newInfo.key].length === 0) {
      const newQuestions = removeCurrentVariation(newInfo.key, problemInfo.questions)
      setProblemInfo({
        ...problemInfo,
        questions: newQuestions
      })
    }
    setInfo(newInfo)
  }

  function reset() {
    setInfo(initInfo)
    game.clearHistory()
  }

  function deleteProblemAndGoHome() {
    deleteProblem(problemInfo._id, username)
    navigate("/home")
  }

  useEffect(() => {
    if (problemId) {
      const newProblemInfo = getProblemById(problemId)
      .then(p => {
        const initialState = convertFromStringToTwoD(p.initialState)
        setProblemInfo({
          ...p,
          initialState: initialState
        })
        setInfo({
          board: initialState,
          color: p.color,
          key: "0"
        })
        setGame(new Game(
          initialState,
          p.answers,
          p.variations,
          p.color
        ))
      })
    }
  }, [problemId])

  const leftMenu = 
  <Box textAlign="center" display={isMobile? "flex" : "grid"} justifyContent="center">
    <Button sx={{margin: margin}} onClick={addVariationsAndSetVariations}>{menuWords.addVariation[languageIdx]}</Button>
    <Button sx={{margin: margin, color: "green"}} onClick={addAnswersAndSetAnswers}>{menuWords.addAnswers[languageIdx]}</Button>
    <Button sx={{margin: margin, color: "red"}} onClick={removeVariationsAndSetVariations}>{menuWords.removeVariation[languageIdx]}</Button>
    <Button sx={{margin: margin}} onClick={updateAll}>{menuWords.updateVariation[languageIdx]}</Button>
    {update? 
    <Typography sx={{ fontSize: isMobile? 30 : 10, color: "inherit" }}>{isMobile? "*" : menuWords.complete[languageIdx]}</Typography> : 
    <Typography sx={{ fontSize: isMobile? 30 : 10, color: "red" }}>{isMobile? "*" : menuWords.incomplete[languageIdx]}</Typography>}
  </Box>

  const rightMenu = 
  <Box textAlign="center" display={isMobile? "flex" : "grid"} justifyContent="center">
    <Button sx={{margin: margin}} onClick={goToPreviousMove}>{menuWords.previous[languageIdx]}</Button>
    <Button sx={{margin: margin}} onClick={goToNextMove}>{menuWords.next[languageIdx]}</Button>
    <Button sx={{margin: margin}} onClick={reset}>{menuWords.reset[languageIdx]}</Button>
    <Button sx={{margin: margin, color: "red"}} onClick={deleteProblemAndGoHome}>{menuWords.deleteProblem[languageIdx]}</Button>
  </Box>

  return (
    <Grid container justifyContent="center">
      <Grid item sx={{margin: margin, width: isMobile? width : width / 6}}>
        <Grid container>
          <Grid item xs={12}>
            <ProblemInformation problemInfo={problemInfo}></ProblemInformation>
          </Grid>
          <Grid item xs={12}>
            {leftMenu}
          </Grid>
        </Grid>
      </Grid>
      <Grid item sx={{
        margin: margin, 
        width: isMobile? width / 7 * 5 : Math.min(width / 2, height / 7 * 5), 
        height: isMobile? width / 7 * 5 : Math.min(width / 2, height / 7 * 5)
      }}>
        <FinalBoard 
        lines={info.board.length}
        board={info.board}
        boardWidth={isMobile? width / 7 * 5 : Math.min(width / 2, height / 7 * 5)}
        moves={info.key}
        variations={problemInfo.variations[info.key]}
        answers={problemInfo.answers[info.key]}
        questions={problemInfo.questions[info.key]}
        onClick={handleClick}
        />
      </Grid>
      <Grid item sx={{margin: margin, width: isMobile? width : width / 6}}>
        {rightMenu}
      </Grid>
    </Grid>
  )
}
