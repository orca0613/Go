import { Box, Button, Divider, Typography } from "@mui/material";
import userStore from "../store/userStore";
import { menuWords } from "../util/menuWords";
import { LANGUAGE_IDX, USERLEVEL, USERNAME, USERPOINT } from "../util/constants";
import { useNavigate } from "react-router-dom";

const divider = <Divider orientation="horizontal" sx={{mt: 1, mb: 2, borderColor: "whitesmoke"}} />

export function MyPage() {
  const userName = localStorage.getItem(USERNAME)
  const level = Number(localStorage.getItem(USERLEVEL))
  const point = Number(localStorage.getItem(USERPOINT))
  const created = userStore.getState().userCreated
  const solved = userStore.getState().userSolved
  const tried = userStore.getState().userTried
  const languageIdx = Number(localStorage.getItem(LANGUAGE_IDX))
  const navigate = useNavigate()

  return (
    <Box>
      <Box sx={{margin: 3}}>
        <Button sx={{fontSize: 18, color: "inherit"}}>{menuWords.point[languageIdx]} : {point}</Button>
        {divider}
        <Button sx={{fontSize: 18, color: "inherit"}}>{menuWords.name[languageIdx]} : {userName}</Button>
        {divider}
        <Button sx={{fontSize: 18, color: "inherit"}}>{menuWords.level[languageIdx]} : {level > 0? `${level}${menuWords.K[languageIdx]}` : `${Math.abs(level)}${menuWords.D[languageIdx]}`}</Button>
        {divider}
        <Button sx={{fontSize: 18, color: "inherit"}} onClick={() => navigate("/created")}>{menuWords.created[languageIdx]} : {created.length}</Button>
        {divider}
        <Button sx={{fontSize: 18, color: "inherit"}} onClick={() => navigate("/solved")}>{menuWords.solved[languageIdx]} : {solved.length}</Button>
        {divider}
        <Button sx={{fontSize: 18, color: "inherit"}} onClick={() => navigate("/unresolved")}>{menuWords.unresolved[languageIdx]} : {tried.length - solved.length}</Button>
      </Box>
    </Box>
  )
}