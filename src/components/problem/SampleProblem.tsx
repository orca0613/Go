import { LANGUAGE_IDX, USERINFO, initialUserInfo, mobileFontSize } from '../../util/constants'
import { menuWords } from '../../util/menuWords'
import { ProblemInformation, UserInfo } from '../../util/types'
import FinalBoard from '../board/FinalBoard'
import { Box, Typography } from '@mui/material'
import _ from 'lodash'

interface SampleProblemProps {
  problem: ProblemInformation
  boardWidth: number
  boxWidth: number
}

const SampleProblem = ({ problem, boardWidth, boxWidth }: SampleProblemProps ) => {
  const languageIdx = Number(localStorage.getItem(LANGUAGE_IDX))
  const userInfo: UserInfo = JSON.parse(sessionStorage.getItem(USERINFO) || initialUserInfo)
  const c = problem.correctUser.length, w = problem.wrong
  
  const informations = 
  <Box display="grid" mb={3}>
    <Box display="flex" justifyContent="space-evenly">
      <Typography sx={{fontSize: mobileFontSize}}>{`${Math.abs(problem.level)}${problem.level > 0? menuWords.K[languageIdx] : menuWords.D[languageIdx]}`}</Typography>
      <Typography sx={{fontSize: mobileFontSize}}>{" / "}</Typography>
      <Typography sx={{fontSize: mobileFontSize}}>{problem.creator}</Typography>
    </Box>
    <Box display="flex" justifyContent="space-evenly">
      <Typography sx={{fontSize: mobileFontSize}}>{`${menuWords.correctRate[languageIdx]}: ${c + w > 0? Math.round((c / (c + w)) * 100) : 0}%`}</Typography>
      <Typography sx={{display: problem.correctUser.includes(userInfo.name)? "" : "none", color: "green", fontSize: "100%"}}>*</Typography>
    </Box>
  </Box>

  return (
    <Box display="grid" sx={{width:boxWidth, height: boxWidth, justifyContent: "center"}}>
      <FinalBoard 
      lines={problem.initialState.length}
      board={problem.initialState}
      boardWidth={boardWidth}
      />
      {/* {informations} */}
    </Box>
  )
}

export default SampleProblem