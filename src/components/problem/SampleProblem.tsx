import { Board } from '../../util/types'
import FinalBoard from '../board/FinalBoard'
import { Box } from '@mui/material'
import _ from 'lodash'

interface SampleProblemProps {
  problem: Board
  width: number
  boxWidth: number
}

const SampleProblem = ({ problem, width, boxWidth }: SampleProblemProps ) => {
  return (
    <Box display="flex" sx={{width:boxWidth, height: boxWidth, justifyContent: "center"}}>
      <FinalBoard 
      lines={problem.length}
      board={problem}
      boardWidth={width}
      />
    </Box>
  )
}

export default SampleProblem