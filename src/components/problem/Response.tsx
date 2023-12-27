import { useEffect, useState } from "react"
import { getQuestion } from "../../util/network"
import { Box } from "@mui/material"
import { Request } from "../problem/Request"
import { sampleBoardSize } from "../../util/constants"

interface ResponseProps {
  problemId: string
}

export function Response({ problemId }: ResponseProps) {
  const [requests, setRequests] = useState<string[]>([])

  useEffect(() => {
    const newRequests = getQuestion(problemId)
    newRequests.then(r => {
      setRequests(r)
    })
  }, [problemId])
  console.log("requests: ", requests)

  return (
    <Box>
      {requests.length > 0? 
    <Box sx={{display: "flex", flexWrap: "wrap", maxWidth: 200}}>
    {
      requests.map((request, index) => {
        return (
          <Box 
          sx={{mb: 16, width: sampleBoardSize + 16}} 
          key={index}
          component="div">
            <Request problemId={problemId} question={request}></Request>
          </Box>
        )
      })
    }
  </Box>
      : <></>}
    </Box>
  )
}