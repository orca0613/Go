import { Box, Button, Pagination, Stack } from "@mui/material"
import { LANGUAGE_IDX, TRIED, sampleBoardSize } from "../../util/constants"
import SampleProblem from "./SampleProblem"
import { useNavigate } from "react-router-dom"
import problemStore from "../../redux/problemStore"
import { setProblemIndex, setProblemList } from "../../redux/actions"
import { ProblemInfo } from "../../util/types"
import { ChangeEvent, useState } from "react"
import { isInLocalStorage } from "../../util/functions"
import { menuWords } from "../../util/menuWords"

interface SampleProblemBoxProps {
  problems: ProblemInfo[]
}

export default function SampleProblemBox({ problems }: SampleProblemBoxProps) {
  const navigate = useNavigate()
  const languageIdx = Number(localStorage.getItem(LANGUAGE_IDX))
  const num = 30
  const [start, setStart] = useState(0)
	const movePage = (address: string) => {
		navigate(address)
  }

  function setIdexAndOpenProblem(index: number, problemId: string) {
    if (Number(localStorage.getItem("userPoint")) <= 0 && !isInLocalStorage(TRIED, problemId)) {
      alert(menuWords.pointWarning[languageIdx])
      return
    } else {
      problemStore.dispatch(setProblemIndex(start + index))
      movePage(`/problem/${problemId}`)
    }
  }

  function handleChange(event:ChangeEvent<unknown>, val: number) {
    setStart(num * (val - 1))
  }

  
  problemStore.dispatch(setProblemList(problems))
  


  return (
    <Box>
      <Box sx={{display: "flex", flexWrap: "wrap", maxWidth: 1000}}>
        {
          problems.slice(start, Math.min(start + num, problems.length)).map((problem, index) => {
            return (
              <Box 
              key={index}
              component="div"
              onClick={() => setIdexAndOpenProblem(index, problem._id)}>
                <SampleProblem sampleProblem={problem} key={index}></SampleProblem>
              </Box>
            )
          })
        }
      </Box>
      <Stack spacing={2}>
        <Pagination 
        count={Math.ceil(problems.length / num)} 
        onChange={handleChange}
        color="primary"
        />
      </Stack>
    </Box>
  )
}