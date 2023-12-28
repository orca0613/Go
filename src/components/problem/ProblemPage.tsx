import { useEffect, useState } from "react";
import _ from 'lodash'
import {  Box, Button, Typography, useMediaQuery } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { MakingVariations } from "./MakingVariations";
import { ProblemInformation } from "./ProblemInformation";
import problemStore from "../../store/problemStore";
import { setProblemIndex } from "../../redux/actions";
import { Problem } from "./Problem";
import { ModifyProblem } from "./ModifyProblem";
import { addElement, getProblemInformations, deleteProblem, changePoint, changeCount, deleteElement } from "../../util/network";
import { DISLIKED, LANGUAGE_IDX, LIKED, SOLVED, TRIED, USERNAME, bonus, initialVariations } from "../../util/constants";
import { ShowAnswer } from "./ShowAnswer";
import { menuWords } from "../../util/menuWords";
import { checkTried } from "../../util/functions";
import { SelfMode } from "./SelfMode";
import { ReplyBox } from "../ReplyBox";

export function ProblemPage() {
  const navigate = useNavigate()
  const problems = problemStore.getState().problemList
  if (problems.length === 0) {
    return <Button onClick={() => navigate("/home")}>home</Button>
  }
  const [index, setIndex] = useState(problemStore.getState().curIndex)
  const problemCount = problems.length
  const [liked, setLiked] = useState(localStorage.getItem(LIKED)?.split("&")?? [])
  const [disliked, setDisliked] = useState(localStorage.getItem(DISLIKED)?.split("&")?? [])
  const [problemInfo, setProblemInfo] = useState(problems[index])
  const [id, setId] = useState(problemInfo._id)
  const [creator, setCreator] = useState(problemInfo.creator)
  const username = localStorage.getItem(USERNAME)
  const [selfPlay, setSelfPlay] = useState(false)
  const [modifyMode, setModifyMode] = useState(false)
  const [variationMode, setVariationMode] = useState(true)
  const [showAnswer, setShowAnswer] = useState(false)
  const [like, setLike] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [dislikeCount, setDislikeCount] = useState(0)
  const [dislike, setDislike] = useState(false)
  const [answerRegistered, setAnswerRegistered] = useState(true)
  const isMobile = useMediaQuery("(max-width: 600px)")
  const languageIdx = Number(localStorage.getItem(LANGUAGE_IDX))

  const [info, setInfo] = useState(<ProblemInformation
    problemInfo={problemInfo}
    correct={0}
    wrong={0}
    view={0}
  />)

  const [problem, setProblem] = useState(<Problem
    problemInfo={problemInfo}
  />)

  const [selfMode, setSelfMode] = useState(<SelfMode
    problemInfo={problemInfo}
  />)

  const [answer, setAnswer] = useState(<ShowAnswer
    problemInfo={problemInfo}
  />)

  const [replyBox, setReplyBox] = useState(<ReplyBox 
    problemId={problemInfo._id}
  />)
  
  useEffect(() => {
    const newProblemInfo = problems[index]
    if (!_.isEqual(newProblemInfo.answers, initialVariations)) {
      setAnswerRegistered(true)
      if (!checkTried(newProblemInfo._id)) {
        addElement(TRIED)
        const tried = localStorage.getItem(TRIED)
        localStorage.setItem(TRIED, tried + "&" + newProblemInfo._id)
        changePoint(bonus, "sub")
      }
    } else {
      setAnswerRegistered(false)
    }
    const newInfo = getProblemInformations(newProblemInfo._id)
    .then(info => {
      setInfo(<ProblemInformation
        problemInfo={newProblemInfo}
        correct={info.correct ?? 0}
        wrong={info.wrong ?? 0}
        view={info.view ?? 0}
      />)
      setLikeCount(info.like)
      setDislikeCount(info.dislike)
    })
    changeCount("view", username?? "")
    setProblemInfo(newProblemInfo)
    setId(newProblemInfo._id)
    setCreator(newProblemInfo.creator)
    setSelfPlay(false)
    setModifyMode(false)
    setShowAnswer(false)
    setVariationMode(true)
    setLike(liked.includes(newProblemInfo._id))
    setDislike(disliked.includes(newProblemInfo._id))
    setProblem(<Problem
      problemInfo={newProblemInfo}
      />)
    setSelfMode(<SelfMode
      problemInfo={newProblemInfo}
      />)
    setAnswer(<ShowAnswer
      problemInfo={newProblemInfo}
    />)
    setReplyBox(<ReplyBox 
      problemId={newProblemInfo._id}
    />)
  }, [index])

  function changeSelfPlayMode() {
    setSelfPlay(!selfPlay)
  }

  function handleLike() {
    if (like) {
      changeCount("deductLike", username?? "") // Decrease the count of likes in the program information database by 1.
      deleteElement(LIKED)
      setLike(false)
      setLikeCount(likeCount - 1)
      const newLiked = liked.filter(e => {
        e !== id
      })
      setLiked(newLiked)
      localStorage.setItem(LIKED, newLiked.join("&"))
    } else {
      changeCount("like", username?? "")
      addElement(LIKED)
      setLike(true)
      setLikeCount(likeCount + 1)
      const newLiked = _.cloneDeep(liked)
      newLiked.push(id)
      setLiked(newLiked)
      localStorage.setItem(LIKED, newLiked.join("&"))
    }
  }

  function handleDislike() {
    if (dislike) {
      changeCount("deductDislike", username?? "")
      deleteElement(DISLIKED)
      setDislike(false)
      setDislikeCount(dislikeCount - 1)
      const newDisliked = disliked.filter(e => {
        e !== id
      })
      setDisliked(newDisliked)
      localStorage.setItem(DISLIKED, newDisliked.join("&"))
    } else {
      changeCount("dislike", username?? "")
      addElement(DISLIKED)
      setDislike(true)
      setDislikeCount(dislikeCount + 1)
      const newDisliked = _.cloneDeep(disliked)
      newDisliked.push(id)
      setDisliked(newDisliked)
      localStorage.setItem(DISLIKED, newDisliked.join("&"))
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
      addElement(SOLVED)
    }
  }

  function removeProblemAndMove() {
    deleteProblem(problemInfo._id, creator)
    navigate("/home")
  }

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
          {info}
          {answerRegistered?
            <></> :
            <Typography sx={{color: "red", fontSize:10}}>{menuWords.noAnswerWarning[languageIdx]}</Typography>
          }
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
              {creator === username? 
                <Box display="grid">
                  <Button sx={{margin: 2}} onClick={modifyVariations}>{modifyMode? menuWords.returnProblem[languageIdx] : menuWords.modify[languageIdx]}</Button>
                  <Button sx={{color: "red"}} onClick={removeProblemAndMove}>{menuWords.deleteProblem[languageIdx]}</Button>
                </Box> : 
                <Box sx={{alignItems: "center", margin: 2}}>
                  <Button sx={{color: like? "green" : "black"}} onClick={handleLike}>{menuWords.like[languageIdx]} {likeCount}</Button>
                  <Button sx={{color: dislike? "red" : "black"}} onClick={handleDislike}>{menuWords.dislike[languageIdx]} {dislikeCount}</Button>
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
      <Box sx={{mt:10}}>
        {modifyMode? <></> : replyBox}
      </Box>
    </Box>
  )

}