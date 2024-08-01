import { useState } from 'react';
import { Box, Button, Divider, Typography, useMediaQuery } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { menuWords } from '../util/menuWords';
import { PAGE, PROBLEM_INDEX, PROBLEM_INDICES, USERINFO } from '../util/constants';
import { SampleProblemInformation, UserInfo } from '../util/types/types';
import { useWindowSize } from 'react-use';
import FinalBoard from './board/FinalBoard';
import SendMessageForm from './SendMessageBox';
import { getLanguageIdx, getLevelText } from '../util/functions';
import { LoadingPage } from './LoadingPage';
import { useGetUserRepresentativeQuery, useGetUserSolvedQuery } from '../slices/sampleProblemApiSlice';
import { useGetUserDetailQuery } from '../slices/userDetailApiSlice';
import { initialUserInfo } from '../util/initialForms';

export default function UserPage() {
  const { name } = useParams()
  const userInfo: UserInfo = JSON.parse(sessionStorage.getItem(USERINFO) || initialUserInfo)
  const { data: info, isLoading: gudLoading } = useGetUserDetailQuery(String(name))
  const navigate = useNavigate()
  const languageIdx = getLanguageIdx()
  const { data: created, isLoading: grLoading } = useGetUserRepresentativeQuery(String(name))
  const { data: solved, isLoading: gsLoading } = useGetUserSolvedQuery(String(name))
  const {width, height} = useWindowSize()
  const isMobile = useMediaQuery("(max-width: 800px)")
  const margin = isMobile? "2%" : "1%"
  const divider = <Divider orientation="horizontal" sx={{borderColor: "lightgray", my: "1%"}} />
  const [open, setOpen] = useState(0)
  const level = info? getLevelText(info.level) : ""

  const messageIcon = 
  <img src="/images/message.svg" alt="message" width={width / 15} height={width / 15}/>

  const customBox = (title: string, content: any) => {
    return (
      <Box
        textAlign="center" 
        alignContent="center"
      >
        <Typography variant="body1" mt={1}>{title}</Typography>
        <Typography variant='caption' color="gray">{content}</Typography>
      </Box>
    )
  }

  const allSeeButton = 
  <Button 
  sx={{fontSize: "120%", color: "black", textTransform: "none", display: info && info.created.length > 4? "" : "none", mx: margin}} 
  onClick={() => moveToCreated()}
>
  {menuWords.seeAll[languageIdx]}
</Button>

const profile = 
<Box justifyContent="center">
  <Box display="flex" justifyContent="center" alignContent="center">
    <Typography sx={{alignContent: "center", color: "teal", fontSize: width / 20, my: 3}}>{info? info.name : ""}</Typography>
    <Button size='small' onClick={() => setOpen(open + 1)}>{messageIcon}</Button>
  </Box>
  {divider}
  <Box
    display="flex" justifyContent="space-around"
  >
    {customBox(level, menuWords.level[languageIdx])}
    {customBox(info? String(info.created.length) : "", menuWords.createdProblem[languageIdx])}
    {customBox(info? String(info.totalLike) : "", menuWords.like[languageIdx])}
    {customBox(info? String(info.solved.length) : "", menuWords.solved[languageIdx])}
  </Box>
</Box>

  const problemLine = (title: string, problemList: SampleProblemInformation[], count: number, created: boolean) => {
    return (
      <Box>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography mx={margin} variant="h6">{`${title} (${count})`}</Typography>
          {created? allSeeButton : ""}
        </Box>
        <Box sx={{display: "flex", flexWrap: "wrap", justifyContent: "space-between"}}>
          {problemList.map((p, idx) => {
            return (
              <Box key={idx} onClick={() => setIdexAndOpenProblem(idx, p.problemIndex, problemList)} m={margin}>
                <FinalBoard 
                  lines={p.initialState.length} 
                  boardWidth={isMobile? width / 2.3 : width / 4.6} 
                  board={p.initialState}
                />
              </Box>
            )
          })}
        </Box>
      </Box>
    )
  }


  function setIdexAndOpenProblem(index: number, problemIdx: number, problemList: SampleProblemInformation[]) {
    const newIndices: number[] = []
    problemList.map(p => {
      newIndices.push(p.problemIndex)
    })
    sessionStorage.setItem(PROBLEM_INDICES, JSON.stringify(newIndices))
    sessionStorage.setItem(PROBLEM_INDEX, String(index))
    navigate(`/problem/${problemIdx}`)
  }

  function moveToCreated() {
    sessionStorage.setItem(PAGE, "1")
    navigate(`/problems/tier=0&level=0&creator=${name}&`)
  }
  
  if (grLoading || gsLoading || gudLoading) {
    return (
      <LoadingPage></LoadingPage>
    )
  }
    
  return (
    <Box>
      {profile}
      {divider}
      {created? problemLine(menuWords.createdProblem[languageIdx], created, info? info.created.length : 0, true) : <></>}
      {divider}
      {solved? problemLine(menuWords.solved[languageIdx], solved, info? info.solved.length : 0, false) : <></>}
      <SendMessageForm receiver={info? info.name : ""} sender={userInfo.name} open={open}/>
    </Box>
  );
}