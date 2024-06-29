import { Filter, SampleProblemInformation, UserInfo } from '../../util/types'
import { ChangeEvent, useEffect, useState } from 'react'
import SampleProblemBox from './SampleProblemBox'
import {Box, Divider, FormControl, FormControlLabel, InputLabel, MenuItem, Pagination, Select, SelectChangeEvent, Stack, Switch, useMediaQuery } from '@mui/material'
import { LANGUAGE_IDX, PAGE, SORTING_IDX, USERINFO, problemsPerPage } from '../../util/constants'
import { useWindowSize } from 'react-use'
import { ExcludeSolvedProblems, loginWarning, ownParse, resetSortingForm, setProblemIndicies, sortingProblemList } from '../../util/functions'
import { useNavigate, useParams } from 'react-router-dom'
import { initFilter, initialUserInfo, sortingMethods } from '../../util/initialForms'
import FilterBox from '../FilterBox'
import { menuWords } from '../../util/menuWords'
import { getSampleProblemByFilter } from '../../network/sampleProblem'
import { LOGIN_PATH } from '../../util/paths'
import { LoadingPage } from '../LoadingPage'

export default function FilteredProblems() {

  const { params } = useParams()
  const f = params? ownParse(params) : initFilter
  const filter: Filter = {
    tier: Number(f.tier),
    level: Number(f.level),
    creator: String(f.creator)
  }
  const userInfo: UserInfo = JSON.parse(sessionStorage.getItem(USERINFO) || initialUserInfo)
  const languageIdx = Number(localStorage.getItem(LANGUAGE_IDX))
  const methods = sortingMethods[languageIdx]
  const {width, height} = useWindowSize()
  const isMobile = useMediaQuery("(max-width: 800px)")
  const [sortingIdx, setSortingIdx] = useState(Number(sessionStorage.getItem(SORTING_IDX)))
  const [exclude, setExclude] = useState<boolean>(sessionStorage.getItem("exclude") === "true")
  const [problems, setProblems] = useState<SampleProblemInformation[]>([])
  const [unsolved, setUnsolved] = useState<SampleProblemInformation[]>([])
  const [page, setPage] = useState(Number(sessionStorage.getItem(PAGE)))
  const [loading, setLoading] = useState(true)
  const divider = <Divider orientation="horizontal" sx={{borderColor: "black", my: "5%", border: "0.5px solid black"}} />
  const navigate = useNavigate()

  useEffect(() => {
    if (!userInfo.name) {
      loginWarning()
      navigate(LOGIN_PATH)
    }
    if (!params) {
      return
    }
    const result = getSampleProblemByFilter(params)
    const newPage = Number(sessionStorage.getItem(PAGE))
    result.then(r => {
      setSortingIdx(Number(sessionStorage.getItem(SORTING_IDX)))
      const newUnsolved = ExcludeSolvedProblems(r, userInfo.solved)
      const sortedUnsolved: SampleProblemInformation[] = sortingProblemList(newUnsolved, sortingIdx)
      const sortedProblems: SampleProblemInformation[] = sortingProblemList(r, sortingIdx)
      exclude? setProblemIndicies(sortedUnsolved) : setProblemIndicies(sortedProblems)
      setProblems(sortedProblems)
      setUnsolved(newUnsolved)
      setPage(newPage)
      setLoading(false)
    })
  }, [params])

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
    setProblems(sortedProblems)
    setUnsolved(sortedUnsolved)
    setPage(1)
  }

  function handleExcludeChange(e: ChangeEvent, checked: boolean): void {
    setExclude(checked)
    checked? setProblemIndicies(unsolved) : setProblemIndicies(problems)
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
    (unsolved.slice(start, Math.min(start + problemsPerPage, unsolved.length))) : 
    (problems.slice(start, Math.min(start + problemsPerPage, problems.length)))
    return showProblems
  }

  if (loading) {
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
        count={exclude? Math.ceil(unsolved.length / problemsPerPage) : Math.ceil(problems.length / problemsPerPage)} 
        onChange={handlePageChange}
        color="primary"
        />
      </Stack>
      <SampleProblemBox problems={getShowProblems()} page={page}></SampleProblemBox>
      <Stack spacing={2}>
        <Pagination 
        page={page}
        count={exclude? Math.ceil(unsolved.length / problemsPerPage) : Math.ceil(problems.length / problemsPerPage)} 
        onChange={handlePageChange}
        color="primary"
        />
      </Stack>
    </Box>
  )
}

