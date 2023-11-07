import { FlowerPoint } from "./FlowerPoint";
import { GoBoard } from "./GoBoard";
import { GoStone } from "./GoStone";
import { flowerPointPosition } from "./constants";
import { Board, Coordinate } from "./types";


interface GoPositionProps {
  cellWidth: number;
  lines: number;
  board: Board;
}

export function GoPosition(props: GoPositionProps) {
  const cellWidth = props.cellWidth
  const lines = props.lines
  const board = props.board
  const flowerPoints = flowerPointPosition[lines]
  return (
    <GoBoard cellWidth={cellWidth} lines={lines}>
      {flowerPoints.map(coord => {
        const y = coord[0], x = coord[1]
        if (board[y][x] === '.') {
          return (
            <FlowerPoint cellWidth={cellWidth} coord={coord} key={'flower-point' + y + ',' + x}></FlowerPoint>
          )
        }
      })}

      {board.map((row, rowIndex) => (
        row.map((col, colIndex) => (
          board[rowIndex][colIndex] !== '.'?
          <GoStone
            cellWidth={cellWidth}
            color={board[rowIndex][colIndex]}
            coord={[rowIndex, colIndex]}
            key={rowIndex + ',' + colIndex}
          /> : <></>
        ))
      ))}
    </GoBoard>
  )
}