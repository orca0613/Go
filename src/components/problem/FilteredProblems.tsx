import { Filter, ProblemInformation, UserInfo } from '../../util/types'
import { ChangeEvent, ReactNode, useEffect, useState } from 'react'
import SampleProblemBox from './SampleProblemBox'
import { getProblemByFilter } from '../../network/problemInformation'
import { Autocomplete, Box, Button, Divider, FormControl, FormControlLabel, InputLabel, MenuItem, Pagination, Select, SelectChangeEvent, Stack, Switch, TextField, useMediaQuery } from '@mui/material'
import { LANGUAGE_IDX, PAGE, PROBLEM_INDICES, SORTING_IDX, USERINFO, detailLevel, initFilter, initialUserInfo, problemsPerPage, sortingMethods, tiersList } from '../../util/constants'
import { menuWords } from '../../util/menuWords'
import { getAllCreators } from '../../network/userDetail'
import { useWindowSize } from 'react-use'
import { getRangeByTier, ownParse, ownStringify, resetSortingForm, setProblemIndicies, sortingProblemList } from '../../util/functions'
import { useNavigate, useParams } from 'react-router-dom'

export default function FilteredProblems() {

  const { params } = useParams()
  const filter = params? ownParse(params) : initFilter
  const [options, setOptions] = useState<string[]>([])
  const userInfo: UserInfo = JSON.parse(sessionStorage.getItem(USERINFO) || initialUserInfo)
  const languageIdx = Number(localStorage.getItem(LANGUAGE_IDX))
  const tiers = tiersList[languageIdx]
  const navigate = useNavigate()
  const {width, height} = useWindowSize()
  const isMobile = useMediaQuery("(max-width: 600px)")
  const [form, setForm] = useState<Filter>({
    tier: Number(filter.tier),
    low: Number(filter.low),
    high: Number(filter.high),
    creator: String(filter.creator)
  })
  const [detail, setDetail] = useState(detailLevel[form.tier])
  const [levelIdx, setLevelIdx] = useState(0)
  const [sortingIdx, setSortingIdx] = useState(Number(sessionStorage.getItem(SORTING_IDX)))
  const methods = sortingMethods[languageIdx]
  const [exclude, setExclude] = useState<boolean>(sessionStorage.getItem("exclude") === "true")
  const [problems, setProblems] = useState<ProblemInformation[]>([])
  const [solved, setSolved] = useState<ProblemInformation[]>([])
  const [unsolved, setUnsolved] = useState<ProblemInformation[]>([])
  const [showProblems, setShowProblems] = useState<ProblemInformation[]>([])
  const [page, setPage] = useState(Number(sessionStorage.getItem(PAGE)))
  const mobileIconSize = width / 15
  const IconSize = width / 50
  const searchIcon = 
  <img src="/images/search.svg" alt="pre" width={isMobile? mobileIconSize : IconSize} height={isMobile? mobileIconSize : IconSize}/>
  const divider = <Divider orientation="horizontal" sx={{borderColor: "black", my: "5%", border: "0.5px solid black"}} />


  useEffect(() => {
    if (params) {
      const result = getProblemByFilter(params)
      const newPage = Number(sessionStorage.getItem(PAGE))
      const newSolved: ProblemInformation[] = []
      const newUnsolved: ProblemInformation[] = []
      const newIndices: number[] = []
      result.then(r => {
        r.map(p => {
          if (p.correctUser.includes(userInfo.name)) {
            newSolved.push(p)
          } else {
            newUnsolved.push(p)
          }
        })
        setSortingIdx(Number(sessionStorage.getItem(SORTING_IDX)))
        const sorted: ProblemInformation[] = exclude? sortingProblemList(newUnsolved, sortingIdx) : sortingProblemList(newUnsolved.concat(newSolved), sortingIdx)
        sorted.map(s => {
          newIndices.push(s.problemIndex)
        })
        const start = (newPage - 1) * problemsPerPage
        setProblems(sorted)
        setShowProblems(sorted.slice(start, Math.min(start + problemsPerPage, sorted.length)))
        setSolved(newSolved)
        setUnsolved(newUnsolved)
        sessionStorage.setItem(PROBLEM_INDICES, JSON.stringify(newIndices))
        setPage(newPage)
      })
    }
  }, [params])

  useEffect(() => {
    const creators = getAllCreators()
    const newOptions: string[] = []
    creators.then(r => {
      r.sort()
      r.map(creator => {
        newOptions.push(creator)
      })
      setOptions(newOptions)
    })
  }, [])

  function changeFilter() {
    const p = ownStringify(form)
    sessionStorage.setItem(PAGE, "1")
    navigate(`/problems/${p}`)
  }

  function changeTier(e: SelectChangeEvent) {
    const [low, high] = getRangeByTier(Number(e.target.value))
    setForm({
      ...form,
      tier: Number(e.target.value),
      low: low,
      high: high
    })
    setDetail(detailLevel[Number(e.target.value)])
    setLevelIdx(0)
  }

  function changeLevel(e: SelectChangeEvent) {
    const level = detail[Number(e.target.value)]
    setLevelIdx(Number(e.target.value))
    if (!level) {
      const [low, high] = getRangeByTier(form.tier)
      setForm({
        ...form,
        low: low,
        high: high
      })
      return
    }
    setForm({
      ...form,
      low: level - 1,
      high: level + 1
    })
  }

  function changeCreator(newValue: string | null): void {
    const creator = !newValue? "" : newValue
    setForm({
      ...form,
      creator: creator
    })
  }

  function sorting(e: SelectChangeEvent) {
    const n = Number(e.target.value)
    setSortingIdx(n)
    resetSortingForm(1, n)
    const sorted = sortingProblemList(problems, n)
    setProblemIndicies(sorted)
    setProblems(sorted)
    const newShowProblems: ProblemInformation[] = sorted.slice(0, Math.min(problemsPerPage, sorted.length))
    setShowProblems(newShowProblems)
    setPage(1)
  }

  function handleExcludeChange(e: ChangeEvent, checked: boolean): void {
    setExclude(checked)
    const sortingOption = Number(sessionStorage.getItem(SORTING_IDX))
    const newProblems = checked? sortingProblemList(unsolved, sortingOption) : sortingProblemList(unsolved.concat(solved), sortingOption)
    setProblems(newProblems)
    setShowProblems(newProblems.slice(0, Math.min(problemsPerPage, newProblems.length)))
    setPage(1)
    sessionStorage.setItem("exclude", String(checked))
    setProblemIndicies(newProblems)

  }

  const filterBox = 
  <Box 
    sx={{border: "1px solid black", borderRadius: 2, width: isMobile? width / 1.1 : width / 2, my: "3%", bgcolor: "whitesmoke"}} 
    display="flex" 
    justifyContent="space-around">
    <FormControl variant="standard" sx={{margin: 1, minWidth: "20%"}}>
      <InputLabel>{menuWords.difficulty[languageIdx]}</InputLabel>
      <Select
        value={String(form.tier)}
        label={tiers[form.tier]}
        onChange={changeTier}
      >
        {tiers.map((t, idx) => {
          return <MenuItem key={idx} value={idx}>{t}</MenuItem>
        })}
      </Select>
    </FormControl>
    <FormControl variant="standard" sx={{margin: 1, minWidth: "20%"}}>
      <InputLabel>{menuWords.level[languageIdx]}</InputLabel>
      <Select
        value={String(levelIdx)}
        label={detail[levelIdx]}
        onChange={changeLevel}
      >
        {detail.map((t, idx) => {
          return (
            <MenuItem key={idx} value={idx}>
              {t === 0? menuWords.allLevel[languageIdx] : t > 0? `${t}${menuWords.K[languageIdx]}` : `${Math.abs(t)}${menuWords.D[languageIdx]}`}
            </MenuItem>
          ) 
        })}
      </Select>
    </FormControl>
    <Autocomplete
      sx={{margin: 1, minWidth: "20%"}}
      options={options}
      value={form.creator}
      onChange={(event, newValue) => changeCreator(newValue)}
      renderInput={(params) => (
        <TextField {...params} label={menuWords.creator[languageIdx]} variant="standard" />
      )}
    />
    <Button onClick={changeFilter}>{searchIcon}</Button>
  </Box>

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


  const handlePageChange = (event: ChangeEvent<unknown>, val: number) => {
    setPage(val)
    const newStart = (val - 1) * problemsPerPage
    const newShowProblems = problems.slice(newStart, Math.min(newStart + problemsPerPage, problems.length))
    setShowProblems(newShowProblems)
    window.scrollTo({ top: isMobile? 200 : 250, behavior: "smooth" })
  }

  return (
    <Box display="grid">
      <Box display="grid" justifyContent="center">
        {filterBox}
        {methodBox}
      </Box>
      {divider}
      <Stack spacing={2}>
        <Pagination 
        page={page}
        count={Math.ceil(problems.length / problemsPerPage)} 
        onChange={handlePageChange}
        color="primary"
        />
      </Stack>
      <SampleProblemBox problems={showProblems} page={page}></SampleProblemBox>
      <Stack spacing={2}>
        <Pagination 
        page={page}
        count={Math.ceil(problems.length / problemsPerPage)} 
        onChange={handlePageChange}
        color="primary"
        />
      </Stack>
    </Box>
  )
}

