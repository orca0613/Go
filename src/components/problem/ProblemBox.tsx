
import { useEffect, useState } from "react";
import _ from 'lodash'
import {  Box, Button, Typography, useMediaQuery } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { MakingVariations } from "./MakingVariations";
import { Problem } from "./Problem";
import { ModifyProblem } from "./ModifyProblem";
import { LANGUAGE_IDX, SOLVED, USERNAME, initialVariations } from "../../util/constants";
import { ShowAnswer } from "./ShowAnswer";
import { menuWords } from "../../util/menuWords";
import { SelfMode } from "./SelfMode";
import { ReplyBox } from "../ReplyBox";
import { LikeAndDislike } from "../LikeAndDislike";
import { ProblemInfo } from "../../util/types";
import { ProblemInformation } from "./ProblemInformation";
import problemStore from "../../store/problemStore";
import { setProblemIndex } from "../../redux/actions";
import { getProblemInformations } from "../../network/problemInformation";
import { addElement } from "../../network/userDetail";
import { deleteProblem } from "../../network/problem";

interface ProblemPageProps {
  problemInfo: ProblemInfo
}

export function ProblemBox({ problemInfo }: ProblemPageProps) {
  const navigate = useNavigate()
  const problemId = problemInfo._id
  const answers = problemInfo.answers
  const answerRegistered = !_.isEqual(answers, initialVariations)
  const creator = problemInfo.creator
  const username = localStorage.getItem(USERNAME)?? ""
  const isMobile = useMediaQuery("(max-width: 600px)")
  const languageIdx = Number(localStorage.getItem(LANGUAGE_IDX))
  const [information, setInformation] = useState({
    problemInfo: problemInfo,
    correct: 0,
    wrong: 0,
    view: 0, 
  })

  const [info, setInfo] = useState({
    selfPlayMode: false,
    modifyMode: false,
    variationMode: true,
    showAnswerMode: false,
  })

  function changeInfo(where: string, val: any) {
    setInfo({
      ...info,
      [where]: val
    })
  }

  useEffect(() => {
    if (problemId) {
      const newInformation = getProblemInformations(problemId)
      .then(information => {
        setInformation({
          problemInfo: problemInfo,
          correct: information.correct,
          wrong: information.wrong,
          view: information.view
        })
      })
    }
    setInfo({
      selfPlayMode: false,
      modifyMode: false,
      variationMode: true,
      showAnswerMode: false,
    })
  }, [problemInfo])

  function changeModifyMode() {
    if (creator !== username) {
      alert("권한이 없습니다.")
      return
    }
    changeInfo("modifyMode", !info.modifyMode)
  }

  function setShowAnswerAndsetSolved() {
    if (info.showAnswerMode) {
      changeInfo("showAnswerMode", false)
      return
    }
    changeInfo("showAnswerMode", true)
    addElement(problemId, username, SOLVED)
  }

  function removeProblemAndMove() {
    deleteProblem(problemInfo._id, creator)
    navigate("/home")
  }

  function moveToNextProblem() {
    const problemList = problemStore.getState().problemList
    const index = problemStore.getState().curIndex
    if (problemList.length === 0 || index < 0 || problemList.length <= index + 1) {
      alert(menuWords.noProblemWarning[languageIdx])
      return
    }
    problemStore.dispatch(setProblemIndex(index + 1))
    const nextProblemId = problemList[index + 1]._id
    navigate(`/problem/${nextProblemId}`)
  }

  function moveToPreviousProblem() {
    const problemList = problemStore.getState().problemList
    const index = problemStore.getState().curIndex
    if (problemList.length === 0 || index <= 0) {
      alert(menuWords.noProblemWarning[languageIdx])
      return
    }
    problemStore.dispatch(setProblemIndex(index - 1))
    const nextProblemId = problemList[index - 1]._id
    navigate(`/problem/${nextProblemId}`)
  }

  const margin = 1

  return (
    <Box>
      <Box display="flex" textAlign="center">
        <Box
          sx={{
            flex: isMobile ? undefined : `0 0 200px`,
            mr: isMobile ? '0' : '1ch',
            width: 300
          }}
        >
          <ProblemInformation {...information}></ProblemInformation>
          {answerRegistered?
            <></> :
            <Typography sx={{color: "red", fontSize:10}}>{menuWords.noAnswerWarning[languageIdx]}</Typography>
          }
          <Box textAlign="center">
            {info.modifyMode? 
            <Box display="grid">
              <Button 
              sx={{margin: margin}} 
              onClick={changeModifyMode}
              >
                {menuWords.returnProblem[languageIdx]}
              </Button>
              <Button 
              onClick={() => changeInfo("variationMode", !info.variationMode)}
              >
                {info.variationMode? menuWords.modifyProblem[languageIdx] : menuWords.modifyVariations[languageIdx]}
              </Button>
            </Box> : 
            <Box display="grid">
              <Button 
              sx={{margin: margin}} 
              onClick={() => changeInfo("selfPlayMode", !info.selfPlayMode)}
              >
                {info.selfPlayMode? menuWords.try[languageIdx] : menuWords.practice[languageIdx]}
              </Button>
              <Button 
              sx={{margin: margin}} 
              onClick={moveToPreviousProblem}
              >
                {menuWords.previousProblem[languageIdx]}
              </Button>
              <Button 
              sx={{margin: margin}} 
              onClick={moveToNextProblem}
              >
                {menuWords.nextProblem[languageIdx]}
              </Button>
              <Button 
              sx={{margin: margin}} 
              onClick={setShowAnswerAndsetSolved}
              >
                {info.showAnswerMode? menuWords.returnProblem[languageIdx] : menuWords.showAnswer[languageIdx]}
              </Button>
              {creator === username? 
              <Box display="grid">
                <Button 
                sx={{margin: margin}} 
                onClick={changeModifyMode}
                >
                  {info.modifyMode? menuWords.returnProblem[languageIdx] : menuWords.modify[languageIdx]}
                </Button>
                <Button 
                sx={{color: "red", margin: margin}} 
                onClick={removeProblemAndMove}
                >
                  {menuWords.deleteProblem[languageIdx]}
                </Button>
              </Box> : <></>}
              <LikeAndDislike problemId={problemInfo._id} username={username}></LikeAndDislike>
            </Box>
            }
          </Box>
        </Box>
        {info.modifyMode? 
        <>
          {info.variationMode? 
          <MakingVariations 
          problemInfo={problemInfo}
          /> :
          <ModifyProblem 
          problemInfo={problemInfo}
          />}
        </> :
        <>
          {info.showAnswerMode? 
          <ShowAnswer 
          problemInfo={problemInfo} 
          /> : 
          info.selfPlayMode? 
          <SelfMode 
          problemInfo={problemInfo} 
          /> : 
          <Problem 
          problemInfo={problemInfo} 
          />}
        </>}
      </Box>
      <Box sx={{mt:10}}>
        {info.modifyMode? <></> : <ReplyBox problemId={problemId} />}
      </Box>
    </Box>
  )
}

