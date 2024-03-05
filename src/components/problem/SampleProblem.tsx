import { ProblemInfo } from '../../util/types'
import FinalBoard from '../board/FinalBoard'
import { sampleBoardSize } from '../../util/constants'
import { Box, useMediaQuery } from '@mui/material'
import _ from 'lodash'
import { useWindowSize } from 'react-use'

interface SampleProblemProps {
  sampleProblem: ProblemInfo
}

const SampleProblem = ({ sampleProblem }: SampleProblemProps ) => {
  const isMobile = useMediaQuery("(max-width: 460px)")
  const {width, height} = useWindowSize()
  return (
    <Box display="flex" sx={{width:isMobile? width / 2.1 : 220, height: isMobile? width / 2.1 : 220}}>
      <FinalBoard 
      lines={sampleProblem.initialState.length}
      board={sampleProblem.initialState}
      boardWidth={isMobile? width / 2.2 : sampleBoardSize}
      />
    </Box>
  )
}

export default SampleProblem