import { useState, useEffect } from 'react';
import { convertFromStringToTwoD } from '../util/functions';
import { Box } from '@mui/material';
import { ProblemInfo } from '../util/types';
import SampleProblemBox from './problem/SampleProblemBox';
import { getProblemById } from '../util/network';
import userStore from '../store/userStore';

export default function SolvedProblems() {
  const solved = userStore.getState().userSolved
  const stringified = solved.join("&")
  const [problems, setProblems] = useState<ProblemInfo[]>([]);


  useEffect(() => {
    const result = getProblemById(stringified)
    const newProblems: ProblemInfo[] = []
    result.then(r => {
      r.map(p => {
        const newProblem: ProblemInfo = {
          ...p,
          initialState: convertFromStringToTwoD(p.initialState)
        }
        newProblems.push(newProblem)
      })
      setProblems(newProblems)
    })
    }, [solved])

  return (
    <Box>
      {problems.length > 0? <SampleProblemBox problems={problems}></SampleProblemBox> : ""}
    </Box>
  );
}