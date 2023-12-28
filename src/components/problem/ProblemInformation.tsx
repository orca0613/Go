import { Box, Divider, Typography } from "@mui/material";
import { menuWords } from "../../util/menuWords";
import { LANGUAGE_IDX } from "../../util/constants";
import { ProblemInfo } from "../../util/types";

const divider = <Divider orientation="horizontal" sx={{mt: 1, mb: 1, borderColor:"whitesmoke" }} />

interface PIProps {
  problemInfo: ProblemInfo
  correct: number
  wrong: number
  view: number
}

export function ProblemInformation({ problemInfo, correct, wrong, view }: PIProps) {
  const creator = problemInfo.creator
  const level = problemInfo.level
  const comment = problemInfo.comment
  const color = problemInfo.color
  const languageIdx = Number(localStorage.getItem(LANGUAGE_IDX))
  const turn = color === "b"? menuWords.blackTurn[languageIdx] : menuWords.whiteTurn[languageIdx]

  return (
    <Box sx={{margin: 3, width: 200}}>
      <Typography mb="0.5ch" variant="body1">{turn}</Typography>
      {divider}
      <Typography mb="0.5ch" variant="body1">{menuWords.CREATOR[languageIdx]} : {creator}</Typography>
      {divider}
      <Typography mb="0.5ch" variant="body1">{menuWords.LEVEL[languageIdx]} : {level > 0? `${level}${menuWords.K[languageIdx]}` : `${Math.abs(level)}${menuWords.D[languageIdx]}`}</Typography>
      {divider}
      <Typography mb="0.5ch" variant="body1">{menuWords.views[languageIdx]} : {view}</Typography>
      {divider}
      <Typography mb="0.5ch" variant="body1">{menuWords.correctRate[languageIdx]} : {correct + wrong > 0? `${String(correct / (correct + wrong) * 100).slice(0, 4)}` : 0} % </Typography>
      {divider}
      <Typography mb="0.5ch" variant="body1">{correct} / {correct + wrong}</Typography>
      {divider}
      <Typography sx={{height:60}} mb="0.5ch" variant="body1">{comment? comment : menuWords.noComment[languageIdx]}</Typography>
      {divider}
    </Box>
  )
}