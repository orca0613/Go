import { Autocomplete, Box, Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField, useMediaQuery } from "@mui/material"
import { menuWords } from "../util/menuWords"
import { LANGUAGE_IDX, PAGE } from "../util/constants"
import { useEffect, useState } from "react"
import { Filter } from "../util/types"
import { detailLevel, tiersList } from "../util/initialForms"
import { ownStringify } from "../util/functions"
import { useNavigate } from "react-router-dom"
import { getAllCreators } from "../network/userDetail"

interface FilterBoxProps {
  width: number
  f: Filter
}

export default function FilterBox({ width, f }: FilterBoxProps) {

  const languageIdx = Number(localStorage.getItem(LANGUAGE_IDX))
  const navigate = useNavigate()
  const isMobile = useMediaQuery("(max-width: 800px)")
  const mobileIconSize = width / 15
  const IconSize = width / 50
  const tiers = tiersList[languageIdx]

  const dropDownStyle = {margin: 1, minWidth: "20%"}
  const [filter, setFilter] = useState<Filter>(f)
  const [detail, setDetail] = useState(detailLevel[filter.tier])
  const initIdx = f.level === 0 ? 0 : detail.indexOf((f.level))
  const [levelIdx, setLevelIdx] = useState(initIdx)
  const [options, setOptions] = useState<string[]>([])
  const searchIcon = 
  <img src="/images/search.svg" alt="pre" width={isMobile? mobileIconSize : IconSize} height={isMobile? mobileIconSize : IconSize}/>


  useEffect(() => {
    const creators = getAllCreators()
    const newOptions: string[] = []
    creators.then(r => {
      r.sort()
      r.map(creator => {
        newOptions.push(creator)
      })
      setOptions(newOptions)
      setFilter(f)
      setDetail(detailLevel[f.tier])
      const newLevelidx = f.level === 0 ? 0 : levelIdx
      setLevelIdx(newLevelidx)
    })
  }, [f])

  function changeTier(e: SelectChangeEvent) {
    setFilter({
      ...filter,
      tier: Number(e.target.value),
      level: 0
    })
    setDetail(detailLevel[Number(e.target.value)])
    setLevelIdx(0)
  }

  function changeLevel(e: SelectChangeEvent) {
    const level = detail[Number(e.target.value)]
    setLevelIdx(Number(e.target.value))
    setFilter({
      ...filter,
      level: level
    })
  }

  function changeCreator(newValue: string | null): void {
    const creator = !newValue? "" : newValue
    setFilter({
      ...filter,
      creator: creator
    })
  }

  function changeFilter() {
    const p = ownStringify(filter)
    sessionStorage.setItem(PAGE, "1")
    navigate(`/problems/${p}`)
  }


  const mobileFilterBox = 
  <Box 
    sx={{border: "1px solid black", borderRadius: 2, my: "3%", bgcolor: "whitesmoke"}} 
    justifyContent="space-around"
  >
    <Box display="flex" justifyContent="space-between">
      <FormControl variant="standard" sx={dropDownStyle}>
        <InputLabel>{menuWords.difficulty[languageIdx]}</InputLabel>
        <Select
          value={String(filter.tier)}
          label={tiers[filter.tier]}
          onChange={changeTier}
        >
          {tiers.map((t, idx) => {
            return <MenuItem key={idx} value={idx}>{t}</MenuItem>
          })}
        </Select>
      </FormControl>
      <FormControl variant="standard" sx={dropDownStyle}>
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
    </Box>
    <Box display="flex" justifyContent="space-between">
      <Autocomplete
        freeSolo
        sx={{...dropDownStyle, width: "60%"}}
        options={options}
        value={filter.creator}
        onChange={(event, newValue) => changeCreator(newValue)}
        renderInput={(params) => (
          <TextField {...params} label={menuWords.creator[languageIdx]} variant="standard" />
        )}
      />
      <Button onClick={changeFilter}>{searchIcon}</Button>
    </Box>
  </Box>

const filterBox = 
<Box 
  sx={{border: "1px solid black", borderRadius: 2, width: width / 2, my: "3%", bgcolor: "whitesmoke"}} 
  display="flex" 
  justifyContent="space-around">
  <FormControl variant="standard" sx={dropDownStyle}>
    <InputLabel>{menuWords.difficulty[languageIdx]}</InputLabel>
    <Select
      value={String(filter.tier)}
      label={tiers[filter.tier]}
      onChange={changeTier}
    >
      {tiers.map((t, idx) => {
        return <MenuItem key={idx} value={idx}>{t}</MenuItem>
      })}
    </Select>
  </FormControl>
  <FormControl variant="standard" sx={dropDownStyle}>
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
    freeSolo
    sx={dropDownStyle}
    options={options}
    value={filter.creator}
    onChange={(event, newValue) => changeCreator(newValue)}
    renderInput={(params) => (
      <TextField {...params} label={menuWords.creator[languageIdx]} variant="standard" />
    )}
  />
  <Button onClick={changeFilter}>{searchIcon}</Button>
</Box>




  return (
    <Box>
      {width > 800? filterBox : mobileFilterBox}
    </Box>
  )

}