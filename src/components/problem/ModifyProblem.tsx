import { useEffect, useState } from "react"
import { Coordinate, ModifyProblemForm, ProblemAndVariations, UserInfo } from "../../util/types/types"
import { COMMENT, HOME, INFO_FOR_MODIFYING, LEVEL, MARGIN, TURN, USERINFO } from "../../util/constants"
import { Box, Button, ButtonGroup, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from "@mui/material"
import { getLanguageIdx, getLevelText, isLegalBoard, loginWarning, makingEmptyBoard } from "../../util/functions"
import { isOutside } from "../../gologic/logic"
import FinalBoard from "../board/FinalBoard"
import { menuWords } from "../../util/menuWords"
import { useWindowSize } from "react-use"
import { useNavigate, useParams } from "react-router-dom"
import { boardSizeArray, initialProblemInfo, initialUserInfo, levelArray } from "../../util/initialForms"
import { mobileButtonStyle } from "../../util/styles"
import { useModifyProblemMutation } from "../../slices/problemApiSlice"

export function ModifyProblem() {
  const { param } = useParams()
  const pi = localStorage.getItem("problemInfo")
  const [problemInfo, setProblemInfo] = useState<ProblemAndVariations>(pi? JSON.parse(pi) : initialProblemInfo)
  const [boardSize, setBoardSize] = useState(problemInfo.initialState.length)
  const [problem, setProblem] = useState(problemInfo.initialState)
  const [mp, { isLoading: mpLoading }] = useModifyProblemMutation()
  const {width, height} = useWindowSize()
  const navigate = useNavigate()
  const isMobile = height > width * 2 / 3 || width < 1000
  const margin = MARGIN
  const languageIdx = getLanguageIdx()
  const [info, setInfo] = useState({
    creator: problemInfo.creator,
    comment: problemInfo.comment,
    turn: problemInfo.color,
    color: "b",
    level: problemInfo.level,
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
    console.log(info.color)
    newProblem[y][x] = problem[y][x] === info.color? "." : info.color
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

  async function checkAndModify() {
    if (info.comment.length > 50) {return}
    if (!isLegalBoard(problem)) {
      alert(menuWords.invalidBoardWarning[languageIdx])
      return
    }
    const form: ModifyProblemForm = {
      creator: info.creator,
      problemIdx: problemInfo.problemIdx,
      initialState: problem,
      comment: info.comment,
      level: info.level,
      color: info.turn,
    }
    await mp(form).unwrap()
    alert(menuWords.modifiedNotice[languageIdx])
  }

  useEffect(() => {
    const pi = localStorage.getItem(INFO_FOR_MODIFYING)
    if (!pi) {
      console.log("shit")
      return navigate(HOME)
    }
    const newProblemInfo: ProblemAndVariations = JSON.parse(pi)
    if (newProblemInfo.problemIdx !== Number(param)) {
      return navigate(HOME)
    }
    setProblemInfo(newProblemInfo)
    setProblem(newProblemInfo.initialState)
    setInfo({
      creator: newProblemInfo.creator,
      comment: newProblemInfo.comment,
      turn: newProblemInfo.color,
      color: "b",
      level: newProblemInfo.level
    })
    setBoardSize(newProblemInfo.initialState.length)
  }, [param])

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
          return <MenuItem key={level} value={level}>{getLevelText(level)}</MenuItem>
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