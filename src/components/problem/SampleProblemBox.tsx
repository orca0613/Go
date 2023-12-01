import { ProblemInfo } from "../../util/types"
import { Box } from "@mui/material"
import { sampleBoardSize } from "../../util/constants"
import SampleProblem from "./SampleProblem"
import { useNavigate } from "react-router-dom"
import problemStore from "../../store/problemStore"
import { setProblemIndex } from "../../redux/actions"

export default function SampleProblemBox() {
  const problems = problemStore.getState().problemList
  const navigate = useNavigate()
	const movePage = (address: string) => {
		navigate(address)
  }

  function setIdexAndOpenProblem(index: number) {
    problemStore.dispatch(setProblemIndex(index))
    movePage("/problem-page")
  }
  


  return (
    <Box sx={{display: "flex", flexWrap: "wrap", maxWidth: 800}}>
      {
        problems.map((problem, index) => {
          return (
            <Box 
            sx={{mb: 16, width: sampleBoardSize + 16}} 
            key={index}
            component="div"
            onClick={() => setIdexAndOpenProblem(index)}>
              <SampleProblem sampleProblem={problem} key={index}></SampleProblem>
            </Box>
          )
        })
      }
    </Box>
  )
}