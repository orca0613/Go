import { Box, Button, Divider, Grid, Typography, useMediaQuery } from "@mui/material";
import { menuWords } from "../../util/menuWords";
import { LANGUAGE_IDX } from "../../util/constants";
import { ProblemInfo } from "../../util/types";
import { useEffect, useState } from "react";
import { getProblemInformations } from "../../network/problemInformation";

const divider = <Divider orientation="horizontal" sx={{mt: "0.5vh", mb: "0.5vh", borderColor:"whitesmoke" }} />

interface PIProps {
  problemInfo: ProblemInfo
}

export function ProblemInformation({ problemInfo }: PIProps) {

  const languageIdx = Number(localStorage.getItem(LANGUAGE_IDX))
  const isMobile = useMediaQuery("(max-width: 800px)")
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
      const newInformation = getProblemInformations(problemInfo._id)
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
  return (
    <Box textAlign="center">
      <Typography mb="0.5ch" variant="body1">
        {info.color === "b"? menuWords.blackTurn[languageIdx] : menuWords.whiteTurn[languageIdx]}
      </Typography>
      <Typography sx={{margin: 2, display: isMobile? "none" : ""}} mb="0.5ch" variant="body1">{info.creator}</Typography>
      <Typography sx={{margin: 2, display: isMobile? "none" : ""}} mb="0.5ch" variant="body1">
        {menuWords.LEVEL[languageIdx]} : {info.level > 0? `${info.level}${menuWords.K[languageIdx]}` : `${Math.abs(info.level)}${menuWords.D[languageIdx]}`}
      </Typography>
      <Typography sx={{margin: 2, display: isMobile? "none" : ""}} mb="0.5ch" variant="body1">{menuWords.views[languageIdx]} : {info.view}</Typography>
      <Typography sx={{margin: 2, display: isMobile? "none" : ""}} mb="0.5ch" variant="body1">
        {menuWords.correctRate[languageIdx]} : {info.correct + info.wrong > 0? `${String(info.correct / (info.correct + info.wrong) * 100).slice(0, 4)}` : 0} % 
      </Typography>
      <Typography sx={{margin: 2, display: isMobile? "none" : ""}} mb="0.5ch" variant="body1">{info.correct} / {info.correct + info.wrong}</Typography>
      <Typography sx={{height:60, margin: 2, display: isMobile? "none" : ""}} mb="0.5ch" variant="body1">{info.comment? info.comment : menuWords.noComment[languageIdx]}</Typography>
    </Box>
  )
}