import { Box, Button, Divider, Typography } from "@mui/material";
import { menuWords } from "../util/menuWords";
import { CREATED, LANGUAGE_IDX, LIKED, SOLVED, UNRESOLVED, USERINFO, WITHQUESTIONS, initialUserInfo } from "../util/constants";
import { useNavigate } from "react-router-dom";
import { UserInfo } from "../util/types";
import { useEffect, useState } from "react";
import { getUserDetail } from "../network/userDetail";


const divider = <Divider orientation="horizontal" sx={{mt: 1, mb: 2, borderColor: "white"}} />

export function MyPage() {
  const userInfo: UserInfo = (JSON.parse(sessionStorage.getItem(USERINFO) || initialUserInfo))
  const [info, setInfo] = useState<UserInfo>(userInfo)
  const username = userInfo.name
  const languageIdx = Number(localStorage.getItem(LANGUAGE_IDX))
  const navigate = useNavigate()

  useEffect(() => {
    const detail = getUserDetail(username)
    .then(r => {
      const newUserInfo: UserInfo = {
        ...userInfo,
        point: r.point,
        created: r.created,
        withQuestions: r.withQuestions,
        tried: r.tried,
        solved: r.solved,
        liked: r.liked,
        disliked: r.disliked,
      }
      setInfo(newUserInfo)
      sessionStorage.setItem(USERINFO, JSON.stringify(newUserInfo))
    })
  }, [userInfo])

  return (
    <Box>
      <Box sx={{margin: 3}} textAlign="center">
        <Typography sx={{fontSize: 18}}>{menuWords.point[languageIdx]} : {info.point}</Typography>
        {divider}
        <Typography sx={{fontSize: 18}}>{menuWords.name[languageIdx]} : {info.name}</Typography>
        {divider}
        <Typography sx={{fontSize: 18}}>{menuWords.level[languageIdx]} : {info.level > 0? `${info.level}${menuWords.K[languageIdx]}` : `${Math.abs(info.level)}${menuWords.D[languageIdx]}`}</Typography>
        {divider}
        <Button sx={{fontSize: 18}} onClick={() => navigate(CREATED)}>{menuWords.created[languageIdx]} : {info.created.length}</Button>
        {divider}
        <Button sx={{fontSize: 18}} onClick={() => navigate(SOLVED)}>{menuWords.solved[languageIdx]} : {info.solved.length}</Button>
        {divider}
        <Button sx={{fontSize: 18}} onClick={() => navigate(UNRESOLVED)}>{menuWords.unresolved[languageIdx]} : {Math.max(info.tried.length - info.solved.length, 0)}</Button>
        {divider}
        <Button sx={{fontSize: 18}} onClick={() => navigate(LIKED)}>{menuWords.liked[languageIdx]} : {info.liked.length}</Button>
        {divider}
        {info.withQuestions.length? 
          <Button sx={{fontSize: 18, color: "red"}} onClick={() => navigate(WITHQUESTIONS)}>{menuWords.requestsReceived[languageIdx]} : {info.withQuestions.length}</Button> :
          <></>
        }
      </Box>
    </Box>
  )
}