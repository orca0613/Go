import { useState } from 'react'
import { Board, BoardInfo, Coordinate, ProblemInfo } from '../../util/types'
import _ from 'lodash'
import { addVariations, playMoveAndReturnNewBoard, removeVariations, updateVariations } from '../../util/functions'
import { Box, Button, Divider, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, useMediaQuery } from '@mui/material'
import { boardWidth } from '../../util/constants'
import FinalBoard from '../board/FinalBoard'


interface MakingProps {
  problemInfo: ProblemInfo
}


export function MakingVariations(props: MakingProps) {
  
  // const [data, setData] = useState()
  // useEffect(() => {
  //   fetch("some-endpoint")
  //     .then((response) => response.json())
  //     .then((data) => {
  //       setData(data)
  //     })
  //     .catch(error => console.log(JSON.stringify(error)))
  // }, [])
  const problemId = props.problemInfo._id
  const initialState = props.problemInfo.initialState
  const N = initialState.length
  const [problem, setProblem] = useState(initialState)
  const [currentKey, setCurrentKey] = useState('0')
  const [color, setColor] = useState(props.problemInfo.color)
  const [variations, setVariations] = useState(props.problemInfo.variations)
  const [playable, setPlayable] = useState(variations[currentKey])
  const boardInfo = {
    board: problem,
    color: color,
  }
  const [history, setHistory] = useState([boardInfo])
  const [result, setResult] = useState(true)
  const divider = <Divider orientation="horizontal" sx={{mt: 1, mb: 2, borderColor: "white"}} /> 
  const isMobile = useMediaQuery("(max-width: 600px)")

  function addHistory(board: Board, color: string) {
    const newHistory: BoardInfo = {
      board: board,
      color: color
    }
    setHistory(history.concat([newHistory]))
  }

  function goToPreviousMove() {
    const newProblem = history.pop()
    if (newProblem === undefined) {
      return
    } else {
      setProblem(newProblem.board)
      setColor(newProblem.color)
      let newKey = currentKey
      for (let i = currentKey.length - 1; i >= 0; i--) {
        if (currentKey[i] === '-') {
          newKey = currentKey.slice(0, i)
          break
        }
      }
      setCurrentKey(newKey)
      setPlayable(variations[newKey])
    }

  }

  function addVariationsAndSetVariations() {
    const l = currentKey.split('-')
    if ((l.length % 2) && result) {
      alert('invalid result')
      return
    } else if (!(l.length % 2) && !result) {
      alert('invalid result')
      return
    }
    const newVariations = addVariations(currentKey, variations, l)
    setVariations(newVariations)
    alert("saved")
  }

  function removeVariationsAndSetVariations() {
    if (!variations.hasOwnProperty(currentKey) || variations[currentKey].length > 0) {
      alert('invalid condition')
      console.log(variations)
      return
    }
    const newVariations = removeVariations(currentKey, variations)
    setVariations(newVariations)
  }



  function handleClick(coord: Coordinate) {
    const y = coord[0], x = coord[1]
    const modified = String(y * N + x)
    const newProblem = playMoveAndReturnNewBoard(problem, coord, color)
    if (_.isEqual(newProblem, problem)) {
      return
    }

    addHistory(problem, color)
    const newKey = currentKey + '-' + modified
    setCurrentKey(newKey)
    setPlayable(variations[newKey])
    setProblem(newProblem)
    color === 'b' ? setColor('w') : setColor('b')
    console.log(newKey)
  }

  function reset() {
    setProblem(initialState)
    setColor(props.problemInfo.color)
    setCurrentKey('0')
    setPlayable(variations['0'])
    setHistory([boardInfo])
  }

  function handleResultChange(e: SelectChangeEvent) {
    const newResult = e.target.value
    newResult === "correct"? setResult(true) : setResult(false)
  }


  return (
    <>
      <Box
        sx={{
          display: 'flex',
          width: isMobile ? '100vw' : '800',
          flexDirection: isMobile ? 'column' : 'row',
          gap: isMobile ? '1ch' : 0,
        }}
      >
        <Box
        >
          <FinalBoard 
          lines={problem.length}
          board={problem}
          boardWidth={boardWidth}
          moves={currentKey}
          playable={playable}
          onClick={handleClick}
          />
        </Box>
        <Box
          textAlign="center"
          sx={{
            flex: isMobile ? undefined : `1 0 0px`,
            // mr: isMobile ? '0' : '1ch',
            mt: 3
          }}
        >
          <Button onClick={goToPreviousMove}>previous</Button>
          {divider}
          <Button onClick={addVariationsAndSetVariations}>add variations</Button>
          {divider}
          <Button onClick={() => updateVariations(problemId, variations)}>update variations</Button>
          {divider}
          <Button onClick={removeVariationsAndSetVariations}>remove variation</Button>
          {divider}
          <Button onClick={() => reset()}>reset</Button>
          {divider}
          <FormControl sx={{mt: 3, ml:2}}>
            <InputLabel id="result-select-label">result</InputLabel>
            <Select
              labelId="result-select-label"
              id="result-select"
              value={result? "correct" : "wrong"}
              label="result"
              variant='standard'
              onChange={handleResultChange}
            >
              <MenuItem value={"correct"}>correct</MenuItem>
              <MenuItem value={"wrong"}>wrong</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>
    </>
  )
}
