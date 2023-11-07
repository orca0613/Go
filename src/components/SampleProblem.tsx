import { Board, ProblemInfo } from '../util/types'
import TestProblem from './TestProblem'
import { sampleBoardSize } from '../util/constants'
import { useNavigate } from 'react-router-dom'

interface SampleProblemProps {
  sampleProblem: ProblemInfo
}

const SampleProblem = ({ sampleProblem }: SampleProblemProps ) => {
  const navigate = useNavigate()
  const movePage = (address: string) => {
    navigate(address)
}

  return (
    <div>
      <TestProblem
        lines={sampleProblem.problem.length}
        board={sampleProblem.problem}
        boardWidth={sampleBoardSize}
        onClick={() => movePage('problem')}
      />
      <div>
        <p>{sampleProblem.creator}</p>
        <p>{sampleProblem.comment}</p>
        <p>level: {sampleProblem.level}</p>

      </div>
    </div>
  )
}

export default SampleProblem