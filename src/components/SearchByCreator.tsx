import { useState, useEffect } from 'react';
import { convertFromStringToTwoD } from '../util/functions';
import { Box, Button, TextField } from '@mui/material';
import { ProblemInfo } from '../util/types';
import SampleProblemBox from './problem/SampleProblemBox';
import { getProblemByCreator } from '../util/network';
import { menuWords } from '../util/menuWords';
import { LANGUAGE_IDX } from '../util/constants';


export default function SearchingByCreator() {
  const [creator, setCreator] = useState("");
  const [input, setInput] = useState("")
  const [problems, setProblems] = useState<ProblemInfo[]>([]);
  const languageIdx = Number(localStorage.getItem(LANGUAGE_IDX))

  function handleCreatorChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInput(e.target.value)
  }
  useEffect(() => {
    const result = getProblemByCreator(creator)
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
  }, [creator])

  return (
    <Box>
      <Box sx={{margin: 10}}>
        <TextField
          label={menuWords.creator[languageIdx]}
          value={input}
          onChange={handleCreatorChange}
          variant='standard'
        >
        </TextField>
        <Button onClick={() => setCreator(input)}>{menuWords.search[languageIdx]}</Button>
      </Box>
      {problems.length > 0? <SampleProblemBox problems={problems}></SampleProblemBox> : ""}
    </Box>
  );
}