import { Box, Typography, useMediaQuery } from "@mui/material"
import { LANGUAGE_IDX, MARGIN, PAGE, PROBLEM_INDEX, USERINFO, problemsPerPage } from "../../util/constants"
import { useNavigate } from "react-router-dom"
import { ProblemInformation, SampleProblemInformation, UserInfo } from "../../util/types"
import { useWindowSize } from "react-use"
import FinalBoard from "../board/FinalBoard"
import { menuWords } from "../../util/menuWords"
import { CheckCircleOutline, FavoriteBorder, HelpOutline } from "@mui/icons-material"
import { initialUserInfo } from "../../util/initialForms"

interface SampleProblemBoxProps {
  problems: ProblemInformation[] | SampleProblemInformation[]
  page: number
  request?: boolean
}

export default function SampleProblemBox({ problems, request, page }: SampleProblemBoxProps) {
  const userInfo: UserInfo = JSON.parse(sessionStorage.getItem(USERINFO) || initialUserInfo)
  const languageIdx = Number(localStorage.getItem(LANGUAGE_IDX))
  const navigate = useNavigate()
  const {width, height} = useWindowSize()
  const isMobile = useMediaQuery("(max-width: 700px)")

  function setIdexAndOpenProblem(index: number, problemIdx: number) {
    sessionStorage.setItem(PROBLEM_INDEX, String((page - 1) * problemsPerPage + index))
    sessionStorage.setItem(PAGE, String(page))
    navigate(`/${request? "modify" : "problem"}/${problemIdx}`)
  }

  const info = (creator: string, level: number, like: number, idx: number) => {
    const l = level > 0? level + menuWords.K[languageIdx] : Math.abs(level) + menuWords.D[languageIdx]
    return (
      <Box 
        sx={{bgcolor: "whitesmoke"}}
      >
        <Box mx={1} display="flex" justifyContent="space-between" alignContent="center">
          <Typography color="gray">{l}</Typography>
          <Typography color="gray">{<FavoriteBorder sx={{fontSize: "small"}}/>} {like}</Typography>
        </Box>
        <Box mx={1} display="flex" justifyContent="space-between" alignContent="center">
          <Typography color="gray">{creator}</Typography>
          {userInfo.solved.includes(idx)? <CheckCircleOutline color="success"/> : userInfo.tried.includes(idx)? <HelpOutline color="warning"/> : <></>}
        </Box>
      </Box>  
  
    )
  }
  return (
    <Box sx={{mt: MARGIN}}>
      <Box sx={{display: "flex", flexWrap: "wrap", justifyContent: problems.length < problemsPerPage? "" : "space-evenly"}}>
        {
          problems.map((problem, index) => {
            return (
              <Box 
                key={index}
                onClick={() => setIdexAndOpenProblem(index, problem.problemIndex)}
                m={isMobile? "2%" : "1%"}
              >
                <FinalBoard
                  lines={problem.initialState.length}
                  boardWidth={isMobile? (width - 20) / 2.3 : (width - 20) / 7}
                  board={problem.initialState}
                />
                {info(problem.creator, problem.level, problem.liked, problem.problemIndex)}
              </Box>
            )
          })
        }
      </Box>
    </Box>
  )
}