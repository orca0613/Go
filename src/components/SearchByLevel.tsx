import { useState, useEffect } from 'react';
import { convertFromStringToTwoD, getProblemByLevel } from '../util/functions';
import { Box, Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField, Typography } from '@mui/material';
import { ProblemInfo } from '../util/types';
import SampleProblemBox from './problem/SampleProblemBox';
import problemStore from '../store/problemStore';
import { setProblemList } from '../redux/actions';


export default function SearchingByLevel() {
  const [level, setLevel] = useState(0);
  const [input, setInput] = useState("")
  const [problems, setProblems] = useState<ProblemInfo[]>([]);

  function handleInputChange(e: SelectChangeEvent) {
    setInput(e.target.value)
  }
  useEffect(() => {
    const result = getProblemByLevel(level)
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
    }, [level])

  return (
    <Box>
      <Box sx={{margin: 10}}>
      <FormControl variant="standard" sx={{width: 150}}>
          <InputLabel id="level-select-label">level</InputLabel>
          <Select
            labelId="level-select-label"
            id="level-select"
            value={String(input)}
            label="level"
            onChange={handleInputChange}
          >
            <MenuItem value={18}>18k</MenuItem>
            <MenuItem value={17}>17k</MenuItem>
            <MenuItem value={16}>16k</MenuItem>
            <MenuItem value={15}>15k</MenuItem>
            <MenuItem value={14}>14k</MenuItem>
            <MenuItem value={13}>13k</MenuItem>
            <MenuItem value={12}>12k</MenuItem>
            <MenuItem value={11}>11k</MenuItem>
            <MenuItem value={10}>10k</MenuItem>
            <MenuItem value={9}>9k</MenuItem>
            <MenuItem value={8}>8k</MenuItem>
            <MenuItem value={7}>7k</MenuItem>
            <MenuItem value={6}>6k</MenuItem>
            <MenuItem value={5}>5k</MenuItem>
            <MenuItem value={4}>4k</MenuItem>
            <MenuItem value={3}>3k</MenuItem>
            <MenuItem value={2}>2k</MenuItem>
            <MenuItem value={1}>1k</MenuItem>
            <MenuItem value={-1}>1d</MenuItem>
            <MenuItem value={-2}>2d</MenuItem>
            <MenuItem value={-3}>3d</MenuItem>
            <MenuItem value={-4}>4d</MenuItem>
            <MenuItem value={-5}>5d</MenuItem>
            <MenuItem value={-6}>6d</MenuItem>
            <MenuItem value={-7}>7d</MenuItem>
            <MenuItem value={-8}>8d</MenuItem>
            <MenuItem value={-9}>9d</MenuItem>
          </Select>
        </FormControl>
        <Button onClick={() => setLevel(Number(input))}>search</Button>
      </Box>
      <Box>
        {problems.length > 0? <SampleProblemBox></SampleProblemBox> : ""}
      </Box>
    </Box>
  );
}