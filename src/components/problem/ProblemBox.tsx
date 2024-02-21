import { useEffect, useState } from 'react'
import { Coordinate, ProblemInfo, BoardInfo } from '../../util/types'
import _ from 'lodash'
import { addCurrentVariation, addElementToLocalStorage, convertFromStringToTwoD, isInLocalStorage } from '../../util/functions'
import { ANSWER, LANGUAGE_IDX, SELF, SOLVED, TRIED, TRY, USERLEVEL, USERNAME, bonus, initialProblemInfo, initialVariations } from '../../util/constants'
import FinalBoard from '../board/FinalBoard'
import { Box, Button, Divider, Grid, Typography, useMediaQuery } from '@mui/material'
import { menuWords } from '../../util/menuWords'
import { addCorrectUser, addWrong, changeCount } from '../../network/problemInformation'
import { addElement, changeInfoAndPoint } from '../../network/userDetail'
import { getProblemById, updateVariations } from '../../network/problem'
import problemStore from '../../redux/problemStore'
import { setProblemIndex } from '../../redux/actions'
import { useNavigate, useParams } from 'react-router-dom'
import { ProblemInformation } from '../problem/ProblemInformation'
import { LikeAndDislike } from '../LikeAndDislike'
import { ReplyBox } from '../ReplyBox'
import { Game } from '../../gologic/goGame'
import { useWindowSize } from 'react-use'

