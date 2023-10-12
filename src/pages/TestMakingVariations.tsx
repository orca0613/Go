import { MakingVariations } from "../problems/MakingVariations"
import { ProblemsList } from "../problems/problemsList"


export function TestMakingVariations() {
    const quest = MakingVariations({
      problem: {
        board: ProblemsList.problem3.problem,
        color: 'b',
      },
    })
  return (
    <div>
        {quest}
    </div>
  )
  }