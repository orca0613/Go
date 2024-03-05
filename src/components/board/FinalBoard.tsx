import { Box } from "@mui/system";
import { Board, Coordinate } from "../../util/types";
import EmptyBoard from "./Board";
import Background from "./Background";
import Stones from "./Stones";


interface FinalBoardTestProps {
  lines: number
  boardWidth: number
  board: Board
  moves?: string
  variations?: string[]
  answers?: string[]
  questions?: string[]
  onClick?: (c: Coordinate) => void
}

function FinalBoardTest({lines, boardWidth, board, moves, variations, answers, questions, onClick}: FinalBoardTestProps) {
  const offset = boardWidth / (lines * 1.8)
  const cellSize = Math.max(boardWidth - offset * 2, 0) / (lines - 1)
  const stoneSize = cellSize / 2.2
  const lineWidth = boardWidth / 400  

    return (
      <Box sx={{position: "relative", width: boardWidth}}>
        <Background
          boardWidth={boardWidth}
          lines={lines}
          style={{position: "absolute", left:0, top: 0, zIndex: 0}}
        />
        <EmptyBoard
          boardWidth={boardWidth}
          lines={lines}
          cellSize={cellSize}
          offset={offset}
          lineWidth={lineWidth}
          style={{position: "absolute", left: 0, top: 0, zIndex: 1}}
        />
        <Stones
          boardWidth={boardWidth}
          lines={lines}
          cellSize={cellSize}
          stoneSize={stoneSize}
          offset={offset}
          lineWidth={lineWidth}
          board={board}
          style={{position: "absolute", left: 0, top: 0, zIndex: 2}}
          moves={moves}
          variations={variations}
          answers={answers}
          questions={questions}
          onClick={onClick}
        />
      </Box>
    );
  }

export default FinalBoardTest
