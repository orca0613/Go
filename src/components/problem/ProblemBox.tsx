import { useEffect, useState } from 'react'
import { Coordinate, BoardInfo, UserInfo } from '../../util/types'
import _ from 'lodash'
import { addCurrentVariation } from '../../util/functions'
import { ANSWER, HOME, LANGUAGE_IDX, MARGIN, PROBLEM_INDEX, PROBLEM_INDICES, QUESTIONS, SELF, SOLVED, TRIED, TRY, USERINFO } from '../../util/constants'
import FinalBoard from '../board/FinalBoard'
import { Alert, Box, Button, ButtonGroup, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, Snackbar, Typography } from '@mui/material'
import { menuWords } from '../../util/menuWords'
import { addCorrectUser, addWrong, changeCount } from '../../network/problemInformation'
import { addElement } from '../../network/userDetail'
import { getProblemByIdx, updateVariations } from '../../network/problem'
import { useNavigate, useParams } from 'react-router-dom'
import { ProblemInformation } from '../problem/ProblemInformation'
import { Like } from '../Like'
import { Game } from '../../gologic/goGame'
import { useWindowSize } from 'react-use'
import { sendRequest } from '../../network/requests'
import { ReplyBox } from '../ReplyBox'
import { initIndices, initialProblemInfo, initialUserInfo, initialVariations } from '../../util/initialForms'
import { mobileButtonStyle, wideButtonStyle } from '../../util/styles'

