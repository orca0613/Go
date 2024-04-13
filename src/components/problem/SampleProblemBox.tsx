import { Box, useMediaQuery } from "@mui/material"
import { MARGIN, PAGE, PROBLEM_INDEX, problemsPerPage } from "../../util/constants"
import SampleProblem from "./SampleProblem"
import { useNavigate } from "react-router-dom"
import { ProblemInformation } from "../../util/types"
import { useWindowSize } from "react-use"

interface SampleProblemBoxProps {
  problems: ProblemInformation[]
  page: number
  request?: boolean
}

export default function SampleProblemBox({ problems, request, page}: SampleProblemBoxProps) {
  const navigate = useNavigate()
  const {width, height} = useWindowSize()
  const isMobile = useMediaQuery("(max-width: 700px)")
  // const isTablet = useMediaQuery("(min-width: 461px) and (max-width: 680px)")
	const movePage = (address: string) => {
		navigate(address)
  }

  function setIdexAndOpenProblem(index: number, problemIdx: number) {
    sessionStorage.setItem(PROBLEM_INDEX, String((page - 1) * problemsPerPage + index))
    sessionStorage.setItem(PAGE, String(page))
    movePage(`/${request? "modify" : "problem"}/${problemIdx}`)
  }

  return (
    <Box sx={{mt: MARGIN}}>
      <Box sx={{display: "flex", flexWrap: "wrap", justifyContent: problems.length < problemsPerPage? "" : "space-evenly"}}>
        {
          problems.map((problem, index) => {
            return (
              <Box 
              key={index}
              onClick={() => setIdexAndOpenProblem(index, problem.problemIndex)}>
                <SampleProblem 
                problem={problem} 
                boxWidth={isMobile? Math.floor((width - 30) / 2) : Math.floor((width - 30) / 4)} 
                boardWidth={isMobile? (width - 30) / 2.2 : (width - 30) / 4.4}
                key={index}></SampleProblem>
              </Box>
            )
          })
        }
      </Box>
    </Box>
  )
}