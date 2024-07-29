import { Box } from "@mui/system";
import { Board, Coordinate } from "../../util/types/types";
import Background from "./Background";
import EmptyBoard from "./EmptyBoard";
import Stones from "./Stones";

interface FinalBoardProps {
  lines: number
  boardWidth: number
  board: Board
  moves?: string
  variations?: string[]
  answers?: string[]
  questions?: string[]
  onClick?: (c: Coordinate) => void,
}

function FinalBoard({lines, boardWidth, board, moves, variations, answers, questions, onClick}: FinalBoardProps) {

  const offset = boardWidth / 200
  const cellSize = (boardWidth - (offset * 2)) / lines
  const stoneSize = cellSize / 2.1
  const lineWidth = boardWidth / 400

    return (
      <Box sx={{position: "relative", width: boardWidth, height: boardWidth}}>
        <Background
          boardWidth={boardWidth}
          lines={lines}
          style={{position: "absolute", left: 0, top: 0, zIndex: 0}}
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
          board={board}
          lines={lines}
          cellSize={cellSize}
          stoneSize={stoneSize}
          offset={offset}
          lineWidth={lineWidth}
          style={{position: "absolute", left: 0, top: 0, zIndex: 2}}
          moves={moves}
          variations={variations}
          answers={answers}
          questions={questions}
          onClick={onClick}
        >

        </Stones>
      </Box>
    );
  }

export default FinalBoard
