import { MakingProblem } from '../problems/MakingProblem'

export function TestMakingProblem() {
  const lines = 10

  return (
    <div>
      <MakingProblem boardSize={lines}></MakingProblem>
    </div>
  )
}

