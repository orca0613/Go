import { Box } from "@mui/system";
import EmptyBoard from "./Board";
import { Board, Coordinate } from "../util/types";
import Stones from "./Stones";
import Background from "./Background";

interface TestProblemProps {
  lines: number
  boardWidth: number
  board: Board
  moves?: string
  onClick?: (c: Coordinate) => void
}

function TestProblem({lines, boardWidth, board, moves, onClick}: TestProblemProps) {
  const cellSize = Math.round(boardWidth / (lines - 1)) // size of 1 space (width = height)
  const stoneSize = Math.round(cellSize / 2)
  const offset = Math.round(stoneSize * 1.2) + 2
  const lineWidth = boardWidth / 400
  boardWidth += (offset * 4) // total board size (width = height)

    return (
      <Box sx={{m: "5rem", position: "relative"}}>
        <Background
          boardWidth={boardWidth}
          lines={lines}
          cellSize={cellSize}
          offset={offset}
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
          lines={lines}
          cellSize={cellSize}
          stoneSize={stoneSize}
          offset={offset}
          lineWidth={lineWidth}
          board={board}
          style={{position: "absolute", left: 0, top: 0, zIndex: 2}}
          moves={moves}
          onClick={onClick}
        />
      </Box>
    );
  }
  
  export default TestProblem;