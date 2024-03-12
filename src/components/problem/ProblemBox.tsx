import { useEffect, useState } from 'react'
import { Coordinate, BoardInfo, UserInfo } from '../../util/types'
import _ from 'lodash'
import { addCurrentVariation } from '../../util/functions'
import { ANSWER, LANGUAGE_IDX, MARGIN, QUESTIONS, SELF, SOLVED, TRIED, TRY, USERINFO, bonus, initialProblemInfo, initialUserInfo, initialVariations } from '../../util/constants'
import FinalBoard from '../board/FinalBoard'
import { Box, Button, Grid, Typography } from '@mui/material'
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
  const userInfo: UserInfo = JSON.parse(sessionStorage.getItem(USERINFO) || initialUserInfo)
  const username = userInfo.name
  const userLevel = userInfo.level
  const creator = problemInfo.creator
  const [solved, setSolved] = useState(userInfo.solved.includes(problemInfo._id))
  const {width, height} = useWindowSize()
  const isMobile = height > width * 2 / 3 || width < 1000
  const languageIdx = Number(localStorage.getItem(LANGUAGE_IDX))

  const [mode, setMode] = useState(TRY)
  const answerRegistered = !_.isEqual(problemInfo.answers, initialVariations)
  const navigate = useNavigate()

  const margin = isMobile? 0 : MARGIN
  
  function modeChange(m: string) {
    if ([TRY, SELF, ANSWER].includes(m)) {
      setMode(m)
      reset()
    } else{
      return
    }

  }
  useEffect(() => {
    if (problemId && userInfo) {
      if (!userInfo.point && !userInfo.tried.includes(problemId)) {
        userInfo.name !== ""? alert(menuWords.pointWarning[languageIdx]) : alert(menuWords.loginWarning[languageIdx])
        return
      }
      changeCount(problemId, "view", username, 1)
      const newProblemInfo = getProblemById(problemId)
      .then(p => {
        setProblemInfo(p)
        if (!_.isEqual(p.answers, initialVariations)) {
          if (!userInfo.tried.includes(problemId)) {
            changeInfoAndPoint(problemId, TRIED, -bonus)
            userInfo.point -= bonus
          }
        }
        userInfo.tried.push(problemId)
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
        setSolved(userInfo.solved.includes(problemId))
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
      if (info.color !== problemInfo.color) {
        return
      }
      const newInfo = game.tryMove(info, coord)
      if (newInfo.key === info.key) {
        return
      }
      if (newInfo.color === problemInfo.color) {
        if (problemInfo.variations.hasOwnProperty(newInfo.key) && problemInfo.variations[newInfo.key].length === 0) {
          handleWrong("")
        } else if (problemInfo.answers.hasOwnProperty(newInfo.key) && problemInfo.answers[newInfo.key].length === 0) {
          handleCorrect()
        }
      } else {
        if (problemInfo.answers.hasOwnProperty(newInfo.key) && problemInfo.answers[newInfo.key].length === 0) {
          handleCorrect()
        } else {
          handleWrong(menuWords.requestSuggestion[languageIdx])
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
    updateVariations(problemInfo._id, QUESTIONS, newQuestions, username, problemInfo.creator, true)
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
      addSolved(problemInfo._id)
    }
  }

  function handleWrong(mention: string) {
    if (mention) {
      alert(mention)
    } else {
      alert(menuWords.wrong[languageIdx])
    }
    if (solved) {
      return
    }
    addWrong(problemInfo._id, username, userLevel)
  }

  function addSolved(id: string) {
    if (!userInfo.solved.includes(id)) {
      userInfo.solved.push(id)
      sessionStorage.setItem(USERINFO, JSON.stringify(userInfo))
    }
  }
  function handleCorrect() {
    alert(menuWords.correct[languageIdx])
    if (solved) {
      return
    }
    addCorrectUser(problemInfo._id, username, userLevel)
    setSolved(true)
    addSolved(problemInfo._id)
    changeInfoAndPoint(problemInfo._id, SOLVED, bonus)
  }

  const leftMenu = 
  <Box textAlign="center" display={isMobile? "flex" : "grid"} justifyContent={isMobile? "space-between" : "center"}>
    {answerRegistered? <></> : <Typography sx={{color: "red", fontSize:30}}>*</Typography>}
    <Button sx={{margin: margin}} onClick={() => mode === TRY? modeChange(SELF) : modeChange(TRY)}>
      {mode === TRY? menuWords.practice[languageIdx] : menuWords.try[languageIdx]}
    </Button>
    <Button sx={{margin: margin}} onClick={() => moveToAdjacentProblem(-1)}>{menuWords.previousProblem[languageIdx]}</Button>
    <Button sx={{margin: margin}} onClick={() => moveToAdjacentProblem(1)}>{menuWords.nextProblem[languageIdx]}</Button>
    {
      username === creator? 
      <Button sx={{margin: margin}} onClick={() => navigate(`/modify/${problemId}`)}>{menuWords.modify[languageIdx]}</Button> : 
      <Button sx={{margin: margin}} onClick={setAnswerModeAndsetSolved}>
        {mode === ANSWER? menuWords.returnProblem[languageIdx] : menuWords.showAnswer[languageIdx]}
      </Button>
    }
  </Box>

  const rightMenu = 
  <Box textAlign="center" display={isMobile? "flex" : "grid"} justifyContent={isMobile? "space-between" : "center"}>
    <Button sx={{margin: margin}} onClick={goToPreviousMove}>{menuWords.previous[languageIdx]}</Button>
    <Button sx={{margin: margin}} onClick={goToNextMove}>{menuWords.next[languageIdx]}</Button>
    <Button sx={{color: "red", margin: margin}} onClick={() => reset()}>{menuWords.reset[languageIdx]}</Button>
    <Button sx={{margin: margin}} onClick={() => request()}>{menuWords.requestVariation[languageIdx]}</Button>
    {mode === SELF? <Button sx={{margin: margin}} onClick={checkAnswer}>{menuWords.checkAnswer[languageIdx]}</Button> : <></>}
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
      <Grid justifyContent="center" item sx={{
        margin: margin, 
        width: isMobile? width : height - 100, 
        height: isMobile? width : height - 100
      }}>
        <FinalBoard
        lines={info.board.length}
        board={info.board}
        boardWidth={isMobile? width : height - 100}
        moves={info.key}
        variations={(mode === ANSWER)? problemInfo.variations[info.key] : []}
        answers={(mode === ANSWER)? problemInfo.answers[info.key] : []}
        onClick={handleClick}
        />
      </Grid>
      <Grid item sx={{margin: margin, width: isMobile? width : width / 6}}>
        {rightMenu}
        <LikeAndDislike problemId={problemInfo._id} username={username}></LikeAndDislike>
      </Grid>
      <Grid item xs={12}>
        <ReplyBox problemId={problemInfo._id}/>
      </Grid>
    </Grid>
  )
}


