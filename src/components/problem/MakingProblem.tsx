import { useEffect, useState } from "react"
import { Coordinate, CreateProblemForm, UserInfo } from "../../util/types"
import { COMMENT, LEVEL, MARGIN, TURN, USERINFO } from "../../util/constants"
import { Box, Button, ButtonGroup, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from "@mui/material"
import { getLanguageIdx, getLevelText, isLegalBoard, loginWarning, makingEmptyBoard } from "../../util/functions"
import { isOutside } from "../../gologic/logic"
import FinalBoard from "../board/FinalBoard"
import { menuWords } from "../../util/menuWords"
import { useWindowSize } from "react-use"
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { boardSizeArray, initialUserInfo, levelArray } from "../../util/initialForms"
import { mobileButtonStyle } from "../../util/styles"
import { useNavigate } from "react-router-dom"
import { LOGIN_PATH } from "../../util/paths"
import { useCreateProblemMutation } from "../../slices/problemApiSlice"

export function MakingProblem() {
  const userInfo: UserInfo = JSON.parse(sessionStorage.getItem(USERINFO) || initialUserInfo)
  const navigate = useNavigate()
  const [boardSize, setBoardSize] = useState(9)
  let emptyBoard = makingEmptyBoard(boardSize)
  const [create, { isLoading: cpLoading }] = useCreateProblemMutation()
  const [problem, setProblem] = useState(emptyBoard)
  const {width, height} = useWindowSize()
  const isMobile = height > width * 2 / 3 || width < 1000
  const margin = isMobile? 0 : MARGIN
  const languageIdx = getLanguageIdx()
  const [info, setInfo] = useState({
    comment: "",
    turn: "b",
    color: "b",
    level: 18,
  })  
  const [openSuggestion, setOpenSuggestion] = useState(false)
  const [problemIndex, setProblemIndex] = useState(0)

  useEffect(() => {
    if (!userInfo.name) {
      loginWarning()
      navigate(LOGIN_PATH)
    }
  }, [])
  
  function changeInfo(where: string, val:any) {
    setInfo({
      ...info,
      [where]: val
    })
  }
  
  const commentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    changeInfo(COMMENT, e.target.value)
  }

  const dialogContent = (title: string, content: string) => {
    return (
      <>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {content}
          </DialogContentText>
        </DialogContent>
      </>
    )
  }

  function addMove(coord: Coordinate) {
    const y = coord[0], x = coord[1]
    const newProblem = [...problem]
    newProblem[y][x] = problem[y][x] === info.color? "." : info.color
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
    const form: CreateProblemForm = {
      comment: info.comment,
      initialState: problem,
      creator: userInfo.name,
      level: info.level,
      color: info.turn
    }
    const newIdx = await create(form).unwrap()
    if (!newIdx) {
      return
    }
    setProblemIndex(newIdx)
    setProblem(emptyBoard)
    setOpenSuggestion(true)
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
  <Box>
    <Box my="5%" textAlign="center" justifyContent={isMobile? "space-between" : "center"} display={isMobile? "flex" : ""}>
      <FormControl variant="standard" sx={{margin: margin, width: isMobile? "30%" : "80%", textAlign: "center"}}>
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
      <FormControl variant="standard" sx={{margin: margin, width: isMobile? "30%" : "80%"}}>
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
      <FormControl sx={{margin: margin, width: isMobile? "30%" : "80%"}} variant="standard">
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
    <Box textAlign="center">
      <TextField sx={{margin: margin, justifyContent: "center", width: isMobile? "100%" : "80%", alignSelf: "center"}}
      error={info.comment.length > 50? true : false}
      helperText={info.comment.length > 50? menuWords.commentLengthWarning[languageIdx] : ""}
      name={COMMENT}
      label={menuWords.explanation[languageIdx]} 
      variant="standard"
      value={info.comment}
      onChange={commentChange}
      />
    </Box>
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
      <Dialog open={openSuggestion} onClose={() => setOpenSuggestion(false)}>
        {dialogContent(menuWords.registrationComplete[languageIdx], menuWords.variationSuggestion[languageIdx])}
        <DialogActions>
          <Button onClick={() => navigate(`/modify/${problemIndex}`)} sx={{textTransform: "none"}} color="primary" autoFocus>
            {menuWords.confirm[languageIdx]}
          </Button>
          <Button onClick={() => setOpenSuggestion(false)} sx={{textTransform: "none"}} color="primary">
            {menuWords.cancel[languageIdx]}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}