import { Box, Typography } from "@mui/material";
import { menuWords } from "../../util/menuWords";
import { LANGUAGE_IDX } from "../../util/constants";
import { ProblemAndVariations } from "../../util/types";
import { useEffect, useState } from "react";
import { getProblemInformations } from "../../network/problemInformation";
import { useWindowSize } from "react-use";
import CommunicationMenu from "../CommunicationMenu";

interface PIProps {
  problemInfo: ProblemAndVariations
}

export function ProblemInformation({ problemInfo }: PIProps) {

  const languageIdx = Number(localStorage.getItem(LANGUAGE_IDX))
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
    if (problemInfo && problemInfo._id) {
      const newInformation = getProblemInformations(problemInfo.problemIdx)
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
    }
  }, [problemInfo])

  const mobileVersion = 
  <Box textAlign="center" display="grid">
    <Box textAlign="center" display="flex" justifyContent="space-around" alignItems="center">
      <Typography 
      sx={{margin: margin}} 
      variant="body1">
        {info.color === "b"? menuWords.blackTurn[languageIdx] : menuWords.whiteTurn[languageIdx]} / {info.level > 0? `${info.level}${menuWords.K[languageIdx]}` : `${Math.abs(info.level)}${menuWords.D[languageIdx]}`}
      </Typography>
      <Typography 
      sx={{margin: margin}} 
      variant="body1">
        {menuWords.correctRate[languageIdx]} : {info.correct + info.wrong > 0? `${String(info.correct / (info.correct + info.wrong) * 100).slice(0, 4)}` : 0} % {`(${info.correct} / ${info.correct + info.wrong})`}
      </Typography>
    </Box>
    <Box display="flex" justifyContent="space-around" alignItems="center">
      <CommunicationMenu creator={info.creator}></CommunicationMenu>
      <Typography sx={{margin: margin}} mb="0.5ch" variant="body1">{menuWords.views[languageIdx]} : {info.view}</Typography>
    </Box>
    <Typography sx={{margin: margin}} mb="0.5ch" variant="body1">{info.comment}</Typography>
  </Box>

  const normalVersion = 
      
    <Box textAlign="center" display="grid" justifyContent="center">
      <Typography sx={{margin: margin}} mb="0.5ch" variant="body1">
        {info.color === "b"? menuWords.blackTurn[languageIdx] : menuWords.whiteTurn[languageIdx]} / {info.level > 0? `${info.level}${menuWords.K[languageIdx]}` : `${Math.abs(info.level)}${menuWords.D[languageIdx]}`}
      </Typography>
      <CommunicationMenu creator={info.creator}></CommunicationMenu>
      <Typography sx={{margin: margin}} mb="0.5ch" variant="body1">{menuWords.views[languageIdx]} : {info.view}</Typography>
      <Typography sx={{margin: margin}} mb="0.5ch" variant="body1">
        {menuWords.correctRate[languageIdx]} : {info.correct + info.wrong > 0? `${String(info.correct / (info.correct + info.wrong) * 100).slice(0, 4)}` : 0} % {`(${info.correct} / ${info.correct + info.wrong})`}
      </Typography>
      {info.comment? <Typography sx={{height:60, margin: margin}} mb="0.5ch" variant="body1">{info.comment}</Typography> : <></>}
    </Box>
  return (
    <Box>
      {isMobile? mobileVersion : normalVersion}
    </Box>
  )
}