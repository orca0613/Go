import { ChangeEvent, useState } from "react"
import { useGetSampleCreatedQuery } from "../../../slices/sampleProblemApiSlice"
import { CREATED, LANGUAGE_IDX, PAGE, SORTING_IDX, USERINFO, problemsPerPage } from "../../../util/constants"
import { getLanguageIdx, setProblemIndicies, sortingProblemList } from "../../../util/functions"
import { initialUserInfo, sortingMethods } from "../../../util/initialForms"
import { Box, Divider, FormControl, InputLabel, MenuItem, Pagination, Select, SelectChangeEvent, Stack, Typography } from "@mui/material"
import { menuWords } from "../../../util/menuWords"
import SampleProblemBox from "../SampleProblemBox"
import { LoadingPage } from "../../LoadingPage"
import { UserInfo } from "../../../util/types"

export default function RequestProblem() {

  const userInfo: UserInfo = JSON.parse(sessionStorage.getItem(USERINFO) || initialUserInfo)
  const requestsReceived = JSON.stringify(userInfo.withQuestions)

  const { data: problems, isLoading: gsLoading } = useGetSampleCreatedQuery(requestsReceived)
  const languageIdx = getLanguageIdx()
  const [sortingIdx, setSortingIdx] = useState(Number(sessionStorage.getItem(SORTING_IDX)))
  const methods = sortingMethods[languageIdx]
  const [page, setPage] = useState(Number(sessionStorage.getItem(PAGE)))
  const divider = <Divider orientation="horizontal" sx={{borderColor: "inherit", my: 2, mx: 2}} />

  function sorting(e: SelectChangeEvent) {
    const p = Number(e.target.value)
    setSortingIdx(p)
    sessionStorage.setItem(SORTING_IDX, String(p))
    const sorted = sortingProblemList(problems, p)
    setProblemIndicies(sorted)
    setPage(1)
  }
    
  function handlePageChange(event: ChangeEvent<unknown>, val: number): void {
    setPage(val)
    window.scrollTo({ top: 0, behavior: "auto" })
  }

  function getShowProblems() {
    const start = (page - 1) * problemsPerPage
    const showProblems = problems? problems.slice(start, Math.min(start + problemsPerPage, problems.length)) : []
    return showProblems
  }

  if (gsLoading) return <LoadingPage></LoadingPage>

  return (
    <Box textAlign="center">
      <Typography sx={{mt: 2}}>{menuWords.requestsReceived[languageIdx]} {problems? `(${problems.length})` : ""}</Typography>
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
      <SampleProblemBox problems={getShowProblems()} page={page}></SampleProblemBox>
      <Stack spacing={2}>
        <Pagination 
        page={page}
        count={problems? Math.ceil(problems.length / problemsPerPage) : 0} 
        onChange={handlePageChange}
        color="primary"
        />
      </Stack>
    </Box>
  );
}