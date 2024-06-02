import { useState } from "react"
import { Coordinate, UserInfo } from "../../util/types"
import { COMMENT, LANGUAGE_IDX, LEVEL, MARGIN, TURN, USERINFO } from "../../util/constants"
import { Box, Button, ButtonGroup, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField, useMediaQuery } from "@mui/material"
import { isLegalBoard, makingEmptyBoard } from "../../util/functions"
import { isOutside } from "../../gologic/logic"
import FinalBoard from "../board/FinalBoard"
import { menuWords } from "../../util/menuWords"
import { createProblem } from "../../network/problem"
import { useWindowSize } from "react-use"
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { boardSizeArray, initialUserInfo, levelArray } from "../../util/initialForms"
import { mobileButtonStyle } from "../../util/styles"

export function MakingProblem() {
  const userInfo: UserInfo = JSON.parse(sessionStorage.getItem(USERINFO) || initialUserInfo)
  const creator = userInfo.name
  const [boardSize, setBoardSize] = useState(9)
  let emptyBoard = makingEmptyBoard(boardSize)
  const [problem, setProblem] = useState(emptyBoard)
  const {width, height} = useWindowSize()
  const isMobile = height > width * 2 / 3 || width < 1000
  const margin = isMobile? 0 : MARGIN
  const languageIdx = Number(localStorage.getItem(LANGUAGE_IDX))
  const [info, setInfo] = useState({
    comment: "",
    turn: "b",
    color: "b",
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
    const y = coord[0], x = coord[1]
    const newProblem = [...problem]
    newProblem[y][x] = info.color
    setProblem(newProblem)
  }

  function handleClick(coord: Coordinate) {
    if (isOutside(coord, boardSize)) {return}
    addMove(coord)
  }

  async function registerProblemAndResetBoard() {
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

  const blackStone = 
  <img src="/images/black.svg.png" alt="black" width={isMobile? width / 20 : width / 30} height={isMobile? width / 20 : width / 30}/>
  const whiteStone = 
  <img src="/images/white.svg.png" alt="white" width={isMobile? width / 20 : width / 30}/>
  const eraserIcon = 
  <img src="/images/eraser.png" alt="eraser" width={isMobile? width / 20 : width / 30}/>
  const resetIcon = 
  <img src="/images/reset.svg" alt="reset"  width={isMobile? width / 20 : width / 30}/>

  const topMenu = 
  <Box mt="5%" textAlign="center" justifyContent={isMobile? "space-evenly" : "center"} display={isMobile? "flex" : ""}>
    <TextField sx={{margin: margin, width: isMobile? "20%" : "80%"}}
    error={info.comment.length > 50? true : false}
    helperText={info.comment.length > 50? menuWords.commentLengthWarning[languageIdx] : ""}
    name={COMMENT}
    label={menuWords.explanation[languageIdx]} 
    variant='standard' 
    value={info.comment}
    onChange={commentChange}
    />
    <FormControl variant="standard" sx={{margin: margin, width: isMobile? "20%" : "80%", textAlign: "center"}}>
      <InputLabel>{menuWords.boardSize[languageIdx]}</InputLabel>
      <Select
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
    <FormControl variant="standard" sx={{margin: margin, width: isMobile? "20%" : "80%"}}>
      <InputLabel>{menuWords.turn[languageIdx]}</InputLabel>
      <Select
      value={info.turn}
      label={menuWords.turn[languageIdx]}
      onChange={handleTurnChange}
      >
        <MenuItem value={"b"}>{menuWords.blackTurn[languageIdx]}</MenuItem>
        <MenuItem value={"w"}>{menuWords.whiteTurn[languageIdx]}</MenuItem>
      </Select>
    </FormControl>
    <FormControl sx={{margin: margin, width: isMobile? "20%" : "80%"}} variant="standard">
      <InputLabel>{menuWords.level[languageIdx]}</InputLabel>
      <Select
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

  const mobileBottomMenu = 
  <Box display="flex" justifyContent="space-around" alignItems="center">
    <Button onClick={resetBoard} sx={mobileButtonStyle}>
      {resetIcon}
    </Button>
    <ButtonGroup size='small' variant='text' color="inherit" sx={{justifyContent: "center"}}>
      <Button variant={info.color === "b"? "contained" : "text"} onClick={() => changeInfo("color", "b")}>{blackStone}</Button>
      <Button variant={info.color === "w"? "contained" : "text"} onClick={() => changeInfo("color", "w")}>{whiteStone}</Button>
      <Button variant={info.color === "."? "contained" : "text"} onClick={() => changeInfo("color", ".")}>{eraserIcon}</Button>
    </ButtonGroup>
    <Button sx={mobileButtonStyle} onClick={registerProblemAndResetBoard}>
      {menuWords.register[languageIdx]}
    </Button>
  </Box>

  const wideMenu = 
  <Box my="30%" display="grid" justifyContent="center" alignItems="center">
    <ButtonGroup size='small' variant='text' color="inherit" sx={{justifyContent: "center"}}>
      <Button variant={info.color === "b"? "contained" : "text"} onClick={() => changeInfo("color", "b")}>{blackStone}</Button>
      <Button variant={info.color === "w"? "contained" : "text"} onClick={() => changeInfo("color", "w")}>{whiteStone}</Button>
      <Button variant={info.color === "."? "contained" : "text"} onClick={() => changeInfo("color", ".")}>{eraserIcon}</Button>
    </ButtonGroup>
    <Button sx={{my: "20%"}} onClick={resetBoard}>
      {resetIcon}
    </Button>
    <Button startIcon={<CloudUploadIcon/>} sx={{textTransform: "none"}} onClick={registerProblemAndResetBoard}>
      {menuWords.register[languageIdx]}
    </Button>
  </Box>



  return (
    <Box display={isMobile? "grid" : "flex"} justifyContent="center">
      <Box display="grid" margin={margin}>
        {topMenu}
        {isMobile? <></> : wideMenu}
      </Box>
      <Box my={3} mx={margin}>
        <FinalBoard
          lines={boardSize}
          board={problem}
          boardWidth={isMobile? width - 16 : height - 100}
          onClick={handleClick}
        />
      </Box>
      <Box>
        {isMobile? mobileBottomMenu : <></>}
      </Box>
    </Box>
  )
}