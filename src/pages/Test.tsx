import React from 'react'
import { Making_variations } from '../problems/making_variations'
import { ProblemsList } from '../problems/problemsList'

export function Test() {
    const quest = Making_variations({
      problem: {
        board: ProblemsList.problem4.problem,
        color: 'b',
      },
    })
  return (
    <div>
        {quest}
    </div>
  )
}

