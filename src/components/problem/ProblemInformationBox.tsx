import { Box, Button, Typography } from "@mui/material";
import { menuWords } from "../../util/menuWords";
import { ProblemAndVariations, ProblemInformation } from "../../util/types/types";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { nameButtonStyle } from "../../util/styles";
import { getLanguageIdx, getLevelText } from "../../util/functions";

interface PIProps {
  problemInfo: ProblemAndVariations
  problemInformations: ProblemInformation
  isMobile: boolean
}

export function ProblemInformationBox({ problemInfo, problemInformations, isMobile }: PIProps) {
  const languageIdx = getLanguageIdx()
  const navigate = useNavigate()
  const margin = isMobile? 1 : 2
  const [info, setInfo] = useState({
    color: problemInfo.color,
    creator: problemInfo.creator,
    level: problemInfo.level,
    view: problemInformations.view,
    correct: problemInformations.correctUser.length,
    wrong: problemInformations.wrong,
    totalCorrectUserLevel: problemInformations.totalCorrectUserLevel,
    totalWrongUserLevel: problemInformations.totalWrongUserLevel,
    comment: problemInfo.comment,
  })

  useEffect(() => {
    setInfo({
      color: problemInfo.color,
      creator: problemInfo.creator,
      level: problemInfo.level,
      view: problemInformations.view,
      correct: problemInformations.correctUser.length,
      wrong: problemInformations.wrong,
      totalCorrectUserLevel: problemInformations.totalCorrectUserLevel,
      totalWrongUserLevel: problemInformations.totalWrongUserLevel,
      comment: problemInfo.comment
    })
  }, [problemInfo, problemInformations])

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