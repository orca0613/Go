import { useEffect, useState } from 'react';
import { Box, Button, Divider, Typography, useMediaQuery } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { menuWords } from '../util/menuWords';
import { LANGUAGE_IDX, PAGE, PROBLEM_INDEX, PROBLEM_INDICES, USERINFO } from '../util/constants';
import { initialUserInfo } from '../util/initialForms';
import { SampleProblemInformation, UserInfo } from '../util/types';
import { getUserDetail } from '../network/userDetail';
import { useWindowSize } from 'react-use';
import FinalBoard from './board/FinalBoard';
import SendMessageForm from './SendMessageForm';
import { getRepresentativeProblem, getSolvedProblem } from '../network/sampleProblem';
import { loginWarning } from '../util/functions';
import { LOGIN_PATH } from '../util/paths';

export default function UserPage() {
  const { name } = useParams()
  const userInfo: UserInfo = JSON.parse(sessionStorage.getItem(USERINFO) || initialUserInfo)
  const [info, setInfo] = useState<UserInfo>(JSON.parse(initialUserInfo))
  const navigate = useNavigate()
  const languageIdx = Number(localStorage.getItem(LANGUAGE_IDX))
  const [created, setCreated] = useState<SampleProblemInformation[]>([])
  const [solved, setSolved] = useState<SampleProblemInformation[]>([])
  const {width, height} = useWindowSize()
  const isMobile = useMediaQuery("(max-width: 800px)")
  const margin = isMobile? "2%" : "1%"
  const divider = <Divider orientation="horizontal" sx={{borderColor: "lightgray", my: "1%"}} />
  const [level, setLevel] = useState("")
  const [open, setOpen] = useState(0)

  useEffect(() => {
    if (!userInfo.name) {
      loginWarning()
      navigate(LOGIN_PATH)
    }
    if (!name) {
      return
    }
    getUserDetail(name)
    .then(i => {
      setInfo({
        ...info,
        name: name,
        created: i.created,
        solved: i.solved,
        liked: i.liked,
        language: i.language,
        level: i.level,
        totalLike: i.totalLike,
        totalWrong: i.totalWrong,
        totalCorrect: i.totalCorrect,
      })
      const newLevel = i.level > 0? String(i.level) + menuWords.K[languageIdx] : String(Math.abs(i.level)) + menuWords.D[languageIdx]
      setLevel(newLevel)
      getRepresentativeProblem(name)
      .then(c => {
        setCreated(c)
      })
      getSolvedProblem(name)
      .then(s => {
        setSolved(s)
      })
    })
  }, [name])

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
  sx={{fontSize: "120%", color: "black", textTransform: "none", display: info.created.length > 4? "" : "none", mx: margin}} 
  onClick={() => moveToCreated()}
>
  {menuWords.seeAll[languageIdx]}
</Button>

const profile = 
<Box justifyContent="center">
  <Box display="flex" justifyContent="center" alignContent="center">
    <Typography sx={{alignContent: "center", color: "teal", fontSize: width / 20, my: 3}}>{info.name}</Typography>
    <Button size='small' onClick={() => setOpen(open + 1)}>{messageIcon}</Button>
  </Box>
  {divider}
  <Box
    display="flex" justifyContent="space-around"
  >
    {customBox(level, menuWords.level[languageIdx])}
    {customBox(String(info.created.length), menuWords.createdProblem[languageIdx])}
    {customBox(String(info.totalLike), menuWords.like[languageIdx])}
    {customBox(String(info.solved.length), menuWords.solved[languageIdx])}
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
  
    
  return (
    <Box>
      {profile}
      {divider}
      {problemLine(menuWords.createdProblem[languageIdx], created, info.created.length, true)}
      {divider}
      {problemLine(menuWords.solved[languageIdx], solved, info.solved.length, false)}
      <SendMessageForm receiver={info.name} sender={userInfo.name} open={open}/>
    </Box>
  );
}