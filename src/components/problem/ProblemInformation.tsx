import { Box, Button, Typography } from "@mui/material";
import { menuWords } from "../../util/menuWords";
import { ProblemAndVariations } from "../../util/types";
import { useEffect, useState } from "react";
import { getProblemInformations } from "../../network/problemInformation";
import { useWindowSize } from "react-use";
import { useNavigate } from "react-router-dom";
import { nameButtonStyle } from "../../util/styles";
import { getLanguageIdx, getLevelText } from "../../util/functions";
import { LoadingPage } from "../LoadingPage";

interface PIProps {
  problemInfo: ProblemAndVariations
}

export function ProblemInformation({ problemInfo }: PIProps) {
  const languageIdx = getLanguageIdx()
  const navigate = useNavigate()
  const {width, height} = useWindowSize()
  const isMobile = height > width * 2 / 3 || width < 1000
  const margin = isMobile? 1 : 2
  const [info, setInfo] = useState({
    color: problemInfo.color,
    creator: problemInfo.creator,
    level: problemInfo.level,
    view: 0,
    correct: 0,
    wrong: 0,
    totalCorrectUserLevel: 0,
    totalWrongUserLevel: 0,
    comment: problemInfo.comment,
  })

  useEffect(() => {
    getProblemInformations(problemInfo.problemIdx)
    .then(information => {
      setInfo({
        color: problemInfo.color,
        creator: problemInfo.creator,
        level: problemInfo.level,
        view: information.view,
        correct: information.correctUser.length,
        wrong: information.wrong,
        totalCorrectUserLevel: information.totalCorrectUserLevel,
        totalWrongUserLevel: information.totalWrongUserLevel,
        comment: problemInfo.comment
      })
    })
  }, [problemInfo])

  if (!problemInfo.creator) return <LoadingPage></LoadingPage>

  const mobileVersion = 
  <Box textAlign="center" display="grid">
    <Box textAlign="center" display="flex" justifyContent="space-around" alignItems="center">
      <Typography 
      sx={{margin: margin}} 
      variant="body1">
        {info.color === "b"? menuWords.blackTurn[languageIdx] : menuWords.whiteTurn[languageIdx]} / {getLevelText(info.level)}
      </Typography>
      <Typography 
      sx={{margin: margin}} 
      variant="body1">
        {menuWords.correctRate[languageIdx]} : {info.correct + info.wrong > 0? `${String(info.correct / (info.correct + info.wrong) * 100).slice(0, 4)}` : 0} % {`(${info.correct} / ${info.correct + info.wrong})`}
      </Typography>
    </Box>
    <Box display="flex" justifyContent="space-around" alignItems="center">
      <Button onClick={() => navigate(`/userpage/${info.creator}`)} sx={nameButtonStyle}>{info.creator}</Button>
      <Typography sx={{mx: margin}} mb="0.5ch" variant="body1">{menuWords.views[languageIdx]} : {info.view}</Typography>
    </Box>
    <Typography sx={{mx: margin}} mb="0.5ch" variant="body1">{info.comment}</Typography>
  </Box>

  const normalVersion = 
      
    <Box textAlign="center" display="grid" justifyContent="center">
      <Typography sx={{margin: margin}} mb="0.5ch" variant="body1">
        {info.color === "b"? menuWords.blackTurn[languageIdx] : menuWords.whiteTurn[languageIdx]} / {info.level > 0? `${info.level}${menuWords.K[languageIdx]}` : `${Math.abs(info.level)}${menuWords.D[languageIdx]}`}
      </Typography>
      <Button onClick={() => navigate(`/userpage/${info.creator}`)} sx={nameButtonStyle}>{info.creator}</Button>
      <Typography sx={{margin: margin}} mb="0.5ch" variant="body1">{menuWords.views[languageIdx]} : {info.view}</Typography>
      <Typography sx={{margin: margin}} mb="0.5ch" variant="body1">
        {menuWords.correctRate[languageIdx]} : {info.correct + info.wrong > 0? `${String(info.correct / (info.correct + info.wrong) * 100).slice(0, 4)}` : 0} % {`(${info.correct} / ${info.correct + info.wrong})`}
      </Typography>
      {info.comment? <Typography sx={{margin: margin}} mb="0.5ch" variant="body1">{info.comment}</Typography> : <></>}
    </Box>
  return (
    <Box>
      {isMobile? mobileVersion : normalVersion}
    </Box>
  )
}