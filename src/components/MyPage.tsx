import { Box, Button, Divider, Typography } from "@mui/material";
import { menuWords } from "../util/menuWords";
import { ASKED, CREATED, LANGUAGE_IDX, LIKED, SOLVED, TRIED, USERLEVEL, USERNAME, USERPOINT, WITHQUESTIONS } from "../util/constants";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getUserDetail } from "../network/userDetail";

const divider = <Divider orientation="horizontal" sx={{mt: 1, mb: 2, borderColor: "whitesmoke"}} />

export function MyPage() {
  const userName = localStorage.getItem(USERNAME)
  const level = Number(localStorage.getItem(USERLEVEL))
  const point = Number(localStorage.getItem(USERPOINT))
  const [info, setInfo] = useState({
    created: [],
    solved: [],
    tried: [],
    liked: [],
    withQuestions: [],
  })
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
        localStorage.setItem(LIKED, r.liked.join("&"))
        setInfo({
          created: r.created,
          solved: r.solved,
          tried: r.tried,
          liked: r.liked,
          withQuestions: r.withQuestions
        })
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
        <Button sx={{fontSize: 18}} onClick={() => navigate(`${CREATED}`)}>{menuWords.created[languageIdx]} : {info.created.length}</Button>
        {divider}
        <Button sx={{fontSize: 18}} onClick={() => navigate(`${SOLVED}`)}>{menuWords.solved[languageIdx]} : {info.solved.length}</Button>
        {divider}
        <Button sx={{fontSize: 18}} onClick={() => navigate("unresolved")}>{menuWords.unresolved[languageIdx]} : {Math.max(info.tried.length - info.solved.length, 0)}</Button>
        {divider}
        <Button sx={{fontSize: 18}} onClick={() => navigate(`${LIKED}`)}>{menuWords.liked[languageIdx]} : {info.liked.length}</Button>
        {divider}
        {/* <Button sx={{fontSize: 18}} onClick={() => navigate("/asked")}>asked : {asked.length}</Button>
        {divider} */}
        {info.withQuestions.length? 
          <Button sx={{fontSize: 18, color: "red"}} onClick={() => navigate(`${WITHQUESTIONS}`)}>{menuWords.requestsReceived[languageIdx]} : {info.withQuestions.length}</Button> :
          <></>
        }
      </Box>
    </Box>
  )
}