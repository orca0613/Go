import { useState, useEffect, ChangeEvent } from 'react';
import { Box, Divider, FormControl, InputLabel, MenuItem, Pagination, Select, SelectChangeEvent, Stack, Typography } from '@mui/material';
import { SampleProblemInformation, UserInfo } from '../../util/types';
import SampleProblemBox from './SampleProblemBox';
import { useNavigate, useParams } from 'react-router-dom';
import { CREATED, LANGUAGE_IDX, LIKED, PAGE, SOLVED, SORTING_IDX, UNRESOLVED, USERINFO, WITHQUESTIONS, problemsPerPage } from '../../util/constants';
import { menuWords } from '../../util/menuWords';
import { loginWarning, setProblemIndicies, sortingProblemList } from '../../util/functions';
import { initialUserInfo, sortingMethods } from '../../util/initialForms';
import { getSampleProblemByIndexList } from '../../network/sampleProblem';
import { LOGIN_PATH } from '../../util/paths';
import { LoadingPage } from '../LoadingPage';

export default function MyPageProblems() {
  const { part } = useParams()
  let idxList: number[] = []
  const userInfo: UserInfo = JSON.parse(sessionStorage.getItem(USERINFO) || initialUserInfo)
  const [problems, setProblems] = useState<SampleProblemInformation[]>([]);
  const languageIdx = Number(localStorage.getItem(LANGUAGE_IDX))
  const [sortingIdx, setSortingIdx] = useState(Number(sessionStorage.getItem(SORTING_IDX)))
  const methods = sortingMethods[languageIdx]
  const [page, setPage] = useState(Number(sessionStorage.getItem(PAGE)))
  const [pageName, setPageName] = useState("")
  const divider = <Divider orientation="horizontal" sx={{borderColor: "inherit", my: 2, mx: 2}} />
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()


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
    if (!userInfo.name) {
      loginWarning()
      navigate(LOGIN_PATH)
    }
    const newPage = Number(sessionStorage.getItem(PAGE))
    switch (part) {
      case (CREATED):
        idxList = userInfo.created
        setPageName(menuWords.created[languageIdx])
        break
      case (SOLVED):
        idxList = userInfo.solved
        setPageName(menuWords.solved[languageIdx])
        break
      case (UNRESOLVED):
        idxList = userInfo.tried.filter(element => !userInfo.solved.includes(element))
        setPageName(menuWords.unresolved[languageIdx])
        break
      case (LIKED):
        idxList = userInfo.liked
        setPageName(menuWords.liked[languageIdx])
        break
      case (WITHQUESTIONS):
        idxList = userInfo.withQuestions
        setPageName(menuWords.requestsReceived[languageIdx])
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
    setLoading(false)
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

  if (loading) {
    return (
      <LoadingPage></LoadingPage>
    )
  }

  return (
    <Box textAlign="center">
      <Typography sx={{mt: 2}}>{pageName}</Typography>
      {divider}
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