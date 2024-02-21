// Import necessary dependencies
import React, { useEffect, useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { Box, Button } from '@mui/material';
import { ProblemInfo } from '../util/types';
import { convertFromStringToTwoD } from '../util/functions';
import SampleProblemBox from './problem/SampleProblemBox';
import { menuWords } from '../util/menuWords';
import { LANGUAGE_IDX } from '../util/constants';
import { getProblemByCreator } from '../network/problem';
import { getAllCreators } from '../network/userDetail';

// Define your data structure (replace this with your own data)
interface Option {
  label: string;
  value: string;
}

export default function SearchingByCreator() {
  // Sample data
  const [options, setOptions] = useState<Option[]>([])

  // State to manage the selected value
  const [selectedValue, setSelectedValue] = useState<Option | null>(null);
  const [creator, setCreator] = useState("")
  const [problems, setProblems] = useState<ProblemInfo[]>([])
  const languageIdx = Number(localStorage.getItem(LANGUAGE_IDX))

  useEffect(() => {
    if (creator) {
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
    }
  }, [creator])

  function changeCreator() {
    if (!selectedValue) {
      return
    }
    setCreator(selectedValue.value)
  }

  useEffect(() => {
    const creators = getAllCreators()
    const newOptions: Option[] = []
    creators.then(r => {
      r.sort()
      r.map(creator => {
        newOptions.push({
          value: creator,
          label: creator
        })
      })
      setOptions(newOptions)
    })
  }, [])

  return (
    <Box>
      <Box display="flex" margin={10} sx={{width: 265}}>
        {/* Autocomplete component */}
        <Autocomplete
        sx={{width: 300}}
          options={options}
          getOptionLabel={(option) => option.label}
          value={selectedValue}
          onChange={(event, newValue) => setSelectedValue(newValue)}
          renderInput={(params) => (
            <TextField {...params} label={menuWords.creator[languageIdx]} variant="standard" />
          )}
        />
        <Button onClick={changeCreator}>{menuWords.search[languageIdx]}</Button>
      </Box>
      <Box>
        {problems.length > 0? <SampleProblemBox problems={problems}></SampleProblemBox> : ""}
      </Box>
    </Box>
  );
};