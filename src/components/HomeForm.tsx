
import { Box, Typography, useMediaQuery } from '@mui/material'
import { menuWords } from '../util/menuWords'
import { USERINFO } from '../util/constants'
import { SampleProblemInformation, UserInfo } from '../util/types/types'
import { initialUserInfo } from '../util/initialForms'
import { useEffect, useState } from 'react'
import { useWindowSize } from 'react-use'
import { useNavigate } from 'react-router-dom'
import { LOGIN_PATH } from '../util/paths'
import FinalBoard from './board/FinalBoard'
import { getGreetings, getLanguageIdx, setProblemIndicies } from '../util/functions'
import { LoadingPage } from './LoadingPage'
import { useGetNewestQuery, useGetRecommendedQuery } from '../slices/sampleProblemApiSlice'

export function HomeForm() {

  const userInfo: UserInfo = JSON.parse(sessionStorage.getItem(USERINFO) || initialUserInfo)
  const username = userInfo.name
  const languageIdx = getLanguageIdx()
  const [greetings, setGreetings] = useState("")
  const {width, height} = useWindowSize()
  const isMobile = useMediaQuery("(max-width: 800px)")
  const navigate = useNavigate()
  const { data: recommended, isLoading: grLoading } = useGetRecommendedQuery(username)
  const { data: newest, isLoading: gnLoading } = useGetNewestQuery()

  useEffect(() => {
    if (!username) {
      navigate(LOGIN_PATH)
    }
    const newGreetings = getGreetings(username, languageIdx)
    setGreetings(newGreetings)
    // useGetRecommendedQuery(username)
  }, [username])

  function setIdexAndOpenProblem(index: number, problemIdx: number, problemList: SampleProblemInformation[]) {
    setProblemIndicies(problemList, index)
    navigate(`/problem/${problemIdx}`)
  }
  
  if (grLoading || gnLoading) {
    return (
      <LoadingPage></LoadingPage>
    )
  }

  return (
    <Box>
      <Box>
        <Typography sx={{m: isMobile? "2%" : "1%"}} variant={isMobile? 'h6' : "h4"}>{greetings}</Typography>
        <Box sx={{display: "flex", flexWrap: "wrap", justifyContent: "space-between"}}>
          {recommended? recommended.map((r, idx) => {
            return (
              <Box key={idx} onClick={() => setIdexAndOpenProblem(idx, r.problemIndex, recommended)} m={isMobile? "2%" : "1%"}>

                <FinalBoard 
                  lines={r.initialState.length} 
                  boardWidth={isMobile? width / 2.3 : width / 4.6} 
                  board={r.initialState}
                />
              </Box>
            )
          }) : <></>}
        </Box>
      </Box>
      <Box>
        <Typography sx={{m: isMobile? "2%" : "1%"}} variant={isMobile? 'h6' : "h4"}>{menuWords.newestProblem[languageIdx]}</Typography>
        <Box sx={{display: "flex", flexWrap: "wrap", justifyContent: "space-between"}}>
          {newest? newest.map((n, idx) => {
            return (
              <Box key={idx} onClick={() => setIdexAndOpenProblem(idx, n.problemIndex, newest)} m={isMobile? "2%" : "1%"}>
                <FinalBoard 
                  lines={n.initialState.length} 
                  boardWidth={isMobile? width / 2.3 : width / 4.6} 
                  board={n.initialState}
                />
              </Box>
            )
          }) : <></>}
        </Box>
      </Box>
    </Box>
  )
}
