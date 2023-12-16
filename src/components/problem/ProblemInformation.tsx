import { Box, Divider, Typography } from "@mui/material";
import { menuWords } from "../../util/menuWords";
import { LANGUAGE_IDX } from "../../util/constants";

const divider = <Divider orientation="horizontal" sx={{mt: 1, mb: 2, borderColor:"whitesmoke" }} />

interface PIProps {
  creator: string
  level: number
  comment: string
  color: string
}

export function ProblemInformation({ color, creator, level, comment }: PIProps) {
  const languageIdx = Number(localStorage.getItem(LANGUAGE_IDX))
  const turn = color === "b"? menuWords.blackTurn[languageIdx] : menuWords.whiteTurn[languageIdx]

  return (
    <Box sx={{margin: 3, width: 200}}>
      <Typography mb="0.5ch" variant="h6">{turn}</Typography>
      {divider}
      <Typography mb="0.5ch" variant="h6">{menuWords.CREATOR[languageIdx]} : {creator}</Typography>
      {divider}
      <Typography mb="0.5ch" variant="h6">{menuWords.LEVEL[languageIdx]} : {level > 0? `${level}${menuWords.K[languageIdx]}` : `${Math.abs(level)}${menuWords.D[languageIdx]}`}</Typography>
      {divider}
      <Typography sx={{height:60}} mb="0.5ch" variant="body1">{comment? comment : menuWords.noComment[languageIdx]}</Typography>
      {divider}
    </Box>
  )
}