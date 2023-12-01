import { useEffect, useState } from "react";
import { Coordinate, Board, BoardInfo } from "../../util/types" 
import _ from 'lodash'
import {  Box, Button, Grid, useMediaQuery } from "@mui/material";
import { makeRandomNumber, playMoveAndReturnNewBoard, removeProblem } from "../../util/functions";
import { USER_NAME, boardWidth } from "../../util/constants";
import FinalBoard from "../board/FinalBoard";
import { useNavigate } from "react-router-dom";
import { MakingVariations } from "./MakingVariations";
import { ProblemInformation } from "./ProblemInformation";
import problemStore from "../../store/problemStore";
import { setProblemIndex } from "../../redux/actions";

export function ProblemPage() {
  const navigate = useNavigate()
  const [problems, setProblems] = useState(problemStore.getState().problemList)
  console.log(problems.length)
  if (problems.length === 0) {
    return <Button onClick={() => navigate("/home")}>home</Button>
  }
  const [index, setIndex] = useState(problemStore.getState().curIndex)
  const problemCount = problems.length
  const [problemInfo, setProblemInfo] = useState(problems[index])
  const [id, setId] = useState(problemInfo._id)
  const [variations, setVariations] = useState(problemInfo.variations)
  const [creator, setCreator] = useState(problemInfo.creator)
  const [lines, setLines] = useState(problemInfo.initialState.length)
  const username = localStorage.getItem(USER_NAME)
  const [problem, setProblem] = useState(problemInfo.initialState)
  const [currentKey, setCurrentKey] = useState('0')
  const [color, setColor] = useState(problemInfo.color)
  const [selfPlay, setSelfPlay] = useState(false)
  const [wrong, setWrong] = useState(0)
  const [variationMode, setVariationMode] = useState(false)
  const isMobile = useMediaQuery("(max-width: 600px)")
  const [boardInfo, setBoardInfo] = useState({
    board: problem,
    color: color,
  })
  const info = <ProblemInformation
    creator={creator}
    level={problemInfo.level}
    color={problemInfo.color}
    comment={problemInfo.comment}
  />

  const board = <FinalBoard 
  lines={problem.length}
  board={problem}
  boardWidth={boardWidth}
  moves={currentKey}
  onClick={handleClick}
  ></FinalBoard>

  const [history, setHistory] = useState([boardInfo])

  useEffect(() => {
    const newProblemInfo = problems[index]
    setProblemInfo(newProblemInfo)
    setId(newProblemInfo._id)
    setVariations(newProblemInfo.variations)
    setCreator(newProblemInfo.creator)
    setLines(newProblemInfo.initialState.length)
    setProblem(newProblemInfo.initialState)
    setCurrentKey('0')
    setColor(newProblemInfo.color)
    setSelfPlay(false)
    setWrong(0)
    setVariationMode(false)
    const newBoardInfo: BoardInfo = {
      board: newProblemInfo.initialState,
      color: newProblemInfo.color,
    }
    setBoardInfo(newBoardInfo)
    setHistory([newBoardInfo])
  }, [index])
	const movePage = (address: string) => {
		navigate(address)
  }

  function reset() {
    setProblem(problemInfo.initialState)
    setCurrentKey('0')
    setColor(problemInfo.color)
    setHistory([boardInfo])
  }

  function addHistory(board: Board, color: string) {
    const newHistory: BoardInfo = {
      board: board,
      color: color
    }
    setHistory(history.concat([newHistory]))
  }

  function goToPreviousMove() {
    const pre = history.pop()
    if (pre === undefined) {
      return
    } else {
      setProblem(pre.board)
      setColor(pre.color)
      let newKey = currentKey
      for (let i = currentKey.length - 1; i >= 0; i--) {
        if (currentKey[i] === '-') {
          newKey = currentKey.slice(0, i)
          break
        }
      }
      setCurrentKey(newKey)
    }
  }
  
  function handleClick(coord: Coordinate) {
    // const coord = getCoordinate(e, cellWidth)
    const y = coord[0], x = coord[1]
    if (problem[y][x] !== '.') {
      return
    }

    if (selfPlay) {
      const newProblem = playMoveAndReturnNewBoard(problem, coord, color)
      if (_.isEqual(newProblem, problem)) {
        return
      }
      const key = String(y * lines + x)
      const newKey = currentKey + '-' + key
      setCurrentKey(newKey)
      addHistory(problem, color)
      setProblem(newProblem)
      color === 'b'? setColor('w') : setColor('b')

    } else {
      const key = String(y * lines + x)
      if (variations[currentKey].includes(key)) {
        const newProblem = playMoveAndReturnNewBoard(problem, coord, color)
        setProblem(newProblem)
        const newKey = currentKey + '-' + key
        setCurrentKey(newKey)
        response(newProblem, newKey)
      } else {
        alert('wrong')
        setWrong(wrong + 1)
      }
    }
  }

  function response(board: Board, key: string) {
    if (variations[key].length > 0) {
      const random = makeRandomNumber(variations[key].length)
      const r = Number(variations[key][random])
      const y = Math.floor(r / lines), x = r % lines
      const coord: Coordinate = [y, x]
      const newProblem = playMoveAndReturnNewBoard(board, coord, color === 'b'? 'w' : 'b')
      const newKey = key + '-' + String(r)
      setCurrentKey(newKey)
      setProblem(newProblem)
      // if (variations[newKey].length === 0) {
      //   alert('wrong')
      //   setWrong(wrong + 1)
      // }
    } else {
      alert('correct')
    }
  }

  function changeMode() {
    setSelfPlay(!selfPlay)
    reset()
  }

  function modifyVariations() {
    if (creator !== username) {
      alert("권한이 없습니다.")
      return
    } else {
      setVariationMode(!variationMode)
    }
  }

  function remove() {
    removeProblem(id)
    movePage("/home")
  }

  function changeProblem(idx: number) {
    if (idx < 0 || idx >= problemCount) {
      alert("there is no problem")
      return
    }
    problemStore.dispatch(setProblemIndex(idx))
    setIndex(idx)
  }


  return (
    <Box display="flex">
      <Box
        sx={{
          flex: isMobile ? undefined : `0 0 200px`,
          mr: isMobile ? '0' : '1ch',
          width: 300
        }}
      >
        {info}
        <Box textAlign="center">
          {variationMode? <></> : 
            <>
              <Grid>
                <Button onClick={reset}>reset</Button>
              </Grid>
              <Grid margin={5}>
                <Button onClick={changeMode}>{selfPlay? 'try' : 'practice'}</Button>
                {selfPlay? <Button onClick={goToPreviousMove}>previous</Button> : <></>}
              </Grid>
            </>
          }
          <Grid>
            {creator === username? 
            <Box>
              <Button onClick={modifyVariations}>{variationMode? "return problem" : "modify variations"}</Button> 
              {variationMode? <></> : <Button sx={{mt: 5}} onClick={remove}>remove problem</Button>}
            </Box>: 
            <></>}
          </Grid>
        </Box>
      </Box>
      {variationMode? <MakingVariations problemInfo={problemInfo}></MakingVariations> :
      <>
        {board}
        <Box display="grid" sx={{height: 200}}>
          <Button onClick={() => changeProblem(index - 1)}>previous problem</Button>
          <Button onClick={() => changeProblem(index + 1)}>next problem</Button>
        </Box>
      </>}
    </Box>
  )

}
