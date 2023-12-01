import { useState, useEffect } from 'react';
import { convertFromStringToTwoD, getProblemByCreator } from '../util/functions';
import { Box, Button, TextField } from '@mui/material';
import { ProblemInfo } from '../util/types';
import SampleProblemBox from './problem/SampleProblemBox';
import problemStore from '../store/problemStore';
import { setProblemList } from '../redux/actions';


export default function SearchingByCreator() {
  const [creator, setCreator] = useState("");
  const [input, setInput] = useState("")
  const [problems, setProblems] = useState<ProblemInfo[]>([]);

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
      problemStore.dispatch(setProblemList(newProblems))
    })
  }, [creator])

  return (
    <Box>
      <Box sx={{margin: 10}}>
        <TextField
          label="creator"
          value={input}
          onChange={handleCreatorChange}
          variant='standard'
        >
        </TextField>
        <Button onClick={() => setCreator(input)}>search</Button>
      </Box>
      {problems.length > 0? <SampleProblemBox></SampleProblemBox> : ""}
    </Box>
  );
}