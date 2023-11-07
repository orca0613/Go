import React, { useState } from 'react'
import { Problem } from '../problems/Problem'
import { Button } from '@mui/material'
import { ProblemsList } from '../problems/problemsList'
import { ProblemInfo } from '../util/types'


export function Solving() {
  const form: ProblemInfo = {
    problem: ProblemsList.problem1.problem,
    variations: ProblemsList.problem1.variations,
    creator: 'unknown',
    color: 'b',
    level: 3,
    comment: 'ryan gave me'

  }



  return (
    <>
      <div>
        <Problem problemInfo={form}></Problem>
      </div>
    </>

  )
}
