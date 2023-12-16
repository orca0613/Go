import { useState, useEffect } from 'react';
import { convertFromStringToTwoD } from '../util/functions';
import { Box, Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { ProblemInfo } from '../util/types';
import SampleProblemBox from './problem/SampleProblemBox';
import problemStore from '../store/problemStore';
import { setProblemList } from '../redux/actions';
import { getProblemByLevel } from '../util/network';
import { menuWords } from '../util/menuWords';
import { LANGUAGE_IDX } from '../util/constants';


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
            <MenuItem value={18}>{`18${menuWords.K[languageIdx]}`}</MenuItem>
            <MenuItem value={17}>{`17${menuWords.K[languageIdx]}`}</MenuItem>
            <MenuItem value={16}>{`16${menuWords.K[languageIdx]}`}</MenuItem>
            <MenuItem value={15}>{`15${menuWords.K[languageIdx]}`}</MenuItem>
            <MenuItem value={14}>{`14${menuWords.K[languageIdx]}`}</MenuItem>
            <MenuItem value={13}>{`13${menuWords.K[languageIdx]}`}</MenuItem>
            <MenuItem value={12}>{`12${menuWords.K[languageIdx]}`}</MenuItem>
            <MenuItem value={11}>{`11${menuWords.K[languageIdx]}`}</MenuItem>
            <MenuItem value={10}>{`10${menuWords.K[languageIdx]}`}</MenuItem>
            <MenuItem value={9}>{`9${menuWords.K[languageIdx]}`}</MenuItem>
            <MenuItem value={8}>{`8${menuWords.K[languageIdx]}`}</MenuItem>
            <MenuItem value={7}>{`7${menuWords.K[languageIdx]}`}</MenuItem>
            <MenuItem value={6}>{`6${menuWords.K[languageIdx]}`}</MenuItem>
            <MenuItem value={5}>{`5${menuWords.K[languageIdx]}`}</MenuItem>
            <MenuItem value={4}>{`4${menuWords.K[languageIdx]}`}</MenuItem>
            <MenuItem value={3}>{`3${menuWords.K[languageIdx]}`}</MenuItem>
            <MenuItem value={2}>{`2${menuWords.K[languageIdx]}`}</MenuItem>
            <MenuItem value={1}>{`1${menuWords.K[languageIdx]}`}</MenuItem>
            <MenuItem value={-1}>{`1${menuWords.D[languageIdx]}`}</MenuItem>
            <MenuItem value={-2}>{`2${menuWords.D[languageIdx]}`}</MenuItem>
            <MenuItem value={-3}>{`3${menuWords.D[languageIdx]}`}</MenuItem>
            <MenuItem value={-4}>{`4${menuWords.D[languageIdx]}`}</MenuItem>
            <MenuItem value={-5}>{`5${menuWords.D[languageIdx]}`}</MenuItem>
            <MenuItem value={-6}>{`6${menuWords.D[languageIdx]}`}</MenuItem>
            <MenuItem value={-7}>{`7${menuWords.D[languageIdx]}`}</MenuItem>
            <MenuItem value={-8}>{`8${menuWords.D[languageIdx]}`}</MenuItem>
            <MenuItem value={-9}>{`9${menuWords.D[languageIdx]}`}</MenuItem>
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