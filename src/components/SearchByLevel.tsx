import { useState, useEffect } from 'react';
import { convertFromStringToTwoD } from '../util/functions';
import { Box, Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { ProblemInfo } from '../util/types';
import SampleProblemBox from './problem/SampleProblemBox';
import { menuWords } from '../util/menuWords';
import { LANGUAGE_IDX, levelArray } from '../util/constants';
import { getProblemByLevel } from '../network/problem';


export default function SearchingByLevel() {
  const [level, setLevel] = useState(0);
  const [input, setInput] = useState("")
  const [problems, setProblems] = useState<ProblemInfo[]>([]);
  const languageIdx = Number(localStorage.getItem(LANGUAGE_IDX))

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
              if (level < 0) {
                return <MenuItem value={level}>{`${Math.abs(level)}${menuWords.D[languageIdx]}`}</MenuItem>
              } else if (level > 0) {
                return <MenuItem value={level}>{`${level}${menuWords.K[languageIdx]}`}</MenuItem>
              } else {
                return
              }
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