export function ProblemBox() {

  const { param } = useParams()
  const problemIdx = Number(param)
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
  const userInfo: UserInfo = JSON.parse(sessionStorage.getItem(USERINFO) || initialUserInfo)
  const username = userInfo.name
  const userLevel = userInfo.level
  const creator = problemInfo.creator
  const [solved, setSolved] = useState(userInfo.solved.includes(problemIdx))
  const {width, height} = useWindowSize()
  const isMobile = height > width * 2 / 3 || width < 1000
  const languageIdx = Number(localStorage.getItem(LANGUAGE_IDX))

  const [mode, setMode] = useState(TRY)
  const [alertInfo, setAlertInfo] = useState({
    open: false,
    answer: false,
    text: "",
  })
  const [dialogInfo, setDialogInfo] = useState({
    open: false,
    title: "",
    contents: "",
  })

  const answerRegistered = !_.isEqual(problemInfo.answers, initialVariations)
  const navigate = useNavigate()

  const margin = isMobile? 0 : MARGIN
  const auto = userInfo.auto
  const mobileIconSize = width / 15
  const IconSize = width / 50

  const leftArrowIcon = 
  <img src="/images/left_arrow.svg" alt="pre" width={isMobile? mobileIconSize : IconSize} height={isMobile? mobileIconSize : IconSize}/>
  const rightArrowIcon = 
  <img src="/images/right_arrow.svg" alt="next" width={isMobile? mobileIconSize : IconSize} height={isMobile? mobileIconSize : IconSize}/>
  const firstIcon = 
  <img src="/images/first.svg" alt="reset" width={isMobile? mobileIconSize : IconSize} height={isMobile? mobileIconSize : IconSize}/>
  const lastIcon = 
  <img src="/images/last.svg" alt="reset" width={isMobile? mobileIconSize : IconSize} height={isMobile? mobileIconSize : IconSize}/>

  const alertComponenet = 
  <Snackbar
    open={alertInfo.open}
    autoHideDuration={1500}
    onClose={handleAlertOpen}
    anchorOrigin={{vertical: "bottom", horizontal: "center"}}
    sx={{bottom: height / 2}}
  >
    <Alert
      severity={alertInfo.answer? "success" : "error"}
      variant='filled'
    >
      {alertInfo.text}
    </Alert>
  </Snackbar>

  const dialogComponent = 
  <Dialog
    open={dialogInfo.open}
    onClose={handleDialogOpen}
  >
    <DialogTitle>{dialogInfo.title}</DialogTitle>
    <DialogContent>
      <DialogContentText>{dialogInfo.contents}</DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={handleDialogOpen}
      >
        {menuWords.cancel[languageIdx]}
      </Button>
      <Button onClick={() => request()}>{menuWords.requestVariation[languageIdx]}</Button>
    </DialogActions>

  </Dialog>

  
  
  
  function modeChange(m: string) {
    if ([TRY, SELF, ANSWER].includes(m)) {
      setMode(m)
      reset()
    } else{
      return
    }

  }
  useEffect(() => {
    if (userInfo.name) {
      getProblemByIdx(problemIdx)
      .then(p => {
        if (!p) {
          alert(menuWords.wrongIndexWarning[languageIdx])
          return navigate(HOME)
        } 
        setProblemInfo(p)
        addElement(problemIdx, username, TRIED)
        userInfo.tried.push(problemIdx)
        sessionStorage.setItem(USERINFO, JSON.stringify(userInfo))
        setInfo({
          board: p.initialState,
          color: p.color,
          key: "0"
        }) 
        setGame(new Game(
          p.initialState,
          p.answers,
          p.variations,
          p.color
        ))
        setSolved(userInfo.solved.includes(problemIdx))
        changeCount(problemIdx, "view", username, 1)
      })
    } else {
      alert(menuWords.loginWarning[languageIdx])
      sessionStorage.clear()
      navigate(HOME)
    }
    modeChange(TRY)
  }, [problemIdx])

  function reset() {
    setInfo(initInfo)
    game.clearHistory()
  }

  function goToLast() {
    const newInfo = game.goToLast()
    setInfo(newInfo)
  }

  function goToInit() {
    const newInfo = game.goToInit()
    setInfo(newInfo)
  }

  function handleClick(coord: Coordinate) {
    if (mode === TRY) {
      if (info.color !== problemInfo.color) {
        return
      }
      const newInfo = game.tryMove(info, coord)
      if (newInfo.key === info.key) {
        return
      }
      if (newInfo.color === problemInfo.color) {
        if (problemInfo.variations.hasOwnProperty(newInfo.key) && problemInfo.variations[newInfo.key].length === 0) {
          handleWrong()
        } else if (problemInfo.answers.hasOwnProperty(newInfo.key) && problemInfo.answers[newInfo.key].length === 0) {
          handleCorrect()
        }
      } else {
        if (problemInfo.answers.hasOwnProperty(newInfo.key) && problemInfo.answers[newInfo.key].length === 0) {
          handleCorrect()
        } else {
          requestSuggestion()
        }
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

  // function checkAnswer() {
  //   if (problemInfo.answers.hasOwnProperty(info.key)) {
  //     if (problemInfo.answers[info.key].length > 0) {
  //       alert(menuWords.rightWay[languageIdx])
  //     } else {
  //       alert(menuWords.perfect[languageIdx])
  //     } 
  //   } else if (problemInfo.variations.hasOwnProperty(info.key)) {
  //     alert(menuWords.wrongWay[languageIdx])
  //   } else {
  //     alert(menuWords.noVariationWarning[languageIdx])
  //   }
  // }

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
    updateVariations(problemIdx, QUESTIONS, newQuestions, username, problemInfo.creator, true)
    sendRequest(problemIdx, problemInfo.creator, username, info.key)
    setDialogInfo({
      ...dialogInfo,
      open: false
    })
  }

  function handleAlertOpen() {
    const curState = alertInfo.open
    setAlertInfo({
      ...alertInfo,
      open: !curState
    })
  }

  function handleDialogOpen() {
    const curState = dialogInfo.open
    setDialogInfo({
      ...dialogInfo,
      open: !curState
    })
  }

  function moveToAdjacentProblem(num: number) {
    const problemList: number[] = JSON.parse(sessionStorage.getItem(PROBLEM_INDICES) || initIndices)
    const newIndex = Number(sessionStorage.getItem(PROBLEM_INDEX)) + num
    if (newIndex < 0 || newIndex >= problemList.length) {
      alert(menuWords.noProblemWarning[languageIdx])
      return
    }
    sessionStorage.setItem(PROBLEM_INDEX, String(newIndex))
    const nextProblemIdx = problemList[newIndex]
    navigate(`/problem/${nextProblemIdx}`)
  }

  function setAnswerModeAndsetSolved() {
    if (mode === ANSWER) {
      modeChange(TRY)
      return
    } else {
      modeChange(ANSWER)
      addElement(problemIdx, username, SOLVED)
      addSolved(problemInfo.problemIdx)
    }
  }

  function handleWrong() {
    const newAlertInfo = {
      open: true,
      answer: false,
      text: menuWords.wrong[languageIdx]
    }
    setAlertInfo(newAlertInfo)
    if (solved) {
      return
    }
    addWrong(problemInfo._id, username, userLevel)
  }

  function requestSuggestion() {
    const newDialogInfo = {
      open: true,
      title: menuWords.wrong[languageIdx],
      contents: menuWords.requestSuggestion[languageIdx]
    }
    setDialogInfo(newDialogInfo)
    if (solved) {
      return
    }
    addWrong(problemInfo._id, username, userLevel)
  }

  function addSolved(idx: number) {
    if (!userInfo.solved.includes(idx)) {
      userInfo.solved.push(idx)
      sessionStorage.setItem(USERINFO, JSON.stringify(userInfo))
    }
  }
  function handleCorrect() {
    const newAlertInfo = {
      open: true,
      answer: true,
      text: menuWords.correct[languageIdx]
    }
    setAlertInfo(newAlertInfo)
    if (!solved) {
      addCorrectUser(problemInfo._id, username, userLevel)
      setSolved(true)
      addSolved(problemIdx)
      addElement(problemIdx, username, SOLVED)
    }
    if (auto) {
      moveToAdjacentProblem(1)
    }
  }

  const mobileTopMenu = 
  <Box display="flex" justifyContent={"space-around"}>
    <Button sx={{width: "40%",  textTransform: "none"}} onClick={() => moveToAdjacentProblem(-1)}>{menuWords.previousProblem[languageIdx]}</Button>
    <Like problemIdx={problemInfo.problemIdx} username={username} creator={problemInfo.creator}></Like>
    <Button sx={{width: "40%",  textTransform: "none"}} onClick={() => moveToAdjacentProblem(1)}>{menuWords.nextProblem[languageIdx]}</Button>
  </Box>

  const mobileBottomMenu = 
  <Box display="flex" justifyContent="space-around" alignItems="center">
    <Button sx={{...mobileButtonStyle, color: mode === TRY? "" : "red"}} onClick={() => mode === TRY? modeChange(SELF) : modeChange(TRY)}>
      {mode === TRY? menuWords.practice[languageIdx] : menuWords.try[languageIdx]}
    </Button>
    <ButtonGroup size='small' variant='text' color='inherit' sx={{width: "50%", justifyContent: "center", maxHeight: 30}}>
      <Button onClick={goToInit}>{firstIcon}</Button>
      <Button onClick={goToPreviousMove}>{leftArrowIcon}</Button>
      <Button onClick={goToNextMove}>{rightArrowIcon}</Button>
      <Button onClick={goToLast}>{lastIcon}</Button>
    </ButtonGroup>
    {
      username === creator? 
      <Button sx={mobileButtonStyle} onClick={() => navigate(`/modify/${problemIdx}`)}>{menuWords.enterVariations[languageIdx]}</Button> 
      : mode === TRY? 
      <Button sx={mobileButtonStyle} onClick={setAnswerModeAndsetSolved}>{menuWords.showAnswer[languageIdx]}</Button>
      :
      <Button sx={mobileButtonStyle} onClick={request}>{menuWords.requestVariation[languageIdx]}</Button>
    }
  </Box>

  const wideMenu = 
  <Box display="grid" justifyContent="center" my="15%">
    <Box display="flex">
      <Button sx={wideButtonStyle} onClick={() => moveToAdjacentProblem(-1)}>{menuWords.previousProblem[languageIdx]}</Button>
      <Button sx={wideButtonStyle} onClick={() => moveToAdjacentProblem(1)}>{menuWords.nextProblem[languageIdx]}</Button>
    </Box>
    <ButtonGroup size='small' variant='text' color='inherit' sx={{justifyContent: "center", margin: margin, maxHeight: 30}}>
      <Button onClick={goToInit}>{firstIcon}</Button>
      <Button onClick={goToPreviousMove}>{leftArrowIcon}</Button>
      <Button onClick={goToNextMove}>{rightArrowIcon}</Button>
      <Button onClick={goToLast}>{lastIcon}</Button>
    </ButtonGroup>
    <Button sx={{...wideButtonStyle, color: mode === TRY? "" : "red"}} onClick={() => mode === TRY? modeChange(SELF) : modeChange(TRY)}>
      {mode === TRY? menuWords.practice[languageIdx] : menuWords.try[languageIdx]}
    </Button>
    {
      username === creator? 
      <Button sx={wideButtonStyle} onClick={() => navigate(`/modify/${problemIdx}`)}>{menuWords.enterVariations[languageIdx]}</Button> 
      : mode === TRY? 
      <Button sx={wideButtonStyle} onClick={setAnswerModeAndsetSolved}>{menuWords.showAnswer[languageIdx]}</Button>
      :
      <Button sx={wideButtonStyle} onClick={request}>{menuWords.requestVariation[languageIdx]}</Button>
    }
    <Like problemIdx={problemInfo.problemIdx} username={username} creator={problemInfo.creator}></Like>
  </Box>
  
  return (
    <Box display={isMobile? "grid" : "flex"} justifyContent="center">
      <Box display="grid" margin={margin} alignContent="start">
        <ProblemInformation problemInfo={problemInfo}></ProblemInformation>
        <Typography sx={{color: "red", margin: margin, textAlign: "center", display: answerRegistered? "none" : ""}}>{menuWords.noAnswerWarning[languageIdx]}</Typography>
        {isMobile? mobileTopMenu : wideMenu}   
      </Box>
      <Box my={MARGIN} mx={margin}>
        <FinalBoard
          lines={info.board.length}
          board={info.board}
          boardWidth={isMobile? width - 16 : height - 100}
          moves={info.key}
          variations={(mode === ANSWER)? problemInfo.variations[info.key] : []}
          answers={(mode === ANSWER)? problemInfo.answers[info.key] : []}
          onClick={handleClick}
        />
      </Box>
      <Box margin={margin} alignItems="center">
        {isMobile? mobileBottomMenu : <ReplyBox problemId={problemInfo._id}></ReplyBox>}
      </Box>
      <Box>
        {isMobile? <ReplyBox problemId={problemInfo._id}></ReplyBox> : <></>}
      </Box>
      {alertComponenet}
      {dialogComponent}
    </Box>
  )
}


