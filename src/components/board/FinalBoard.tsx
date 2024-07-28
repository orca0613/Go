import { Box } from "@mui/system";
import { Board, Coordinate } from "../../util/types";
import EmptyBoard from "./EmptyBoard";
import Stones from "./Stones";
import { GoBoardSpecs } from "./goBoardSpecs";
import { useRef } from "react";

interface FinalBoardProps {
  lines: number
  size: number
  board: Board
  moves?: string
  variations?: string[]
  answers?: string[]
  questions?: string[]
  onClick?: (c: Coordinate) => void
}

function FinalBoard({ lines, size, board, moves, variations, answers, questions, onClick }: FinalBoardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const goBoardSpecs = new GoBoardSpecs(size, lines);

  return (
    <Box sx={{ position: "relative", width: size, height: size }}>
      <EmptyBoard canvasRef={canvasRef} {...goBoardSpecs.getAllSpecs()} />
      <Stones
        {...goBoardSpecs.getAllSpecs()}
        canvasRef={canvasRef}
        board={board}
        moves={moves}
        variations={variations}
        answers={answers}
        questions={questions}
        onClick={onClick}
      />
    </Box>
  );
}

export default FinalBoard
