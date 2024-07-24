import { Filter, SampleProblemInformation, UserInfo } from '../../util/types'
import { ChangeEvent, useEffect, useState } from 'react'
import SampleProblemBox from './SampleProblemBox'
import {Box, Divider, FormControl, FormControlLabel, InputLabel, MenuItem, Pagination, Select, SelectChangeEvent, Stack, Switch, useMediaQuery } from '@mui/material'
import { LANGUAGE_IDX, PAGE, SORTING_IDX, USERINFO, problemsPerPage } from '../../util/constants'
import { useWindowSize } from 'react-use'
import { excludeSolvedProblems, getLanguageIdx, ownParse, resetSortingForm, setProblemIndicies, sortingProblemList } from '../../util/functions'
import { initialUserInfo, sortingMethods } from '../../util/initialForms'
import FilterBox from '../FilterBox'
import { menuWords } from '../../util/menuWords'
import { LoadingPage } from '../LoadingPage'
import { useGetSampleByFilterQuery } from '../../slices/sampleProblemApiSlice'

export default function BasicFilterProblems() {

  const initFilter = sessionStorage.getItem("initFilter") || ""

  const f = ownParse(initFilter)
  const filter: Filter = {
    tier: Number(f.tier),
    level: Number(f.level),
    creator: String(f.creator)
  }
  const userInfo: UserInfo = JSON.parse(sessionStorage.getItem(USERINFO) || initialUserInfo)
  const languageIdx = getLanguageIdx()
  const methods = sortingMethods[languageIdx]
  const {width, height} = useWindowSize()
  const isMobile = useMediaQuery("(max-width: 800px)")
  const [sortingIdx, setSortingIdx] = useState(Number(sessionStorage.getItem(SORTING_IDX)))
  const [exclude, setExclude] = useState<boolean>(sessionStorage.getItem("exclude") === "true")
  const { data: problems, isLoading: gbfLoading } = useGetSampleByFilterQuery(initFilter)
  const [unsolved, setUnsolved] = useState<SampleProblemInformation[]>(excludeSolvedProblems(problems, userInfo.solved))
  const [page, setPage] = useState(Number(sessionStorage.getItem(PAGE)))
  const divider = <Divider orientation="horizontal" sx={{borderColor: "black", my: "5%", border: "0.5px solid black"}} />
  

  useEffect(() => {
    if (problems) setProblemIndicies(problems)
  }, [problems])
  const methodBox = 
  <Box sx={{width: isMobile? width / 1.1 : width / 2.5}} display="flex" justifyContent="space-around">
    <FormControl variant="standard" sx={{width: "30%", margin: 1}}>
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
    <FormControlLabel
    control={
      <Switch
      checked={exclude}
      onChange={handleExcludeChange}
      inputProps={{ 'aria-label': 'controlled' }}
      />
    }
    label={menuWords.excluding[languageIdx]}
    labelPlacement='start'
    >
    </FormControlLabel>
  </Box>

  function sorting(e: SelectChangeEvent) {
    const n = Number(e.target.value)
    setSortingIdx(n)
    resetSortingForm(1, n)
    const sortedProblems = sortingProblemList(problems, n)
    const sortedUnsolved = sortingProblemList(unsolved, n)
    exclude? setProblemIndicies(sortedUnsolved) : setProblemIndicies(sortedProblems)
    setUnsolved(sortedUnsolved)
    setPage(1)
  }

  function handleExcludeChange(e: ChangeEvent, checked: boolean): void {
    setExclude(checked)
    const newUnsolved = excludeSolvedProblems(problems, userInfo.solved)
    setUnsolved(newUnsolved)
    checked? setProblemIndicies(newUnsolved) : setProblemIndicies(problems || [])
    setPage(1)
    sessionStorage.setItem("exclude", String(checked))
  }

  const handlePageChange = (event: ChangeEvent<unknown>, val: number) => {
    setPage(val)
    window.scrollTo({ top: isMobile? 200 : 250, behavior: "smooth" })
  }

  function getShowProblems() {
    const start = (page - 1) * problemsPerPage
    const showProblems = exclude?
    (unsolved.slice(start, Math.min(start + problemsPerPage, unsolved.length))) : problems?
    (problems.slice(start, Math.min(start + problemsPerPage, problems.length))) : []
    return showProblems
  }

  if (gbfLoading) {
    return (
      <LoadingPage></LoadingPage>
    )
  }

  return (
    <Box display="grid">
      <Box display="grid" justifyContent="center">
        <FilterBox f={filter} width={width}></FilterBox>
        {methodBox}
      </Box>
      {divider}
      <Stack spacing={2}>
        <Pagination 
        page={page}
        count={exclude? Math.ceil(unsolved.length / problemsPerPage) : Math.ceil(problems? problems.length / problemsPerPage : 0)} 
        onChange={handlePageChange}
        color="primary"
        />
      </Stack>
      <SampleProblemBox problems={getShowProblems()} page={page}></SampleProblemBox>
      <Stack spacing={2}>
        <Pagination 
        page={page}
        count={exclude? Math.ceil(unsolved.length / problemsPerPage) : Math.ceil(problems? problems.length / problemsPerPage : 0)} 
        onChange={handlePageChange}
        color="primary"
        />
      </Stack>
    </Box>
  )
}

