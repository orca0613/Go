import { useEffect, useState } from 'react'
import { BoardInfo, Coordinate, DeleteProblemFrom, UpdateVariationsForm, UserInfo, Variations } from '../../util/types'
import _ from 'lodash'
import { addCurrentVariation, addProblemIndexToUserInfo, getLanguageIdx, removeCurrentVariation } from '../../util/functions'
import { Box, Button, ButtonGroup, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'
import { ANSWERS, HOME, MARGIN, QUESTIONS, USERINFO, VARIATIONS } from '../../util/constants'
import FinalBoard from '../board/FinalBoard'
import { menuWords } from '../../util/menuWords'
import { getProblemByIdx } from '../../network/problem'
import { Game } from '../../gologic/goGame'
import { ProblemInformation } from '../problem/ProblemInformation'
import { useNavigate, useParams } from 'react-router-dom'
import { useWindowSize } from 'react-use'
import { checkRequest } from '../../network/requests'
import { initialProblemInfo, initialUserInfo, initialVariations } from '../../util/initialForms'
import { mobileButtonStyle, wideButtonStyle } from '../../util/styles'
import { LOGIN_PATH } from '../../util/paths'
import { useDeleteProblemMutation, useUpdateVariationsMutation } from '../../slices/problemApiSlice'

export function ModifyVariations() {

  const { param } = useParams()
  const problemIdx = Number(param)
  const [problemInfo, setProblemInfo] = useState(initialProblemInfo)

  const userInfo: UserInfo = JSON.parse(sessionStorage.getItem(USERINFO) || initialUserInfo)
  const username = userInfo.name
  const navigate = useNavigate()
  const {width, height} = useWindowSize()
  const [del, { isLoading: dpLoading }] = useDeleteProblemMutation()
  const [uv, { isLoading: uvLoading }] = useUpdateVariationsMutation()
  const isMobile = height > width * 2 / 3 || width < 1000
  const margin = isMobile? 0 : MARGIN
  const languageIdx = getLanguageIdx()
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
  const [openWarning, setOpenWarning] = useState(false)

  const mobileIconSize = width / 20
  const IconSize = width / 70

  const leftArrowIcon = 
  <img src="/images/left_arrow.svg" alt="pre" width={isMobile? mobileIconSize : IconSize} height={isMobile? mobileIconSize : IconSize}/>
  const rightArrowIcon = 
  <img src="/images/right_arrow.svg" alt="next" width={isMobile? mobileIconSize : IconSize} height={isMobile? mobileIconSize : IconSize}/>
  const firstIcon = 
  <img src="/images/first.svg" alt="reset" width={isMobile? mobileIconSize : IconSize} height={isMobile? mobileIconSize : IconSize}/>
  const lastIcon = 
  <img src="/images/last.svg" alt="reset" width={isMobile? mobileIconSize : IconSize} height={isMobile? mobileIconSize : IconSize}/>

  const buttonStyle = {
    margin: margin,
    textTransform: "none",
  }

  const dialogContent = (title: string, content: string) => {
    return (
      <>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {content}
          </DialogContentText>
        </DialogContent>
      </>
    )
  }

  function goToLast() {
    const newInfo = game.goToLast()
    setInfo(newInfo)
  }

  function goToInit() {
    const newInfo = game.goToInit()
    setInfo(newInfo)
  }

  function goToPreviousMove() {
    const newInfo = game.previousMove()
    setInfo(newInfo)
  }

  function goToNextMove() {
    const newInfo = game.nextMove()
    setInfo(newInfo)
  }

  function logout() {
    sessionStorage.clear()
    navigate(LOGIN_PATH)
  }

  async function update(problemIdx: number, name: string, creator: string, save: boolean, variatinos?: Variations, answers?: Variations, questions?: Variations) {
    const form: UpdateVariationsForm = {
      problemIdx: problemIdx,
      variations: variatinos,
      answers: answers,
      questions: questions,
      name: name,
      creator: creator,
    }
    await uv(form).unwrap()
    if (save) {
      alert(menuWords.saved[languageIdx])
    } else {
      if (_.isEqual(questions, problemInfo.questions)) {
        alert(menuWords.deletedNotice[languageIdx])
      }
    }
  }

  async function addVariationsAndSetVariations() {
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
    update(problemIdx, username, problemInfo.creator, true, newVariations)
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
    update(problemIdx, username, problemInfo.creator, true, undefined, newAnswers)
  }

  async function removeVariationsAndSetVariations(key: string) {
    const newVariations = removeCurrentVariation(key, problemInfo.variations)
    const newAnswers = removeCurrentVariation(key, problemInfo.answers)
    const newQuestions = removeCurrentVariation(key, problemInfo.questions)
    update(problemIdx, username, problemInfo.creator, false, newVariations, newAnswers, newQuestions)
    setProblemInfo({
      ...problemInfo,
      variations: newVariations,
      answers: newAnswers,
      questions: newQuestions,
    })
  }




  async function handleClick(coord: Coordinate) {
    const newInfo = game.playMove(info, coord)
    setInfo(newInfo)
    if (problemInfo.questions.hasOwnProperty(newInfo.key) && problemInfo.questions[newInfo.key].length === 0) {
      removeVariationsAndSetVariations(newInfo.key)
      await checkRequest(problemIdx, problemInfo.creator, newInfo.key)
    }
  }

  async function deleteProblemAndGoHome() {
    const form: DeleteProblemFrom = {
      problemIdx: problemIdx,
      creator: username,
      level: problemInfo.level,
    }
    await del(form).unwrap()
    alert(menuWords.deletedProblemWarning[languageIdx])
    setOpenWarning(false)
    navigate(HOME)
  }

  useEffect(() => {
    if (!userInfo.name) {
      logout()
    }
    getProblemByIdx(problemIdx)
    .then(p => {
      if (!p) {
        alert(menuWords.wrongIndexWarning[languageIdx])
        return navigate(HOME)
      } 
      if (p.creator !== userInfo.name) {
        alert(menuWords.permissionWarning[languageIdx])
        logout()
      }
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
  }, [problemIdx])

  const mobileTopMenu = 
  <Box display="flex" justifyContent="space-around" alignItems="center">
    <Button sx={buttonStyle} onClick={addAnswersAndSetAnswers}>{menuWords.addAnswers[languageIdx]}</Button>
    <Button sx={buttonStyle} onClick={addVariationsAndSetVariations}>{menuWords.addVariation[languageIdx]}</Button>
    <Button sx={buttonStyle} onClick={() => removeVariationsAndSetVariations(info.key)}>{menuWords.removeVariation[languageIdx]}</Button>
  </Box>

  const mobileBottomMenu = 
  <Box display="flex" justifyContent="space-around" alignItems="center">
    <Button color='warning' sx={mobileButtonStyle} onClick={() => navigate(`/modify-problem/${problemIdx}`)}>{menuWords.modifyProblem[languageIdx]}</Button>
    <ButtonGroup size='small' variant='text' color='inherit' sx={{justifyContent: "center", maxHeight: 30}}>
      <Button onClick={goToInit}>{firstIcon}</Button>
      <Button onClick={goToPreviousMove}>{leftArrowIcon}</Button>
      <Button onClick={goToNextMove}>{rightArrowIcon}</Button>
      <Button onClick={goToLast}>{lastIcon}</Button>
    </ButtonGroup>
    <Button sx={{...mobileButtonStyle, color: "red"}} onClick={() => setOpenWarning(true)}>{menuWords.deleteProblem[languageIdx]}</Button>
  </Box>

  const wideMenu = 
  <Box textAlign="center" display="grid" justifyContent="center">
    <ButtonGroup size='small' variant='text' color='inherit' sx={{justifyContent: "center", maxHeight: 30, my: "10%"}}>
      <Button onClick={goToInit}>{firstIcon}</Button>
      <Button onClick={goToPreviousMove}>{leftArrowIcon}</Button>
      <Button onClick={goToNextMove}>{rightArrowIcon}</Button>
      <Button onClick={goToLast}>{lastIcon}</Button>
    </ButtonGroup>
    <Button sx={wideButtonStyle} onClick={addAnswersAndSetAnswers}>{menuWords.addAnswers[languageIdx]}</Button>
    <Button sx={wideButtonStyle} onClick={addVariationsAndSetVariations}>{menuWords.addVariation[languageIdx]}</Button>
    <Button sx={wideButtonStyle} onClick={() => removeVariationsAndSetVariations(info.key)}>{menuWords.removeVariation[languageIdx]}</Button>
    <Button color='warning' sx={{...wideButtonStyle, mt: 5}} onClick={() => navigate(`/modify-problem/${problemIdx}`)}>{menuWords.modifyProblem[languageIdx]}</Button>
    <Button sx={{...wideButtonStyle, mt: 5, color: "red"}} onClick={() => setOpenWarning(true)}>{menuWords.deleteProblem[languageIdx]}</Button>
  </Box>

  return (
    <Box display={isMobile? "grid" : "flex"} justifyContent="center">
      <Box display="grid" margin={margin} alignContent="start">
        {problemInfo.problemIdx? <ProblemInformation problemInfo={problemInfo}></ProblemInformation> : <></>}
        {isMobile? mobileTopMenu : wideMenu}
      </Box>
      <Box my={3} mx={margin}>
        <FinalBoard 
          lines={info.board.length}
          board={info.board}
          boardWidth={isMobile? width - 16 : height - 100}
          moves={info.key}
          variations={problemInfo.variations[info.key]}
          answers={problemInfo.answers[info.key]}
          questions={problemInfo.questions[info.key]}
          onClick={handleClick}
        />
      </Box>
      <Box>
        {isMobile? mobileBottomMenu : <></>}
      </Box>
      <Dialog open={openWarning} onClose={() => setOpenWarning(false)}>
        {dialogContent(menuWords.confirmRequest[languageIdx], menuWords.deleteProblemWarning[languageIdx])}
        <DialogActions>
          <Button onClick={deleteProblemAndGoHome} sx={{textTransform: "none"}} color="primary" autoFocus>
            {menuWords.confirm[languageIdx]}
          </Button>
          <Button onClick={() => setOpenWarning(false)} sx={{textTransform: "none"}} color="primary">
            {menuWords.cancel[languageIdx]}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
