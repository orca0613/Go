import { Box, Button, Divider, Typography } from "@mui/material";
import { menuWords } from "../util/menuWords";
import { ASKED, CREATED, LANGUAGE_IDX, SOLVED, TRIED, USERLEVEL, USERNAME, USERPOINT, WITHQUESTIONS } from "../util/constants";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getUserDetail } from "../util/network";

const divider = <Divider orientation="horizontal" sx={{mt: 1, mb: 2, borderColor: "whitesmoke"}} />

export function MyPage() {
  const userName = localStorage.getItem(USERNAME)
  const level = Number(localStorage.getItem(USERLEVEL))
  const point = Number(localStorage.getItem(USERPOINT))
  const [created, setCreated] = useState<string[]>([])
  const [solved, setSolved] = useState<string[]>([])
  const [tried, setTried] = useState<string[]>([])
  const [asked, setAsked] = useState<string[]>([])
  const [withQuestions, setWithQuestions] = useState<string[]>([])
  const languageIdx = Number(localStorage.getItem(LANGUAGE_IDX))
  const navigate = useNavigate()

  useEffect(() => {
    const userDetail = getUserDetail(userName)
      .then(r => {
        localStorage.setItem(CREATED, r.created.join("&"))
        localStorage.setItem(SOLVED, r.solved.join("&"))
        localStorage.setItem(TRIED, r.tried.join("&"))
        localStorage.setItem(ASKED, r.asked.join("&"))
        localStorage.setItem(WITHQUESTIONS, r.withQuestions.join("&"))
        setCreated(r.created)
        setSolved(r.solved)
        setTried(r.tried)
        setAsked(r.asked)
        setWithQuestions(r.withQuestions)
      })
  }, [userName])

  return (
    <Box>
      <Box sx={{margin: 3}}>
        <Typography sx={{fontSize: 18}}>{menuWords.point[languageIdx]} : {point}</Typography>
        {divider}
        <Typography sx={{fontSize: 18}}>{menuWords.name[languageIdx]} : {userName}</Typography>
        {divider}
        <Typography sx={{fontSize: 18}}>{menuWords.level[languageIdx]} : {level > 0? `${level}${menuWords.K[languageIdx]}` : `${Math.abs(level)}${menuWords.D[languageIdx]}`}</Typography>
        {divider}
        <Button sx={{fontSize: 18}} onClick={() => navigate("/created")}>{menuWords.created[languageIdx]} : {created.length}</Button>
        {divider}
        <Button sx={{fontSize: 18}} onClick={() => navigate("/solved")}>{menuWords.solved[languageIdx]} : {solved.length}</Button>
        {divider}
        <Button sx={{fontSize: 18}} onClick={() => navigate("/unresolved")}>{menuWords.unresolved[languageIdx]} : {tried.length - solved.length}</Button>
        {divider}
        {/* <Button sx={{fontSize: 18}} onClick={() => navigate("/asked")}>asked : {asked.length}</Button>
        {divider} */}
        <Button sx={{fontSize: 18, color: withQuestions.length? "red" : ""}} onClick={() => navigate("/with-questions")}>{menuWords.requestsReceived[languageIdx]} : {withQuestions.length}</Button>
      </Box>
    </Box>
  )
}