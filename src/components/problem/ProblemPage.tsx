import { useEffect, useState } from "react";
import _ from 'lodash'
import {  Box, Button, Divider, useMediaQuery } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { MakingVariations } from "./MakingVariations";
import { ProblemInformation } from "./ProblemInformation";
import problemStore from "../../store/problemStore";
import { setProblemIndex } from "../../redux/actions";
import { Problem } from "./Problem";
import { ModifyProblem } from "./ModifyProblem";
import { addDislike, addLike, addSolved, addTried, addView, deductDislike, deductLike, deductPoint } from "../../util/network";
import { LANGUAGE_IDX, USERNAME, bonus, initialVariations } from "../../util/constants";
import { ShowAnswer } from "./ShowAnswer";
import { menuWords } from "../../util/menuWords";
import { checkTried } from "../../util/functions";
import { SelfMode } from "./SelfMode";

export function ProblemPage() {
  const navigate = useNavigate()
  const problems = problemStore.getState().problemList
  console.log(problems.length)
  if (problems.length === 0) {
    return <Button onClick={() => navigate("/home")}>home</Button>
  }
  const [index, setIndex] = useState(problemStore.getState().curIndex)
  const problemCount = problems.length
  const [problemInfo, setProblemInfo] = useState(problems[index])
  const [id, setId] = useState(problemInfo._id)
  const [creator, setCreator] = useState(problemInfo.creator)
  const username = localStorage.getItem(USERNAME)
  const [selfPlay, setSelfPlay] = useState(false)
  const [modifyMode, setModifyMode] = useState(false)
  const [variationMode, setVariationMode] = useState(true)
  const [showAnswer, setShowAnswer] = useState(false)
  const [like, setLike] = useState(false)
  const [dislike, setDislike] = useState(false)
  const isMobile = useMediaQuery("(max-width: 600px)")
  const languageIdx = Number(localStorage.getItem(LANGUAGE_IDX))
  const divider = <Divider orientation="horizontal" sx={{mt: 1, mb: 2 }} />

  const info = <ProblemInformation
    creator={creator}
    level={problemInfo.level}
    color={problemInfo.color}
    comment={problemInfo.comment}
  />

  const [problem, setProblem] = useState(<Problem
    initialState={problemInfo.initialState}
    variations={problemInfo.variations}
    answers={problemInfo.answers}
    turn={problemInfo.color}
  />)

  const [selfMode, setSelfMode] = useState(<SelfMode
    boardInfo={{
      board: problemInfo.initialState,
      color: problemInfo.color,
    }}
    variations={problemInfo.variations}
    answers={problemInfo.answers}
  />)

  const [answer, setAnswer] = useState(<ShowAnswer
    problemInfo={problemInfo}
  />)
  
  useEffect(() => {
    const newProblemInfo = problems[index]
    if (!checkTried()) {
      addTried()
      if (!_.isEqual(newProblemInfo.answers, initialVariations)) {
        deductPoint(bonus)
      }
    }
    addView()
    setProblemInfo(newProblemInfo)
    setId(newProblemInfo._id)
    setCreator(newProblemInfo.creator)
    setSelfPlay(false)
    setModifyMode(false)
    setShowAnswer(false)
    setVariationMode(true)
    setLike(false)
    setDislike(false)
    setProblem(<Problem
      initialState={newProblemInfo.initialState}
      variations={newProblemInfo.variations}
      answers={newProblemInfo.answers}
      turn={newProblemInfo.color}
      />)
    setSelfMode(<SelfMode
      boardInfo={{
        board: newProblemInfo.initialState,
        color: newProblemInfo.color,
      }}
      variations={newProblemInfo.variations}
      answers={newProblemInfo.answers}
      />)
    setAnswer(<ShowAnswer
      problemInfo={newProblemInfo}
    />)

  }, [index])

  function changeSelfPlayMode() {
    setSelfPlay(!selfPlay)
  }

  function handleLike() {
    if (like) {
      deductLike()
      setLike(false)
    } else {
      addLike()
      setLike(true)
    }
  }

  function handleDislike() {
    if (dislike) {
      deductDislike()
      setDislike(false)
    } else {
      addDislike()
      setDislike(true)
    }
  }

  function changeVariationMode() {
    setVariationMode(!variationMode)
  }

  function modifyVariations() {
    if (creator !== username) {
      alert("권한이 없습니다.")
      return
    } else {
      setModifyMode(!modifyMode)
    }
  }

  function changeProblem(idx: number) {
    if (idx < 0 || idx >= problemCount) {
      alert(menuWords.noProblemWarning[languageIdx])
      return
    }
    problemStore.dispatch(setProblemIndex(idx))
    setIndex(idx)
  }

  function setShowAnswerAndsetSolved() {
    if (showAnswer) {
      setShowAnswer(false)
      return
    } else {
      setShowAnswer(true)
      addSolved()
    }
  }


  return (
    <Box display="flex">
      <Box
        sx={{
          flex: isMobile ? undefined : `0 0 200px`,
          mr: isMobile ? '0' : '1ch',
          width: 300
        }}
      >
        {info}
        <Box textAlign="center">
          {modifyMode? 
          <Box>
            <Button sx={{margin: 3}} onClick={modifyVariations}>{menuWords.returnProblem[languageIdx]}</Button>
            <Button onClick={changeVariationMode}>
              {variationMode? menuWords.modifyProblem[languageIdx] : menuWords.modifyVariations[languageIdx]}
            </Button>
          </Box> : 
          <Box display="grid">
            <Button sx={{margin: 2}} onClick={changeSelfPlayMode}>{selfPlay? menuWords.try[languageIdx] : menuWords.practice[languageIdx]}</Button>
            <Button sx={{margin: 2}} onClick={() => changeProblem(index - 1)}>{menuWords.previousProblem[languageIdx]}</Button>
            <Button sx={{margin: 2}} onClick={() => changeProblem(index + 1)}>{menuWords.nextProblem[languageIdx]}</Button>
            <Button sx={{margin: 2}} onClick={setShowAnswerAndsetSolved}>{showAnswer? menuWords.returnProblem[languageIdx] : menuWords.showAnswer[languageIdx]}</Button>
            {creator === username? <Button sx={{margin: 2}} onClick={modifyVariations}>{modifyMode? menuWords.returnProblem[languageIdx] : menuWords.modify[languageIdx]}</Button> : 
              <Box sx={{alignItems: "center", margin: 2}}>
                <Button sx={{color: like? "green" : "black"}} onClick={handleLike}>{menuWords.like[languageIdx]}</Button>
                <Button sx={{color: dislike? "red" : "black"}} onClick={handleDislike}>{menuWords.dislike[languageIdx]}</Button>
              </Box>}
          </Box>
          }
        </Box>
      </Box>
      {modifyMode? 
      <>
        {variationMode? <MakingVariations problemInfo={problemInfo}></MakingVariations> :
        <ModifyProblem problemInfo={problemInfo}></ModifyProblem>}
      </> :
      <>
        {showAnswer? answer : selfPlay? selfMode : problem}
      </>}
    </Box>
  )

}