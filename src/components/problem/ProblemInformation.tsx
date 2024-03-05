import { Box, Typography, useMediaQuery } from "@mui/material";
import { menuWords } from "../../util/menuWords";
import { LANGUAGE_IDX } from "../../util/constants";
import { ProblemInfo } from "../../util/types";
import { useEffect, useState } from "react";
import { getProblemInformations } from "../../network/problemInformation";
import { useWindowSize } from "react-use";

interface PIProps {
  problemInfo: ProblemInfo
}

export function ProblemInformation({ problemInfo }: PIProps) {

  const languageIdx = Number(localStorage.getItem(LANGUAGE_IDX))
  const {width, height} = useWindowSize()
  const isMobile = height > width * 2 / 3 || width < 1000
  const margin = 1
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
    <Box textAlign="center" display={isMobile? "flex" : "grid"} justifyContent="center">
      <Typography sx={{margin: margin}} mb="0.5ch" variant="body1">
        {info.color === "b"? menuWords.blackTurn[languageIdx] : menuWords.whiteTurn[languageIdx]} / {info.level > 0? `${info.level}${menuWords.K[languageIdx]}` : `${Math.abs(info.level)}${menuWords.D[languageIdx]}`}
      </Typography>
      <Typography sx={{margin: margin}} mb="0.5ch" variant="body1">{info.creator}</Typography>
      <Typography sx={{margin: margin, display: isMobile? "none" : ""}} mb="0.5ch" variant="body1">{menuWords.views[languageIdx]} : {info.view}</Typography>
      <Typography sx={{margin: margin, display: isMobile? "none" : ""}} mb="0.5ch" variant="body1">
        {menuWords.correctRate[languageIdx]} : {info.correct + info.wrong > 0? `${String(info.correct / (info.correct + info.wrong) * 100).slice(0, 4)}` : 0} % 
      </Typography>
      <Typography sx={{margin: margin, display: isMobile? "none" : ""}} mb="0.5ch" variant="body1">({info.correct} / {info.correct + info.wrong})</Typography>
      <Typography sx={{height:60, margin: margin, display: isMobile? "none" : ""}} mb="0.5ch" variant="body1">{info.comment? info.comment : menuWords.noComment[languageIdx]}</Typography>
    </Box>
  )
}