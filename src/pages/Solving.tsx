import React, { useState } from 'react'
import { Problem } from '../problems/Problem'
import { Button } from '@mui/material'
import { ProblemsList } from '../problems/problemsList'


export function Solving() {
  const form1 = {
    problem: {
      board: ProblemsList.problem1.problem,
      color: 'b'
    },
    variations: ProblemsList.problem1.variations,
  }




  const problem = Problem(form1)
  return (
    <>
      <div>
        <Problem problem={form1.problem} variations={form1.variations}></Problem>
      </div>
    </>

  )
}
