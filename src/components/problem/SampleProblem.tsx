import { ProblemInfo } from '../../util/types'
import FinalBoard from '../board/FinalBoard'
import { sampleBoardSize } from '../../util/constants'
import { Box } from '@mui/material'
import _ from 'lodash'

interface SampleProblemProps {
  sampleProblem: ProblemInfo
}

const SampleProblem = ({ sampleProblem }: SampleProblemProps ) => {
  return (
    <Box display="flex" sx={{width:150, height: 150}}>
      <FinalBoard 
      lines={sampleProblem.initialState.length}
      board={sampleProblem.initialState}
      boardWidth={sampleBoardSize}
      />
    </Box>
  )
}

export default SampleProblem