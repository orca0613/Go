import { useState, useEffect, ChangeEvent } from 'react';
import { Box, FormControl, InputLabel, MenuItem, Pagination, Select, SelectChangeEvent, Stack } from '@mui/material';
import { SampleProblemInformation, UserInfo } from '../../util/types';
import SampleProblemBox from './SampleProblemBox';
import { useParams } from 'react-router-dom';
import { CREATED, LANGUAGE_IDX, LIKED, PAGE, SOLVED, SORTING_IDX, UNRESOLVED, USERINFO, WITHQUESTIONS, problemsPerPage } from '../../util/constants';
import { menuWords } from '../../util/menuWords';
import { setProblemIndicies, sortingProblemList } from '../../util/functions';
import { initialUserInfo, sortingMethods } from '../../util/initialForms';
import { getSampleProblemByIndexList } from '../../network/sampleProblem';

export default function MyPageProblems() {
  const { part } = useParams()
  let idxList: number[] = []
  const [problems, setProblems] = useState<SampleProblemInformation[]>([]);
  const languageIdx = Number(localStorage.getItem(LANGUAGE_IDX))
  const [sortingIdx, setSortingIdx] = useState(Number(sessionStorage.getItem(SORTING_IDX)))
  const methods = sortingMethods[languageIdx]
  const [page, setPage] = useState(Number(sessionStorage.getItem(PAGE)))

  function sorting(e: SelectChangeEvent) {
    const p = Number(e.target.value)
    setSortingIdx(p)
    sessionStorage.setItem(SORTING_IDX, String(p))
    const sorted = sortingProblemList(problems, p)
    setProblems(sorted)
    setProblemIndicies(sorted)
    setPage(1)
  }

  useEffect(() => {
    const userInfo: UserInfo = JSON.parse(sessionStorage.getItem(USERINFO) || initialUserInfo)
    const newPage = Number(sessionStorage.getItem(PAGE))
    switch (part) {
      case (CREATED):
        idxList = userInfo.created
        break
      case (SOLVED):
        idxList = userInfo.solved
        break
      case (UNRESOLVED):
        idxList = userInfo.tried.filter(element => !userInfo.solved.includes(element))
        break
      case (LIKED):
        idxList = userInfo.liked
        break
      case (WITHQUESTIONS):
        idxList = userInfo.withQuestions
        break
      default:
        break
    }
    const result = getSampleProblemByIndexList(idxList)
    result.then(r => {
      const sorted = sortingProblemList(r, sortingIdx)
      setProblemIndicies(sorted)
      setProblems(sorted)
      setPage(newPage)
    })
    }, [part])
    
  function handlePageChange(event: ChangeEvent<unknown>, val: number): void {
    setPage(val)
    window.scrollTo({ top: 0, behavior: "auto" })
  }

  function getShowProblems() {
    const start = (page - 1) * problemsPerPage
    const showProblems = problems.slice(start, Math.min(start + problemsPerPage, problems.length))
    return showProblems
  }

  return (
    <Box textAlign="center">
      <FormControl variant="standard" sx={{width: "250px"}}>
        <InputLabel id="sorting-method">{menuWords.sortingMethod[languageIdx]}</InputLabel>
        <Select
          labelId="sorting-label"
          id="sorting-select"
          value={String(sortingIdx)}
          label={menuWords.sortingMethod[languageIdx]}
          onChange={sorting}
        >
          {methods.map((method, idx) => {
            return <MenuItem key={idx} value={idx}>{method}</MenuItem>
          })}
        </Select>
      </FormControl>
      <SampleProblemBox problems={getShowProblems()} page={page} request={part === WITHQUESTIONS}></SampleProblemBox>
      <Stack spacing={2}>
        <Pagination 
        page={page}
        count={Math.ceil(problems.length / problemsPerPage)} 
        onChange={handlePageChange}
        color="primary"
        />
      </Stack>
    </Box>
  );
}