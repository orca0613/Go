
import { Box, Divider, Typography, useMediaQuery } from '@mui/material'
import { menuWords } from '../util/menuWords'
import { LANGUAGE_IDX, PROBLEM_INDEX, PROBLEM_INDICES, USERINFO } from '../util/constants'
import { SampleProblemInformation, UserInfo } from '../util/types'
import { initialUserInfo } from '../util/initialForms'
import { useEffect, useState } from 'react'
import { useWindowSize } from 'react-use'
import { useNavigate } from 'react-router-dom'
import { LOGIN_PATH } from '../util/paths'
import FinalBoard from './board/FinalBoard'
import { getGreetings } from '../util/functions'
import { getNewest, getRecommended } from '../network/sampleProblem'

export function HomeForm() {

  const userInfo: UserInfo = JSON.parse(sessionStorage.getItem(USERINFO) || initialUserInfo)
  const username = userInfo.name
  const languageIdx = Number(localStorage.getItem(LANGUAGE_IDX))
  const [recommended, setRecommended] = useState<SampleProblemInformation[]>([])
  const [newest, setNewest] = useState<SampleProblemInformation[]>([])
  const [greetings, setGreetings] = useState("")
  const {width, height} = useWindowSize()
  const isMobile = useMediaQuery("(max-width: 800px)")
  const navigate = useNavigate()

  useEffect(() => {
    if (!username) {
      navigate(LOGIN_PATH)
    }
    const newGreetings = getGreetings(username, languageIdx)
    setGreetings(newGreetings)
    getNewest()
    .then(n => {
      setNewest(n)
    })
    getRecommended(username)
    .then(r => {
      setRecommended(r)
    })
  }, [username])

  function setIdexAndOpenProblem(index: number, problemIdx: number, problemList: SampleProblemInformation[]) {
    const newIndices: number[] = []
    problemList.map(p => {
      newIndices.push(p.problemIndex)
    })
    sessionStorage.setItem(PROBLEM_INDICES, JSON.stringify(newIndices))
    sessionStorage.setItem(PROBLEM_INDEX, String(index))
    navigate(`/problem/${problemIdx}`)
  }
  

  return (
    <Box>
      <Box>
        <Typography sx={{m: isMobile? "2%" : "1%"}} variant={isMobile? 'h6' : "h4"}>{greetings}</Typography>
        <Box sx={{display: "flex", flexWrap: "wrap", justifyContent: "space-between"}}>
          {recommended.map((r, idx) => {
            return (
              <Box key={idx} onClick={() => setIdexAndOpenProblem(idx, r.problemIndex, recommended)} m={isMobile? "2%" : "1%"}>

                <FinalBoard 
                  lines={r.initialState.length} 
                  boardWidth={isMobile? width / 2.3 : width / 4.6} 
                  board={r.initialState}
                />
              </Box>
            )
          })}
        </Box>
      </Box>
      <Box>
        <Typography sx={{m: isMobile? "2%" : "1%"}} variant={isMobile? 'h6' : "h4"}>{menuWords.newestProblem[languageIdx]}</Typography>
        <Box sx={{display: "flex", flexWrap: "wrap", justifyContent: "space-between"}}>
          {newest.map((n, idx) => {
            return (
              <Box key={idx} onClick={() => setIdexAndOpenProblem(idx, n.problemIndex, newest)} m={isMobile? "2%" : "1%"}>
                <FinalBoard 
                  lines={n.initialState.length} 
                  boardWidth={isMobile? width / 2.3 : width / 4.6} 
                  board={n.initialState}
                />
              </Box>
            )
          })}
        </Box>
      </Box>
    </Box>
  )
}
