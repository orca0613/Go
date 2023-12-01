import { ProblemInfo } from '../../util/types'
import FinalBoard from '../board/FinalBoard'
import { sampleBoardSize } from '../../util/constants'

interface SampleProblemProps {
  sampleProblem: ProblemInfo
}

const SampleProblem = ({ sampleProblem }: SampleProblemProps ) => {

  return (
    <FinalBoard 
    lines={sampleProblem.initialState.length}
    board={sampleProblem.initialState}
    boardWidth={sampleBoardSize}
    ></FinalBoard>
  )
}

export default SampleProblem