import React, { useState } from 'react'
import { Problem } from '../problems/Problem'
import { testProblem, testVariations } from '../problems/problem1'
import { problem2, variations2 } from '../problems/problems2'
import { Button } from '@mui/material'

export function Solving() {
  const form1 = {
    problem: problem2,
    variations: variations2
  }

  const form2 = {
    problem: testProblem,
    variations: testVariations
  }

  const [form, setForm] = useState(form1)

  const problem = Problem(form)
  return (
    <>
      <div>
        {problem}
      </div>
      {/* <Button onClick={() => setForm(form1)}>problem1</Button>
      <Button onClick={() => setForm(form2)}>problem2</Button> */}
    </>

  )
}
