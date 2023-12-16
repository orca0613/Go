import { Box } from "@mui/system";
import EmptyBoard from "./Board";
import { Board, Coordinate } from "../../util/types";
import Stones from "./Stones";
import Background from "./Background";

interface TestProblemProps {
  lines: number
  boardWidth: number
  board: Board
  moves?: string
  variations?: string[]
  answers?: string[]
  onClick?: (c: Coordinate) => void
}

function FinalBoard({lines, boardWidth, board, moves, variations, answers, onClick}: TestProblemProps) {
  const cellSize = boardWidth < 200? boardWidth / (lines) : Math.round(boardWidth / (lines)) // size of 1 space (width = height)
  const stoneSize = boardWidth < 200? cellSize / 2.1 : Math.round(cellSize / 2.1)
  const offset = boardWidth < 200? stoneSize * 1.2 + 2 : Math.round(stoneSize * 1.2 + 2)
  const lineWidth = boardWidth / 400
  boardWidth += offset // total board size (width = height)

    return (
      <Box sx={{position: "relative", width: boardWidth, margin:1}}>
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
          variations={variations}
          answers={answers}
          onClick={onClick}
        />
      </Box>
    );
  }
  
  export default FinalBoard;