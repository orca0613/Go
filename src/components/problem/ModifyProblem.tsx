import { useState } from "react"
import { Coordinate, ProblemInfo } from "../../util/types"
import { LANGUAGE_IDX } from "../../util/constants"
import { Box, Button, Divider, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField, useMediaQuery } from "@mui/material"
import { isLegalBoard } from "../../util/functions"
import { isOutside } from "../../gologic/logic"
import FinalBoard from "../board/FinalBoard"
import { useNavigate } from "react-router-dom"
import { menuWords } from "../../util/menuWords"
import { modifyProblem } from "../../network/problem"

interface ModifyProblemProps {
  problemInfo: ProblemInfo
  boardWidth: number
}

export function ModifyProblem({ problemInfo, boardWidth }: ModifyProblemProps) {
  const id = problemInfo._id
  const [problem, setProblem] = useState(problemInfo.initialState)
  const boardSize = problem.length
  const divider = <Divider orientation="horizontal" sx={{mt: 1, mb: 2, borderColor: "whitesmoke" }} />
  const isMobile = useMediaQuery("(max-width: 600px)")
  const navigate = useNavigate()
  const languageIdx = Number(localStorage.getItem(LANGUAGE_IDX))
  const [info, setInfo] = useState({
    comment: problemInfo.comment,
    turn: problemInfo.color,
    color: "",
    level: problemInfo.level
  })

  function changeInfo(where: string, val: any) {
    setInfo({
      ...info,
      [where]: val
    })
  }


  const commentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    changeInfo("comment", e.target.value)
  }

  function addMove(coord: Coordinate) {
    if (info.color === "") {
      alert(menuWords.chooseColorWarning[languageIdx])
      return
    }
    const y = coord[0], x = coord[1]
    const newProblem = [...problem]
    newProblem[y][x] = info.color
    setProblem(newProblem)
  }

  function handleClick(coord: Coordinate) {
    if (isOutside(coord, boardSize)) {return}
    addMove(coord)
  }

  function modify() {
    if (info.comment.length > 50) {return}
    if (!isLegalBoard(problem)) {
      alert(menuWords.invalidBoardWarning[languageIdx])
      return
    }
    modifyProblem(id, problem, info.comment, info.level, info.turn, problemInfo.creator)
  }

  function handleTurnChange(e: SelectChangeEvent) {
    changeInfo("turn", e.target.value)
  }

  function levelChange(e: SelectChangeEvent) {
    changeInfo("level", Number(e.target.value))
  }

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          width: isMobile ? '100vw' : '800',
          flexDirection: isMobile ? 'column' : 'row',
          gap: isMobile ? '1ch' : 0,
          textAlign: "center"
        }}
      >
        <Box
          sx={{
            flex: '1',
            ml: isMobile ? '0' : '1ch',
          }}
        >
          <FinalBoard 
          lines={problem.length}
          board={problem}
          boardWidth={boardWidth}
          onClick={handleClick}
          />
        </Box>
      <Box
        sx={{
          flex: isMobile ? undefined : `0 0 200px`,
          // mr: isMobile ? '0' : '1ch',
        }}
      >
        <TextField sx={{height: 150}}
        error={info.comment.length > 50? true : false}
        helperText={info.comment.length > 50? menuWords.commentLengthWarning[languageIdx] : ""}
        name='comment'
        label='comment' 
        variant='standard' 
        value={info.comment}
        onChange={commentChange}
        />
        {divider}
        <Box sx={{
          textAlign: "left",
          mb: 10
        }}>
          <FormControl variant="standard" sx={{width: 70}}>
            <InputLabel id="turn-select-label">{menuWords.turn[languageIdx]}</InputLabel>
            <Select
              labelId="turn-select-label"
              id="turn-select"
              value={info.turn}
              label="turn"
              onChange={handleTurnChange}
            >
              <MenuItem value={"b"}>{menuWords.black[languageIdx]}</MenuItem>
              <MenuItem value={"w"}>{menuWords.white[languageIdx]}</MenuItem>
            </Select>
          </FormControl>
          <FormControl sx={{ml: 3, width:70}} variant="standard">
            <InputLabel id="level-select-label">{menuWords.level[languageIdx]}</InputLabel>
            <Select
              labelId="level-select-label"
              id="level-select"
              value={String(info.level)}
              label="level"
              onChange={levelChange}
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
        </Box>
        
        <Button sx={{color: info.color === "w"? "black" : ""}} onClick={() => changeInfo("color", "w")}>{menuWords.white[languageIdx]}</Button>
          {divider}
          <Button sx={{color: info.color === "b"? "black" : ""}} onClick={() => changeInfo("color", "b")}>{menuWords.black[languageIdx]}</Button>
          {divider}
          <Button sx={{color: info.color === "."? "black" : ""}} onClick={() => changeInfo("color", ".")}>{menuWords.remove[languageIdx]}</Button>
          {divider}
          <Button onClick={modify}>{menuWords.modify[languageIdx]}</Button>
      </Box>
      </Box>
    </>

  )
}