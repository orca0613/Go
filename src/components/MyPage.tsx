import { Box, Button, Divider, Typography } from "@mui/material";
import { menuWords } from "../util/menuWords";
import { CREATED, LANGUAGE_IDX, LIKED, SOLVED, UNRESOLVED, USERINFO, WITHQUESTIONS, initialUserInfo } from "../util/constants";
import { useNavigate } from "react-router-dom";
import { UserInfo } from "../util/types";


const divider = <Divider orientation="horizontal" sx={{mt: 1, mb: 2, borderColor: "white"}} />

export function MyPage() {
  const userInfo: UserInfo = (JSON.parse(localStorage.getItem(USERINFO) || initialUserInfo))
  const languageIdx = Number(localStorage.getItem(LANGUAGE_IDX))
  const navigate = useNavigate()

  return (
    <Box>
      <Box sx={{margin: 3}} textAlign="center">
        <Typography sx={{fontSize: 18}}>{menuWords.point[languageIdx]} : {userInfo.point}</Typography>
        {divider}
        <Typography sx={{fontSize: 18}}>{menuWords.name[languageIdx]} : {userInfo.name}</Typography>
        {divider}
        <Typography sx={{fontSize: 18}}>{menuWords.level[languageIdx]} : {userInfo.level > 0? `${userInfo.level}${menuWords.K[languageIdx]}` : `${Math.abs(userInfo.level)}${menuWords.D[languageIdx]}`}</Typography>
        {divider}
        <Button sx={{fontSize: 18}} onClick={() => navigate(CREATED)}>{menuWords.created[languageIdx]} : {userInfo.created.length}</Button>
        {divider}
        <Button sx={{fontSize: 18}} onClick={() => navigate(SOLVED)}>{menuWords.solved[languageIdx]} : {userInfo.solved.length}</Button>
        {divider}
        <Button sx={{fontSize: 18}} onClick={() => navigate(UNRESOLVED)}>{menuWords.unresolved[languageIdx]} : {Math.max(userInfo.tried.length - userInfo.solved.length, 0)}</Button>
        {divider}
        <Button sx={{fontSize: 18}} onClick={() => navigate(LIKED)}>{menuWords.liked[languageIdx]} : {userInfo.liked.length}</Button>
        {divider}
        {userInfo.withQuestions.length? 
          <Button sx={{fontSize: 18, color: "red"}} onClick={() => navigate(WITHQUESTIONS)}>{menuWords.requestsReceived[languageIdx]} : {userInfo.withQuestions.length}</Button> :
          <></>
        }
      </Box>
    </Box>
  )
}