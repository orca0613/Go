import { useState, useEffect } from 'react';
import { convertFromStringToTwoD } from '../util/functions';
import { Box } from '@mui/material';
import { ProblemInfo } from '../util/types';
import SampleProblemBox from './problem/SampleProblemBox';
import { useParams } from 'react-router-dom';
import { SOLVED, TRIED } from '../util/constants';
import { getProblemByIdList } from '../network/problem';

export default function MyPageProblems() {
  const { part } = useParams()
  console.log(part)
  const [problems, setProblems] = useState<ProblemInfo[]>([]);


  useEffect(() => {
    if (part) {
      let idList = ""
      if (part === "unresolved") {
        const tried = localStorage.getItem(TRIED)?.split("&")?? []
        const solved = localStorage.getItem(SOLVED)?.split("&")?? []
        idList = tried.filter(element => !solved.includes(element)).join("&")
      } else {
        idList = localStorage.getItem(part)?? ""
      }
      console.log(part)
      const result = getProblemByIdList(idList)
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
    }
    }, [part])
    
  return (
    <Box>
      {problems.length > 0? <SampleProblemBox problems={problems}></SampleProblemBox> : ""}
    </Box>
  );
}