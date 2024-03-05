import { useState, useEffect } from 'react';
import { convertFromStringToTwoD } from '../util/functions';
import { Box } from '@mui/material';
import { ProblemInfo, UserInfo } from '../util/types';
import SampleProblemBox from './problem/SampleProblemBox';
import { getProblemByIdList } from '../network/problem';
import { useParams } from 'react-router-dom';
import { CREATED, LIKED, SOLVED, UNRESOLVED, USERINFO, WITHQUESTIONS, initialUserInfo } from '../util/constants';

export default function MyPageProblems() {
  const { part } = useParams()
  let idList: string[] = []
  const [problems, setProblems] = useState<ProblemInfo[]>([]);

  useEffect(() => {
    const userInfo: UserInfo = JSON.parse(localStorage.getItem(USERINFO) || initialUserInfo)
    switch (part) {
      case (CREATED):
        idList = userInfo.created
        break
      case (SOLVED):
        idList = userInfo.solved
        break
      case (UNRESOLVED):
        idList = userInfo.tried.filter(element => !userInfo.solved.includes(element))
        break
      case (LIKED):
        idList = userInfo.liked
        break
      case (WITHQUESTIONS):
        idList = userInfo.withQuestions
        break
      default:
        break
    }
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
    }, [part])
    
  return (
    <Box>
      {problems.length > 0? <SampleProblemBox problems={problems}></SampleProblemBox> : ""}
    </Box>
  );
}