export function ProblemBox() {

  const { problemId } = useParams()
  const [problemInfo, setProblemInfo] = useState(initialProblemInfo)

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
    problemInfo.color
  ))
  const username = localStorage.getItem(USERNAME)?? ""
  const userLevel = Number(localStorage.getItem(USERLEVEL))
  const creator = problemInfo.creator
  const [solved, setSolved] = useState(isInLocalStorage(SOLVED, problemInfo._id))
  const isMobile = useMediaQuery("(max-width: 800px)")
  const languageIdx = Number(localStorage.getItem(LANGUAGE_IDX))

  const [mode, setMode] = useState("try")
  const answerRegistered = !_.isEqual(problemInfo.answers, initialVariations)
  const navigate = useNavigate()
  const {width, height} = useWindowSize()
  const margin = 1
  
  function modeChange(m: string) {
    if ([TRY, SELF, ANSWER].includes(m)) {
      setMode(m)
      reset()
    } else{
      return
    }

  }
  useEffect(() => {
    if (problemId) {
      if (Number(localStorage.getItem("userPoint")) <= 0 && !isInLocalStorage(TRIED, problemId)) {
        alert(menuWords.pointWarning[languageIdx])
        return
      }
      changeCount(problemId, "view", username, 1)
      const newProblemInfo = getProblemById(problemId)
      .then(p => {
        const initialState = convertFromStringToTwoD(p.initialState)
        setProblemInfo({
          ...p,
          initialState: initialState
        })
        if (!_.isEqual(p.answers, initialVariations)) {
          if (!isInLocalStorage(TRIED, problemId)) {
            changeInfoAndPoint(problemId, TRIED, -bonus)
            addElementToLocalStorage(TRIED, problemId)
          }
        }
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
        setSolved(isInLocalStorage(SOLVED, p._id))

      })
    }
    modeChange(TRY)
  }, [problemId])

  function reset() {
    setInfo(initInfo)
    game.clearHistory()
  }

  function handleClick(coord: Coordinate) {
    if (mode === TRY) {
      const newInfo = game.tryMove(info, coord)
      if (problemInfo.variations.hasOwnProperty(newInfo.key) && problemInfo.variations[newInfo.key].length === 0) {
        handleWrong()
      } else if (problemInfo.answers.hasOwnProperty(newInfo.key) && problemInfo.answers[newInfo.key].length === 0) {
        handleCorrect()
      } else if (_.isEqual(newInfo.board, info.board)) {
        handleWrong()
      }
      setInfo(newInfo)
    } else {
      const newInfo = game.playMove(info, coord)
      setInfo(newInfo)
    }
  }

  function goToPreviousMove() {
    const newInfo = game.previousMove()
    setInfo(newInfo)
  }

  function goToNextMove() {
    const newInfo = game.nextMove()
    setInfo(newInfo)
  }

  function checkAnswer() {
    if (problemInfo.answers.hasOwnProperty(info.key)) {
      if (problemInfo.answers[info.key].length > 0) {
        alert(menuWords.rightWay[languageIdx])
      } else {
        alert(menuWords.perfect[languageIdx])
      } 
    } else if (problemInfo.variations.hasOwnProperty(info.key)) {
      alert(menuWords.wrongWay[languageIdx])
    } else {
      alert(menuWords.noVariationWarning[languageIdx])
    }
  }

  async function request() {
    if (problemInfo.variations.hasOwnProperty(info.key) || problemInfo.answers.hasOwnProperty(info.key)) {
      alert(menuWords.registeredVariationWarning[languageIdx])
      return
    }
    const l = info.key.split("-")
    const newQuestions = addCurrentVariation(info.key, problemInfo.questions, l)
    setProblemInfo({
      ...problemInfo,
      questions: newQuestions
    })
    updateVariations(problemInfo._id, problemInfo.variations, problemInfo.answers, newQuestions, username, problemInfo.creator)
  }

  function moveToAdjacentProblem(num: number) {
    const problemList = problemStore.getState().problemList
    const newIndex = problemStore.getState().curIndex + num
    if (newIndex < 0 || newIndex >= problemList.length) {
      alert(menuWords.noProblemWarning[languageIdx])
      return
    }
    problemStore.dispatch(setProblemIndex(newIndex))
    const nextProblemId = problemList[newIndex]._id
    navigate(`/problem/${nextProblemId}`)
  }

  function setAnswerModeAndsetSolved() {
    if (mode === ANSWER) {
      modeChange(TRY)
      return
    } else {
      modeChange(ANSWER)
      addElement(problemInfo._id, username, SOLVED)
      addElementToLocalStorage(SOLVED, problemInfo._id)
    }
  }

  function handleWrong() {
    alert(menuWords.wrong[languageIdx])
    if (solved) {
      return
    }
    addWrong(problemInfo._id, username, userLevel)
  }

  function handleCorrect() {
    alert(menuWords.correct[languageIdx])
    if (solved) {
      return
    }
    addCorrectUser(problemInfo._id, username, userLevel)
    setSolved(true)
    addElementToLocalStorage(SOLVED, problemInfo._id)
    changeInfoAndPoint(problemInfo._id, SOLVED, bonus)
  }

  const basicMenu = 
  <Box textAlign="center" display={isMobile? "flex" : "grid"} justifyContent="center">
    {answerRegistered? <></> : <Typography sx={{color: "red", fontSize:10}}>{menuWords.noAnswerWarning[languageIdx]}</Typography>}
    <Button sx={{margin: margin}} onClick={() => mode === TRY? modeChange(SELF) : modeChange(TRY)}>
      {mode === TRY? menuWords.practice[languageIdx] : menuWords.try[languageIdx]}
    </Button>
    <Button sx={{margin: margin}} onClick={() => moveToAdjacentProblem(-1)}>{menuWords.previousProblem[languageIdx]}</Button>
    <Button sx={{margin: margin}} onClick={() => moveToAdjacentProblem(1)}>{menuWords.nextProblem[languageIdx]}</Button>
    <Button sx={{margin: margin}} onClick={setAnswerModeAndsetSolved}>
      {mode === ANSWER? menuWords.returnProblem[languageIdx] : menuWords.showAnswer[languageIdx]}
    </Button>
  </Box>

  const basicRightMenu = 
  <Box textAlign="center" display={isMobile? "flex" : "grid"} justifyContent="center">
    <Button sx={{margin: margin}} onClick={goToPreviousMove}>{menuWords.previous[languageIdx]}</Button>
    <Button sx={{margin: margin}} onClick={goToNextMove}>{menuWords.next[languageIdx]}</Button>
    <Button sx={{color: "red", margin: margin}} onClick={() => reset()}>{menuWords.reset[languageIdx]}</Button>
  </Box>

  const creatorMenu =
  <Grid container textAlign="center">
    <Grid item xs={12} sx={{margin: margin}}>
      <Button onClick={() => navigate(`/modify/${problemId}`)}>{menuWords.modify[languageIdx]}</Button>
    </Grid>
  </Grid>

  const selfRightMenu = 

  <Box textAlign="center">
    <Button sx={{margin: margin}} onClick={checkAnswer}>{menuWords.checkAnswer[languageIdx]}</Button>
    <Button sx={{margin: margin}} onClick={request}>{menuWords.requestVariation[languageIdx]}</Button>
  </Box>
  
  return (
    <Grid container justifyContent="center">
      <Grid item sx={{margin: margin, width: isMobile? width : width / 6}}>
        <Grid container>
          <Grid item xs={12}>
            <ProblemInformation problemInfo={problemInfo}></ProblemInformation>
          </Grid>
          <Grid item xs={12}>
            {basicMenu}
          </Grid>
        </Grid>
      </Grid>
      <Grid justifyContent="center" item sx={{
        margin: margin, 
        width: isMobile? width / 7 * 5 : Math.min(width / 2, height / 7 * 5), 
        height: isMobile? width / 7 * 5 : Math.min(width / 2, height / 7 * 5)
      }}>
        <FinalBoard 
        lines={info.board.length}
        board={info.board}
        boardWidth={isMobile? width / 7 * 5 : Math.min(width / 2, height / 7 * 5)}
        moves={info.key}
        variations={(mode === ANSWER)? problemInfo.variations[info.key] : []}
        answers={(mode === ANSWER)? problemInfo.answers[info.key] : []}
        onClick={handleClick}
        />
      </Grid>
      <Grid item sx={{margin: margin, width: isMobile? width : width / 6}}>
        {basicRightMenu}
        {mode === SELF? selfRightMenu : <></>}
        {creator === username? creatorMenu : <></>}
        <LikeAndDislike problemId={problemInfo._id} username={username}></LikeAndDislike>
      </Grid>
      <Grid item xs={12}>
        <ReplyBox problemId={problemInfo._id}/>
      </Grid>
    </Grid>
  )
}


