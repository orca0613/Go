import { useState } from "react"
import { Coordinate, ProblemInfo } from "../../util/types"
import { LANGUAGE_IDX, boardWidth } from "../../util/constants"
import { Box, Button, Divider, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField, useMediaQuery } from "@mui/material"
import { isLegalBoard } from "../../util/functions"
import { isOutside } from "../../gologic/logic"
import FinalBoard from "../board/FinalBoard"
import { useNavigate } from "react-router-dom"
import { modifyProblem } from "../../util/network"
import { menuWords } from "../../util/menuWords"

interface ModifyProblemProps {
  problemInfo: ProblemInfo
}

export function ModifyProblem({ problemInfo }: ModifyProblemProps) {
  const id = problemInfo._id
  const [level, setLevel] = useState(problemInfo.level) 
  const [problem, setProblem] = useState(problemInfo.initialState)
  const [color, setColor] = useState("")
  const [comment, setComment] = useState(problemInfo.comment)
  const [turn, setTurn] = useState(problemInfo.color)
  const boardSize = problem.length
  const divider = <Divider orientation="horizontal" sx={{mt: 1, mb: 2, borderColor: "whitesmoke" }} />
  const isMobile = useMediaQuery("(max-width: 600px)")
  const navigate = useNavigate()
  const languageIdx = Number(localStorage.getItem(LANGUAGE_IDX))


  const commentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setComment(e.target.value)
  }

  function addMove(coord: Coordinate) {
    if (color === "") {
      alert(menuWords.chooseColorWarning[languageIdx])
      return
    }
    const y = coord[0], x = coord[1]
    const newProblem = [...problem]
    newProblem[y][x] = color
    setProblem(newProblem)
  }

  function colorChange(c: string) {
    setColor(c)
  }

  function handleClick(coord: Coordinate) {
    if (isOutside(coord, boardSize)) {return}
    addMove(coord)
  }

  function modify() {
    if (comment.length > 50) {return}
    if (!isLegalBoard(problem)) {
      alert(menuWords.invalidBoardWarning[languageIdx])
      return
    }
    modifyProblem(id, problem, comment, level, turn)
  }

  function handleTurnChange(e: SelectChangeEvent) {
    const newTurn = e.target.value
    newTurn === "black"? setTurn("b") : setTurn("w")
  }

  function levelChange(e: SelectChangeEvent) {
    setLevel(Number(e.target.value))
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
        error={comment.length > 50? true : false}
        helperText={comment.length > 50? menuWords.commentLengthWarning[languageIdx] : ""}
        name='level'
        label='comment' 
        variant='standard' 
        value={comment}
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
              value={turn === "b"? "black" : "white"}
              label="turn"
              onChange={handleTurnChange}
            >
              <MenuItem value={"black"}>{menuWords.black[languageIdx]}</MenuItem>
              <MenuItem value={"white"}>{menuWords.white[languageIdx]}</MenuItem>
            </Select>
          </FormControl>
          <FormControl sx={{ml: 3, width:70}} variant="standard">
            <InputLabel id="level-select-label">{menuWords.level[languageIdx]}</InputLabel>
            <Select
              labelId="level-select-label"
              id="level-select"
              value={String(level)}
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
        
        <Button sx={{color: color === "w"? "black" : ""}} onClick={() => colorChange('w')}>{menuWords.white[languageIdx]}</Button>
          {divider}
          <Button sx={{color: color === "b"? "black" : ""}} onClick={() => colorChange('b')}>{menuWords.black[languageIdx]}</Button>
          {divider}
          <Button sx={{color: color === "."? "black" : ""}} onClick={() => colorChange('.')}>{menuWords.remove[languageIdx]}</Button>
          {divider}
          <Button onClick={modify}>{menuWords.modify[languageIdx]}</Button>
      </Box>
      </Box>
    </>

  )
}