import { useState } from "react"
import { Coordinate, UserInfo } from "../../util/types"
import { COMMENT, LANGUAGE_IDX, LEVEL, MARGIN, TURN, USERINFO, boardSizeArray, initialUserInfo, levelArray } from "../../util/constants"
import { Box, Button, FormControl, Grid, InputLabel, MenuItem, Select, SelectChangeEvent, TextField, useMediaQuery } from "@mui/material"
import { isLegalBoard, makingEmptyBoard } from "../../util/functions"
import { isOutside } from "../../gologic/logic"
import FinalBoard from "../board/FinalBoard"
import { menuWords } from "../../util/menuWords"
import { createProblem } from "../../network/problem"
import { useWindowSize } from "react-use"

export function MakingProblem() {
  const userDetail: UserInfo = JSON.parse(sessionStorage.getItem(USERINFO) || initialUserInfo)
  const creator = userDetail.name
  const [boardSize, setBoardSize] = useState(9)
  let emptyBoard = makingEmptyBoard(boardSize)
  const [problem, setProblem] = useState(emptyBoard)
  const {width, height} = useWindowSize()
  const isMobile = height > width * 2 / 3 || width < 1000
  const margin = MARGIN
  const languageIdx = Number(localStorage.getItem(LANGUAGE_IDX))
  const [info, setInfo] = useState({
    comment: "",
    turn: "b",
    color: "",
    level: 18,
  })  
  
  function changeInfo(where: string, val:any) {
    setInfo({
      ...info,
      [where]: val
    })
  }
  
  const commentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    changeInfo(COMMENT, e.target.value)
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

  function registerProblemAndResetBoard() {
    if (info.comment.length > 50) {return}
    if (!isLegalBoard(problem)) {
      alert(menuWords.invalidBoardWarning[languageIdx])
      return
    }
    createProblem(info.comment, problem, creator, info.level, info.turn)
    setProblem(emptyBoard)
    changeInfo(COMMENT, "")
  }

  function handleTurnChange(e: SelectChangeEvent) {
    changeInfo(TURN, e.target.value)
  }

  function handleBoardSizeChange(e: SelectChangeEvent) {
    const newSize = Number(e.target.value)
    if (newSize === boardSize) {
      return
    }
    const newBoard = makingEmptyBoard(newSize)
    setBoardSize(Number(newSize))
    setProblem(newBoard)
  }

  function levelChange(e: SelectChangeEvent) {
    changeInfo(LEVEL, Number(e.target.value))
  }

  function resetBoard() {
    setProblem(makingEmptyBoard(boardSize))

  }

  const leftMenu = 
  <Box textAlign="center" justifyContent={isMobile? "space-between" : "center"} display={isMobile? "flex" : "grid"}>
    <TextField sx={{margin: margin, width: isMobile? "50%" : "100%"}}
    error={info.comment.length > 50? true : false}
    helperText={info.comment.length > 50? menuWords.commentLengthWarning[languageIdx] : ""}
    name={COMMENT}
    label={menuWords.explanation[languageIdx]} 
    variant='standard' 
    value={info.comment}
    onChange={commentChange}
    />
    <FormControl variant="standard" sx={{margin: margin, width: isMobile? "30%" : "100%"}}>
      <InputLabel id="size-select-label">{menuWords.boardSize[languageIdx]}</InputLabel>
      <Select
      labelId="size-select-label"
      id="size-select"
      value={String(boardSize)}
      label={menuWords.boardSize[languageIdx]}
      variant="standard"
      onChange={handleBoardSizeChange}
      >
        {boardSizeArray.map(size => {
          return (<MenuItem key={size} value={size}>{size}</MenuItem>)
        })}
      </Select>
    </FormControl>
    <FormControl variant="standard" sx={{margin: margin, width: isMobile? "30%" : "100%"}}>
      <InputLabel id="turn-select-label">{menuWords.turn[languageIdx]}</InputLabel>
      <Select
      labelId="turn-select-label"
      id="turn-select"
      value={info.turn}
      label={menuWords.turn[languageIdx]}
      onChange={handleTurnChange}
      >
        <MenuItem value={"b"}>{menuWords.blackTurn[languageIdx]}</MenuItem>
        <MenuItem value={"w"}>{menuWords.whiteTurn[languageIdx]}</MenuItem>
      </Select>
    </FormControl>
    <FormControl sx={{margin: margin, width: isMobile? "30%" : "100%"}} variant="standard">
      <InputLabel id="level-select-label">{menuWords.level[languageIdx]}</InputLabel>
      <Select
        labelId="level-select-label"
        id="level-select"
        value={String(info.level)}
        label={menuWords.level[languageIdx]}
        onChange={levelChange}
      >
        {levelArray.map(level => {
          return <MenuItem key={level} value={level}>{Math.abs(level)}{level > 0? menuWords.K[languageIdx] : menuWords.D[languageIdx]}</MenuItem>
        })}
      </Select>
    </FormControl>
  </Box>

  const rightMenu = 
  <Box textAlign="center" display={isMobile? "flex" : "grid"} justifyContent={isMobile? "space-between" : "center"}>
    <Button sx={{margin: margin, color: info.color === "b"? "inherit" : ""}} onClick={() => changeInfo("color", "b")}>
      {menuWords.BLACK[languageIdx]}
    </Button>
    <Button sx={{margin: margin, color: info.color === "w"? "inherit" : ""}} onClick={() => changeInfo("color", "w")}>
      {menuWords.WHITE[languageIdx]}
    </Button>
    <Button sx={{margin: margin, color: info.color === "."? "inherit" : ""}} onClick={() => changeInfo("color", ".")}>
      {menuWords.remove[languageIdx]}
    </Button>
    <Button sx={{margin: margin, color: "red"}} onClick={resetBoard}>
      {menuWords.reset[languageIdx]}
    </Button>
    <Button sx={{margin: margin, color: "green"}} onClick={registerProblemAndResetBoard}>
      {menuWords.create[languageIdx]}
    </Button>
  </Box>



  return (
    <Grid container justifyContent="center">
      <Grid item sx={{margin: margin, width: isMobile? width : width / 6}}>
        {leftMenu}
        {rightMenu}
      </Grid>
      <Grid justifyContent="center" item sx={{
        margin: isMobile? 0 : margin,
        width: isMobile? width : height - 100, 
        height: isMobile? width : height - 100
      }}>
      <FinalBoard
        lines={boardSize}
        board={problem}
        boardWidth={isMobile? width : height - 100}
        onClick={handleClick}
      >
      </FinalBoard>
      </Grid>
    </Grid>
    
  )
}