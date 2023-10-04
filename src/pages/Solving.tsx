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


  const [form, setForm] = useState(form1)

  const problem = Problem(form)
  return (
    <>
      <div>
        {problem}
      </div>
      {/* <Button onClick={() => setForm(form1)}>problem1</Button>
      <Button onClick={() => setForm(form2)}>problem2</Button>
      <Button onClick={() => setForm(form3)}>problem3</Button>
      <Button onClick={() => setForm(form4)}>problem4</Button> */}

    </>

  )
}
