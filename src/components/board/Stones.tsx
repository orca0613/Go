
import _ from 'lodash';
import { RefObject, useEffect } from 'react';
import { resolution } from '../../util/constants';
import { divmod } from '../../util/functions';
import { Board, Coordinate } from '../../util/types';


interface StonesTestProps {
  size: number
  board: Board
  lines: number
  cellSize: number
  stoneSize: number
  lineWidth: number
  lineGap: number
  moves?: string
  variations?: string[]
  answers?: string[]
  questions?: string[]
  onClick?: (c: Coordinate) => void
  canvasRef: RefObject<HTMLCanvasElement>;
}

const Stones = ({
  size,
  board,
  lines,
  cellSize,
  stoneSize,
  lineWidth,
  lineGap,
  moves,
  variations,
  answers,
  questions,
  onClick,
  canvasRef
}: StonesTestProps) => {
  const answerColor = "green"
  const wrongColor = "red"
  const questionColor = "blue"

  function handleClick(e: React.MouseEvent) {
    const canvas = canvasRef.current
    if (onClick && canvas) {
      const rect = canvas.getBoundingClientRect()
      const x = Math.floor((e.clientX - rect.left) / cellSize)
      const y = Math.floor((e.clientY - rect.top) / cellSize)
      onClick([y, x])
    }
  }

  function drawCircle(ctx: CanvasRenderingContext2D, size: number, coordinate: Coordinate, color: string) {
    const y = cellSize * (coordinate[0]) + lineGap;
    const x = cellSize * (coordinate[1]) + lineGap;

    ctx.fillStyle = color;
    ctx.lineWidth = lineWidth
    ctx.strokeStyle = 'black'
    ctx.stroke()
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawMoveNumber(ctx: CanvasRenderingContext2D, coord: Coordinate, color: string, moveNumber: string) {
    const x = cellSize * coord[1] + lineGap;
    const y = cellSize * coord[0] + lineGap + stoneSize / 3;

    ctx.font = `normal normal bolder ${stoneSize}px sans-serif`;
    ctx.fillStyle = color === 'b' ? 'white' : 'black';
    ctx.textAlign = "center";
    ctx.fillText(moveNumber, x, y)
  }


  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');

    if (ctx && canvas) {

      const canvasSize = size + "px"

      canvas.style.width = canvasSize
      canvas.style.height = canvasSize

      canvas.width = size * resolution;
      canvas.height = size * resolution;


      ctx.scale(resolution, resolution)

      // Draw stones
      for (let i = 0; i < lines; i++) {
        for (let j = 0; j < lines; j++) {
          if (board[i][j] === 'b') {
            drawCircle(ctx, stoneSize, [i, j], 'black')
          } else if (board[i][j] === 'w') {
            drawCircle(ctx, stoneSize, [i, j], 'white')
          }
        }
      }

      // Draw move numbers
      if (moves) {
        const positions = moves.split('-').splice(1).reverse()
        let len = positions.length + 1
        const s = new Set()
        positions.map(position => {
          len -= 1
          if (_.isEqual(position, "p")) {
            return
          }
          const coord = divmod(Number(position), lines)
          const y = coord[0], x = coord[1]
          if (s.has(position) || board[y][x] === '.') {
            return
          }
          s.add(position)
          drawMoveNumber(ctx, coord, board[y][x], String(len))
        })
      }

      //Draw variations points

      if (variations) {
        variations.map(position => {
          const coord = divmod(Number(position), lines)
          drawCircle(ctx, stoneSize / 3, coord, wrongColor)
        })
      }

      if (answers) {
        answers.map(position => {
          const coord = divmod(Number(position), lines)
          drawCircle(ctx, stoneSize / 3, coord, answerColor)
        })
      }

      if (questions) {
        questions.map(position => {
          const coord = divmod(Number(position), lines)
          drawCircle(ctx, stoneSize / 3, coord, questionColor)
        })
      }

      ctx.stroke()
    }
  }, [board, size, lines, variations, answers, questions, moves]);

  return (
    <div style={{ width: size, height: size }}>
      <canvas
        id="stones"
        ref={canvasRef}
        style={{ position: "absolute", left: 0, top: 0, zIndex: 2 }}
        onClick={handleClick}
      />
    </div>
  );
};

export default Stones

