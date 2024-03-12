import { useEffect, useState } from 'react'
import { BoardInfo, Coordinate, UserInfo } from '../../util/types'
import _ from 'lodash'
import { addCurrentVariation, removeCurrentVariation, removeElement } from '../../util/functions'
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid } from '@mui/material'
import { ANSWERS, LANGUAGE_IDX, MARGIN, QUESTIONS, USERINFO, VARIATIONS, initialProblemInfo, initialUserInfo, initialVariations } from '../../util/constants'
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

  const userInfo: UserInfo = JSON.parse(sessionStorage.getItem(USERINFO) || initialUserInfo)
  const username = userInfo.name
  const navigate = useNavigate()
  const {width, height} = useWindowSize()
  const isMobile = height > width * 2 / 3 || width < 1000
  const margin = isMobile? 0 : MARGIN
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
  const [open, setOpen] = useState(false)

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
    updateVariations(problemInfo._id, VARIATIONS, newVariations, username, problemInfo.creator, true)
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
    updateVariations(problemInfo._id, ANSWERS, newAnswers, username, problemInfo.creator, true)
  }

  function removeVariationsAndSetVariations(key: string) {
    if (problemInfo.variations.hasOwnProperty(key) && problemInfo.variations[key].length === 0) {
      const newVariations = removeCurrentVariation(key, problemInfo.variations)
      setProblemInfo({
        ...problemInfo,
        variations: newVariations
      })
      updateVariations(problemInfo._id, VARIATIONS, newVariations, username, problemInfo.creator, false)
    } else if (problemInfo.answers.hasOwnProperty(key) && problemInfo.answers[key].length === 0) {
      const newAnswers = removeCurrentVariation(key, problemInfo.answers)
      setProblemInfo({
        ...problemInfo,
        answers: newAnswers
      })
      updateVariations(problemInfo._id, ANSWERS, newAnswers, username, problemInfo.creator, false)
    } else if (problemInfo.questions.hasOwnProperty(key) && problemInfo.questions[key].length === 0) {
      const newQuestions = removeCurrentVariation(key, problemInfo.questions)
      setProblemInfo({
        ...problemInfo,
        questions: newQuestions
      })
      updateVariations(problemInfo._id, QUESTIONS, newQuestions, username, problemInfo.creator, false)
    } else {
      alert(menuWords.invalidConditionWarning[languageIdx])
      return
    }
  }



  function handleClick(coord: Coordinate) {
    const newInfo = game.playMove(info, coord)
    if (problemInfo.questions.hasOwnProperty(newInfo.key) && problemInfo.questions[newInfo.key].length === 0) {
      removeVariationsAndSetVariations(newInfo.key)
    }
    setInfo(newInfo)
  }

  function reset() {
    setInfo(initInfo)
    game.clearHistory()
  }

  function deleteProblemAndGoHome() {
    deleteProblem(problemInfo._id, username)
    setOpen(false)
    navigate("/home")
  }

  useEffect(() => {
    if (problemId) {
      const newProblemInfo = getProblemById(problemId)
      .then(p => {
        const initialState = p.initialState
        setProblemInfo(p)
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
  <Box textAlign="center" display={isMobile? "flex" : "grid"} justifyContent={isMobile? "space-between" : "center"}>
    <Button sx={{margin: margin}} onClick={addVariationsAndSetVariations}>{menuWords.addVariation[languageIdx]}</Button>
    <Button sx={{margin: margin, color: "green"}} onClick={addAnswersAndSetAnswers}>{menuWords.addAnswers[languageIdx]}</Button>
    <Button sx={{margin: margin, color: "red"}} onClick={() => removeVariationsAndSetVariations(info.key)}>{menuWords.removeVariation[languageIdx]}</Button>
    <Button sx={{margin: margin}} onClick={() => navigate(`/modify-problem/${problemId}`)}>{menuWords.modifyProblem[languageIdx]}</Button>
  </Box>

  const rightMenu = 
  <Box textAlign="center" display={isMobile? "flex" : "grid"} justifyContent={isMobile? "space-between" : "center"}>
    <Button sx={{margin: margin}} onClick={goToPreviousMove}>{menuWords.previous[languageIdx]}</Button>
    <Button sx={{margin: margin}} onClick={goToNextMove}>{menuWords.next[languageIdx]}</Button>
    <Button sx={{margin: margin}} onClick={reset}>{menuWords.reset[languageIdx]}</Button>
    <Button sx={{margin: margin, color: "red"}} onClick={() => setOpen(true )}>{menuWords.deleteProblem[languageIdx]}</Button>
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
        width: isMobile? width : height - 100, 
        height: isMobile? width : height - 100
      }}>
        <FinalBoard 
        lines={info.board.length}
        board={info.board}
        boardWidth={isMobile? width : height - 100}
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
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{menuWords.confirmRequest[languageIdx]}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {menuWords.deleteProblemWarning[languageIdx]}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={deleteProblemAndGoHome} color="primary" autoFocus>
            {menuWords.confirm[languageIdx]}
          </Button>
          <Button onClick={() => setOpen(false)} color="primary">
            {menuWords.cancel[languageIdx]}
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
    
  )
}
