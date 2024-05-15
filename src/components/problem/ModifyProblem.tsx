import { useEffect, useState } from "react"
import { Coordinate, UserInfo } from "../../util/types"
import { COMMENT, HOME, LANGUAGE_IDX, LEVEL, MARGIN, TURN, USERINFO } from "../../util/constants"
import { Box, Button, ButtonGroup, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from "@mui/material"
import { isLegalBoard, makingEmptyBoard } from "../../util/functions"
import { isOutside } from "../../gologic/logic"
import FinalBoard from "../board/FinalBoard"
import { menuWords } from "../../util/menuWords"
import { getProblemByIdx, modifyProblem } from "../../network/problem"
import { useWindowSize } from "react-use"
import { useNavigate, useParams } from "react-router-dom"
import { boardSizeArray, initialUserInfo, levelArray } from "../../util/initialForms"
import { mobileButtonStyle } from "../../util/styles"

export function ModifyProblem() {
  const { param } = useParams()
  const problemIdx = Number(param)
  const userInfo: UserInfo = JSON.parse(sessionStorage.getItem(USERINFO) || initialUserInfo)
  const [boardSize, setBoardSize] = useState(9)
  let emptyBoard = makingEmptyBoard(boardSize)
  const [problem, setProblem] = useState(emptyBoard)
  const {width, height} = useWindowSize()
  const navigate = useNavigate()
  const isMobile = height > width * 2 / 3 || width < 1000
  const margin = MARGIN
  const languageIdx = Number(localStorage.getItem(LANGUAGE_IDX))
  const [info, setInfo] = useState({
    creator: "",
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

  const blackStone = 
  <img src="/images/black.svg.png" alt="black" width={width / 20} height={width / 20}/>
  const whiteStone = 
  <img src="/images/white.svg.png" alt="white" width={width / 20} height={width / 20}/>
  const eraserIcon = 
  <img src="/images/eraser.png" alt="eraser" width={width / 20} height={width / 20}/>
  const resetIcon = 
  <img src="/images/reset.svg" alt="reset"  width={width / 20} height={width / 20}/>

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

  function checkAndModify() {
    if (info.comment.length > 50) {return}
    if (!isLegalBoard(problem)) {
      alert(menuWords.invalidBoardWarning[languageIdx])
      return
    }
    modifyProblem(problemIdx, problem, info.comment, info.level, info.turn, info.creator)
  }

  useEffect(() => {
    if (problemIdx >= 0) {
      const newProblemInfo = getProblemByIdx(problemIdx)
      .then(p => {
        if (!p) {
          alert(menuWords.wrongIndexWarning[languageIdx])
          navigate(HOME)
        } else {
          if (p.creator !== userInfo.name) {
            alert(menuWords.permissionWarning[languageIdx])
            sessionStorage.clear()
            navigate(HOME)
          }
          const initialState = p.initialState
          setProblem(initialState)
          setInfo({
            creator: p.creator,
            comment: p.comment,
            turn: p.color,
            color: "",
            level: p.level
          })
          setBoardSize(initialState.length)
        }
      })
    }
  }, [problemIdx])

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
    <FormControl variant="standard" sx={{margin: margin, width: isMobile? "20%" : "80%"}}>
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
    <Button sx={mobileButtonStyle} onClick={checkAndModify}>
      {menuWords.modifyProblem[languageIdx]}
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
  <Button sx={{textTransform: "none"}} onClick={checkAndModify}>
    {menuWords.modifyProblem[languageIdx]}
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