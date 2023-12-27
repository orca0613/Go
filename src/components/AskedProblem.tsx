import { useState, useEffect } from 'react';
import { convertFromStringToTwoD } from '../util/functions';
import { Box } from '@mui/material';
import { ProblemInfo } from '../util/types';
import SampleProblemBox from './problem/SampleProblemBox';
import { getProblemById } from '../util/network';
import { ASKED } from '../util/constants';

export default function AskedProblems() {
  const asked = localStorage.getItem(ASKED)?? ""
  const [problems, setProblems] = useState<ProblemInfo[]>([]);


  useEffect(() => {
    const result = getProblemById(asked)
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
    }, [asked])
    
  return (
    <Box>
      {problems.length > 0? <SampleProblemBox problems={problems}></SampleProblemBox> : ""}
    </Box>
  );
}