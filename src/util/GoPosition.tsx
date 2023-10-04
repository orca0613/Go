import { GoBoard } from "./GoBoard";
import { GoStone } from "./GoStone";
import { Board } from "./types";


interface GoPositionProps {
  lineSpacing: number;
  lines: number;
  board: Board;
}

export function GoPosition({ lineSpacing, lines, board }: GoPositionProps) {
  return (
    <GoBoard spacingInPixels={lineSpacing} n={lines}>
      {board.map((row, rowIndex) => (
        row.map((col, colIndex) => (
          board[rowIndex][colIndex] !== '.'?
          <GoStone
            size={lineSpacing}
            color={board[rowIndex][colIndex]}
            coord={[rowIndex, colIndex]}
            key={rowIndex + ',' + colIndex}
          /> : <></>
        ))
      ))}
    </GoBoard>
  )
}