import { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { ProblemInformation, UserInfo } from '../util/types';
import SampleProblemBox from './problem/SampleProblemBox';
import { useParams } from 'react-router-dom';
import { CREATED, LIKED, SOLVED, UNRESOLVED, USERINFO, WITHQUESTIONS, initialUserInfo } from '../util/constants';
import { getProblemByIdList } from '../network/problemInformation';

export default function MyPageProblems() {
  const { part } = useParams()
  let idList: string[] = []
  const [problems, setProblems] = useState<ProblemInformation[]>([]);

  useEffect(() => {
    const userInfo: UserInfo = JSON.parse(sessionStorage.getItem(USERINFO) || initialUserInfo)
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
    const newProblems: ProblemInformation[] = []
    result.then(r => {
      r.map(p => {
        newProblems.push(p)
      })
      newProblems.reverse()
      setProblems(newProblems)
    })
    }, [part])
    
  return (
    <Box>
      {problems.length > 0? <SampleProblemBox problems={problems}></SampleProblemBox> : ""}
    </Box>
  );
}