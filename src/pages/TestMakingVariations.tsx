import { MakingVariations } from "../problems/MakingVariations"
import { ProblemsList } from "../problems/problemsList"


export function TestMakingVariations() {
    const quest = MakingVariations({
      problemInfo: {
        problem: ProblemsList.problem1.problem,
        variations: ProblemsList.problem1.variations,
        color: 'b',
        level:1,
        creator: 'nova',
        comment: 'test comment'
      },
      problemId: 'any'
      })
  return (
    <div>
        {quest}
    </div>
  )
  }
