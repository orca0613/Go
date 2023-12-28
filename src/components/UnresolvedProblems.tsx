import { useState, useEffect } from 'react';
import { convertFromStringToTwoD } from '../util/functions';
import { Box } from '@mui/material';
import { ProblemInfo } from '../util/types';
import SampleProblemBox from './problem/SampleProblemBox';
import { getProblemById } from '../util/network';
import { SOLVED, TRIED } from '../util/constants';

export default function UnresolvedProblems() {
  const tried = localStorage.getItem(TRIED)?.split("&")?? []
  const solved = localStorage.getItem(SOLVED)?.split("&")?? []
  const unresolved = tried.filter(element => !solved.includes(element)).join("&")

  const [problems, setProblems] = useState<ProblemInfo[]>([]);


  useEffect(() => {
    const result = getProblemById(unresolved)
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
    }, [unresolved])
  return (
    <Box>
      {problems.length > 0? <SampleProblemBox problems={problems}></SampleProblemBox> : ""}
    </Box>
  );
}