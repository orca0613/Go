import { ChangeEvent, useEffect, useState } from "react"
import { SORTING_IDX, USERINFO, problemsPerPage } from "../../util/constants"
import { getLanguageIdx, getPageName, setProblemIndicies, sortingProblemList } from "../../util/functions"
import { initialUserInfo, sortingMethods } from "../../util/initialForms"
import { Box, Divider, FormControl, InputLabel, MenuItem, Pagination, Select, SelectChangeEvent, Stack, Typography } from "@mui/material"
import { menuWords } from "../../util/menuWords"
import SampleProblemBox from "./SampleProblemBox"
import { SampleProblemInformation, UserInfo } from "../../util/types"

interface MpProps {
  problemList: SampleProblemInformation[]
  part: string,
  request?: boolean
}

export default function MyPageProblems({problemList, part, request}: MpProps) {

  const userInfo: UserInfo = JSON.parse(sessionStorage.getItem(USERINFO) || initialUserInfo)
  const languageIdx = getLanguageIdx()
  const [sortingIdx, setSortingIdx] = useState(0)
  const methods = sortingMethods[languageIdx]
  const [page, setPage] = useState(1)
  const [pageName, setPageName] = useState("")
  const [problems, setProblems] = useState(problemList)
  const divider = <Divider orientation="horizontal" sx={{borderColor: "inherit", my: 2, mx: 2}} />

  useEffect(() => {
    setProblemIndicies(problemList)
    setPageName(getPageName(part))
    setProblems(problemList)
    setSortingIdx(0)
    sessionStorage.setItem(SORTING_IDX, "0")
  }, [problemList, part])

  function sorting(e: SelectChangeEvent) {
    const p = Number(e.target.value)
    console.log(p)
    setSortingIdx(p)
    sessionStorage.setItem(SORTING_IDX, String(p))
    const sorted = sortingProblemList(problems, p)
    setProblemIndicies(sorted)
    setProblems(sorted)
    setPage(1)
  }
    
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
      <Typography sx={{mt: 2}}>{pageName} {`(${problems.length})`}</Typography>
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
      <SampleProblemBox problems={getShowProblems()} page={page} request={request}></SampleProblemBox>
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