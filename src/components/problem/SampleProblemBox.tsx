import { Box, Pagination, Stack, useMediaQuery } from "@mui/material"
import { LANGUAGE_IDX, MARGIN, USERINFO, initialUserInfo } from "../../util/constants"
import SampleProblem from "./SampleProblem"
import { useNavigate } from "react-router-dom"
import problemStore from "../../redux/problemStore"
import { setProblemIndex, setProblemList } from "../../redux/actions"
import { ProblemInformation, UserInfo } from "../../util/types"
import { ChangeEvent, useEffect, useState } from "react"
import { menuWords } from "../../util/menuWords"
import { useWindowSize } from "react-use"

interface SampleProblemBoxProps {
  problems: ProblemInformation[]
}

export default function SampleProblemBox({ problems }: SampleProblemBoxProps) {
  const userInfo: UserInfo = JSON.parse(sessionStorage.getItem(USERINFO) || initialUserInfo)
  const navigate = useNavigate()
  const languageIdx = Number(localStorage.getItem(LANGUAGE_IDX))
  const num = 30
  const [start, setStart] = useState(0)
  const {width, height} = useWindowSize()
  const isMobile = useMediaQuery("(max-width: 460px)")
  const isTablet = useMediaQuery("(min-width: 461px) and (max-width: 680px)")
	const movePage = (address: string) => {
		navigate(address)
  }

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "auto" })
  }

  function setIdexAndOpenProblem(index: number, problemId: string) {
    if (userInfo.point <= 0 && !userInfo.tried.includes(problemId)) {
      userInfo.name.length > 0? alert(menuWords.pointWarning[languageIdx]) : alert(menuWords.loginWarning[languageIdx])
      return
    } else {
      problemStore.dispatch(setProblemIndex(start + index))
      movePage(`/problem/${problemId}`)
    }
  }

  function handleChange(event:ChangeEvent<unknown>, val: number) {
    setStart(num * (val - 1))
    scrollToTop()
  }

  useEffect(() => {
    setStart(0)
  }, [problems])

  
  problemStore.dispatch(setProblemList(problems))
  


  return (
    <Box sx={{mt: MARGIN}}>
      <Box sx={{display: "flex", flexWrap: "wrap"}}>
        {
          problems.slice(start, Math.min(start + num, problems.length)).map((problem, index) => {
            return (
              <Box 
              key={index}
              onClick={() => setIdexAndOpenProblem(index, problem.problemId)}>
                <SampleProblem 
                problem={problem.initialState} 
                boxWidth={isMobile? (width - 20) / 2 : isTablet? (width - 20) / 3 : (width - 20) / 5} 
                width={isMobile? (width - 20) / 2.2 : isTablet? (width - 20) / 3.3 : (width - 20) / 5.5}
                key={index}></SampleProblem>
              </Box>
            )
          })
        }
      </Box>
      <Stack spacing={2}>
        <Pagination 
        count={Math.ceil(problems.length / num)} 
        onChange={handleChange}
        color="primary"
        />
      </Stack>
    </Box>
  )
}