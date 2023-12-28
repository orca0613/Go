import { sampleBoardSize } from "../../util/constants"
import { convertFromStringToTwoD } from "../../util/functions"
import FinalBoard from "../board/FinalBoard"

interface RequestProps {
  question: string
  problemId: string
}

export function Request({ question, problemId }: RequestProps) {
  const requestInfo = question.split("&")
  const board = convertFromStringToTwoD(requestInfo[0])
  const key = requestInfo[1]
  const lines = board.length
  const boardWidth = sampleBoardSize

  return (
    <FinalBoard
      lines={lines}
      board={board}
      boardWidth={boardWidth}
      moves={key} 
    />
  )
}
