import { AnswerPoint } from "./AnswerPoint";
import { FlowerPoint } from "./FlowerPoint";
import { GoBoard } from "./GoBoard";
import { GoStone } from "./GoStone";
import { flowerPointPosition } from "./constants";
import { Board, Coordinate } from "./types";


interface GoPositionProps {
  cellWidth: number;
  lines: number;
  board: Board;
  answer?: number[]
}

export function GoPosition(props: GoPositionProps) {
  const cellWidth = props.cellWidth
  const lines = props.lines
  const board = props.board
  const answer = props.answer
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
      {/* {answer?.map(p => {
        const y = Math.floor(p / (lines + 1)), x = p % (lines + 1)
        return (
          <AnswerPoint cellWidth={lineSpacing} coord={[y, x]}></AnswerPoint>
        )
      })} */}

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