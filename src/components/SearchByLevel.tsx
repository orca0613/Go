import { useState, useEffect } from 'react';
import { Box, Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { ProblemInformation } from '../util/types';
import SampleProblemBox from './problem/SampleProblemBox';
import { menuWords } from '../util/menuWords';
import { LANGUAGE_IDX, levelArray } from '../util/constants';
import { getProblemByLevel } from '../network/problemInformation';

export default function SearchingByLevel() {
  const [level, setLevel] = useState(0);
  const [input, setInput] = useState("")
  const [problems, setProblems] = useState<ProblemInformation[]>([]);
  const languageIdx = Number(localStorage.getItem(LANGUAGE_IDX))

  function handleInputChange(e: SelectChangeEvent) {
    setInput(e.target.value)
  }
  useEffect(() => {
    const result = getProblemByLevel(level)
    const newProblems: ProblemInformation[] = []
    result.then(r => {
      r.map(p => {
        newProblems.push(p)
      })
      newProblems.reverse()
      setProblems(newProblems)
    })
    }, [level])

  return (
    <Box>
      <Box sx={{margin: 10}}>
      <FormControl variant="standard" sx={{width: 200}}>
          <InputLabel id="level-select-label">{menuWords.level[languageIdx]}</InputLabel>
          <Select
            labelId="level-select-label"
            id="level-select"
            value={String(input)}
            label={menuWords.level[languageIdx]}
            onChange={handleInputChange}
          >
            {levelArray.map(level => {
              return <MenuItem key={level} value={level}>{Math.abs(level)}{level > 0? menuWords.K[languageIdx] : menuWords.D[languageIdx]}</MenuItem>
            })}
          </Select>
        </FormControl>
        <Button onClick={() => setLevel(Number(input))}>{menuWords.search[languageIdx]}</Button>
      </Box>
      <Box>
        {problems.length > 0? <SampleProblemBox problems={problems}></SampleProblemBox> : ""}
      </Box>
    </Box>
  );
}