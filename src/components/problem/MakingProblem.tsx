import { useEffect, useState } from "react"
import { Coordinate } from "../../util/types"
import { LANGUAGE_IDX, USERNAME, boardWidth } from "../../util/constants"
import { Box, Button, Divider, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField, useMediaQuery } from "@mui/material"
import { isLegalBoard, makingEmptyBoard } from "../../util/functions"
import { isOutside } from "../../gologic/logic"
import FinalBoard from "../board/FinalBoard"
import { createProblem } from "../../util/network"
import { menuWords } from "../../util/menuWords"

export function MakingProblem() {
  const [level, setLevel] = useState(18)
  const creator = localStorage.getItem(USERNAME)
  const [boardSize, setBoardSize] = useState(9)
  let emptyBoard = makingEmptyBoard(boardSize)
  const [problem, setProblem] = useState(emptyBoard)
  const [color, setColor] = useState("")
  const [comment, setComment] = useState('')
  const [turn, setTurn] = useState('b')
  const divider = <Divider orientation="horizontal" sx={{mt: 1, mb: 2, borderColor: "whitesmoke" }} />
  const isMobile = useMediaQuery("(max-width: 600px)")
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

  function registerProblemAndResetBoard() {
    if (comment.length > 50) {return}
    if (!isLegalBoard(problem)) {
      alert(menuWords.invalidBoardWarning[languageIdx])
      return
    }
    createProblem(comment, problem, creator, level, turn)
    setProblem(emptyBoard)
    setComment("")
    setColor("")
  }

  function handleTurnChange(e: SelectChangeEvent) {
    const newTurn = e.target.value
    newTurn === "black"? setTurn("b") : setTurn("w")
  }

  function handleBoardSizeChange(e: SelectChangeEvent) {
    setBoardSize(Number(e.target.value))
  }

  function levelChange(e: SelectChangeEvent) {
    setLevel(Number(e.target.value))
  }

  useEffect(() => {
    setProblem(makingEmptyBoard(boardSize))
    setColor("")
    setComment("")
  }, [boardSize])



  return (
    <>
      <Box
        sx={{
          display: 'flex',
          width: isMobile ? '100vw' : '800',
          flexDirection: isMobile ? 'column' : 'row',
          gap: isMobile ? '1ch' : 0,
          mt: "2rem"
        }}
      >
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
        label={menuWords.explanation[languageIdx]} 
        variant='standard' 
        value={comment}
        onChange={commentChange}
        />
        {divider}
        <FormControl sx={{height: 200, width: 200}}>
          <InputLabel id="size-select-label">{menuWords.boardSize[languageIdx]}</InputLabel>
          <Select
            labelId="size-select-label"
            id="size-select"
            value={String(boardSize)}
            label={menuWords.boardSize[languageIdx]}
            variant="standard"
            onChange={handleBoardSizeChange}

          >
            <MenuItem value={3}>3</MenuItem>
            <MenuItem value={4}>4</MenuItem>
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={6}>6</MenuItem>
            <MenuItem value={7}>7</MenuItem>
            <MenuItem value={8}>8</MenuItem>
            <MenuItem value={9}>9</MenuItem>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={11}>11</MenuItem>
            <MenuItem value={12}>12</MenuItem>
            <MenuItem value={13}>13</MenuItem>
            <MenuItem value={14}>14</MenuItem>
            <MenuItem value={15}>15</MenuItem>
            <MenuItem value={16}>16</MenuItem>
            <MenuItem value={17}>17</MenuItem>
            <MenuItem value={18}>18</MenuItem>
            <MenuItem value={19}>19</MenuItem>
          </Select>
        </FormControl>
        {divider}
        <FormControl variant="standard" sx={{width: 70}}>
          <InputLabel id="turn-select-label">{menuWords.turn[languageIdx]}</InputLabel>
          <Select
            labelId="turn-select-label"
            id="turn-select"
            value={turn === "b"? "black" : "white"}
            label={menuWords.turn[languageIdx]}
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
            label={menuWords.level[languageIdx]}
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
            flex: isMobile ? undefined : `1 0 0px`,
            // mr: isMobile ? '0' : '1ch',
          }}
        >
          <Button sx={{color: color === "w"? "black" : ""}} onClick={() => colorChange('w')}>{menuWords.white[languageIdx]}</Button>
          {divider}
          <Button sx={{color: color === "b"? "black" : ""}} onClick={() => colorChange('b')}>{menuWords.black[languageIdx]}</Button>
          {divider}
          <Button sx={{color: color === "."? "black" : ""}} onClick={() => colorChange('.')}>{menuWords.remove[languageIdx]}</Button>
          {divider}
          <Button sx={{color: "red"}} onClick={() => setProblem(emptyBoard)}>{menuWords.allClear[languageIdx]}</Button>
          {divider}
          <Button onClick={registerProblemAndResetBoard}>{menuWords.create[languageIdx]}</Button>
        </Box>
      </Box>
    </>

  )
}