import { ChangeEvent, useEffect, useState } from 'react';
import { Avatar, Box, Button, Divider, Modal, TextField, Typography, useMediaQuery } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { verifyMail } from '../network/user';
import { HomeForm } from './HomeForm';
import { menuWords } from '../util/menuWords';
import { LANGUAGE_IDX, PROBLEM_INDEX, PROBLEM_INDICES, USERINFO } from '../util/constants';
import { initialUserInfo } from '../util/initialForms';
import { ProblemInformation, UserInfo } from '../util/types';
import { getUserDetail } from '../network/userDetail';
import { getRecommended, getRepresentativeProblem, getSolvedProblem, getUserPageProblem } from '../network/problemInformation';
import { useWindowSize } from 'react-use';
import FinalBoard from './board/FinalBoard';
import { sendMessage } from '../network/message';

export default function UserPage() {
  const { name } = useParams()
  const userInfo: UserInfo = JSON.parse(sessionStorage.getItem(USERINFO) || initialUserInfo)
  const [info, setInfo] = useState<UserInfo>(JSON.parse(initialUserInfo))
  const navigate = useNavigate()
  const languageIdx = Number(localStorage.getItem(LANGUAGE_IDX))
  const [created, setCreated] = useState<ProblemInformation[]>([])
  const [solved, setSolved] = useState<ProblemInformation[]>([])
  const {width, height} = useWindowSize()
  const isMobile = useMediaQuery("(max-width: 800px)")
  const margin = isMobile? "2%" : "1%"
  const divider = <Divider orientation="horizontal" sx={{borderColor: "lightgray", my: "1%"}} />
  const [level, setLevel] = useState("")
  const [messageTitle, setMessageTitle] = useState("")
  const [messageContents, setMessageContents] = useState("")
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (name) {
      const newIndices: number[] = []
      const newInfo = getUserDetail(name)
      .then(i => {
        setInfo({
          ...info,
          name: name,
          created: i.created,
          solved: i.solved,
          liked: i.liked,
          language: i.language,
          level: i.level,
          totalLike: i.totalLike
        })
        const newLevel = i.level > 0? String(i.level) + menuWords.K[languageIdx] : String(Math.abs(i.level)) + menuWords.D[languageIdx]
        setLevel(newLevel)
        const newCreated = getRepresentativeProblem(name)
        .then(c => {
          setCreated(c)
        })
        const newsolved = getSolvedProblem(name)
        .then(s => {
          setSolved(s)
        })
      })
    }
  }, [name])

  const handleContentsChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMessageContents(e.target.value)
  }
  
  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMessageTitle(e.target.value)
  }

  const messageIcon = 
  <img src="/images/message.svg" alt="message" width={width / 15} height={width / 15}/>

  const customBox = (title: string, content: any) => {
    return (
      <Box
        textAlign="center" 
        alignContent="center"
      >
        <Typography variant='h4'>{title}</Typography>
        <Typography variant='caption' color="gray">{content}</Typography>
      </Box>
    )
  }

  const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: "50%",
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  async function sendMessageAndClose() {
    const result = await sendMessage(userInfo.name, info.name, messageTitle, messageContents, "")
    if (result === true) {
      alert(menuWords.sent[languageIdx])
    }
    setOpen(false)
  }


  const sendMessageForm = 
  <Modal 
    open={open}
    onClose={() => setOpen(false)}
  >
    <Box sx={style}>
      <Box display="flex">
        <Typography mr={2} mb={2}>{menuWords.receiver[languageIdx]}: </Typography>
        <Typography color="teal">{name}</Typography>
      </Box>
      <Box>
        <TextField
          variant='standard'
          label={menuWords.title[languageIdx]}
          value={messageTitle}
          onChange={handleTitleChange}
          >
        </TextField>
      </Box>
      <Box my={3}>
        <TextField
          variant='standard'
          label={menuWords.content[languageIdx]}
          value={messageContents}
          onChange={handleContentsChange}
          >
        </TextField>
      </Box>
      <Box display="flex" justifyContent="space-around">
        <Button sx={{textTransform: "none"}} onClick={() => setOpen(false)}>{menuWords.cancel[languageIdx]}</Button>
        <Button sx={{textTransform: "none"}} onClick={sendMessageAndClose}>{menuWords.send[languageIdx]}</Button>
      </Box>
    </Box>
  </Modal>


  const profile = 
  <Box justifyContent="center">
    <Box display="flex" justifyContent="center" alignContent="center">
      <Typography sx={{alignContent: "center", color: "teal", fontSize: width / 20, my: 3}}>{info.name}</Typography>
      <Button size='small' onClick={() => setOpen(true)}>{messageIcon}</Button>
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


  function setIdexAndOpenProblem(index: number, problemIdx: number, problemList: ProblemInformation[]) {
    const newIndices: number[] = []
    problemList.map(p => {
      newIndices.push(p.problemIndex)
    })
    sessionStorage.setItem(PROBLEM_INDICES, JSON.stringify(newIndices))
    sessionStorage.setItem(PROBLEM_INDEX, String(index))
    navigate(`/problem/${problemIdx}`)
  }

  function moveToCreated() {
    navigate(`/problems/tier=0&low=-10&high=19&creator=${name}&`)
  }
  
    
  return (
    <Box>
      {profile}
      {divider}
      <Box>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography mx={margin} variant="h6">{`${menuWords.createdProblem[languageIdx]} (${info.created.length})`}</Typography>
          <Button 
            sx={{fontSize: "120%", color: "black", textTransform: "none", display: info.created.length > 4? "" : "none", mx: margin}} 
            onClick={() => moveToCreated()}
          >
            {menuWords.seeAll[languageIdx]}
          </Button>
        </Box>
        <Box sx={{display: "flex", flexWrap: "wrap", justifyContent: "space-between"}}>
          {created.map((p, idx) => {
            return (
              <Box key={idx} onClick={() => setIdexAndOpenProblem(idx, p.problemIndex, created)} m={margin}>
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
      {divider}
      <Box>
        <Typography mx={margin} variant="h6">{`${menuWords.solved[languageIdx]} (${info.solved.length})`}</Typography>
        <Box sx={{display: "flex", flexWrap: "wrap", justifyContent: "space-between"}}>
          {solved.map((p, idx) => {
            return (
              <Box key={idx} onClick={() => setIdexAndOpenProblem(idx, p.problemIndex, solved)} m={margin}>
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
      {sendMessageForm}
    </Box>
  );
}