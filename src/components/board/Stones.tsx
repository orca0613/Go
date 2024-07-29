
import { CSSProperties, useEffect, useRef } from 'react';
import { Board, Coordinate, Variations } from '../../util/types/types';
import _ from 'lodash';
import { resolution } from '../../util/constants';
import { divmod } from '../../util/functions';


interface StonesTestProps {
  boardWidth: number
  board: Board
  lines: number
  cellSize: number
  stoneSize: number
  offset: number
  lineWidth: number
  style?: CSSProperties
  moves?: string
  variations?: string[]
  answers?: string[]
  questions?: string[]
  onClick?: (c: Coordinate) => void
}

const Stones = ({boardWidth, board, lines, cellSize, stoneSize, offset, lineWidth, style, moves, variations, answers, questions, onClick}: StonesTestProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gap = offset + cellSize / 2
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
    const y = cellSize * (coordinate[0]) + gap;
    const x = cellSize * (coordinate[1]) + gap;

    ctx.fillStyle = color;
    ctx.lineWidth = lineWidth
    ctx.strokeStyle = 'black'
    ctx.stroke()
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawMoveNumber(ctx: CanvasRenderingContext2D, coord: Coordinate, color: string, moveNumber: string) {
    const x = cellSize * coord[1] + gap;
    const y = cellSize * coord[0] + gap + stoneSize / 3;

    ctx.font = `normal normal bolder ${stoneSize}px sans-serif`;
    ctx.fillStyle = color === 'b'? 'white' : 'black';
    ctx.textAlign = "center";
    ctx.fillText(moveNumber, x, y)
  }


  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');

    if (ctx && canvas) {
  
      const canvasSize = boardWidth + "px"

      canvas.style.width = canvasSize
      canvas.style.height = canvasSize

      canvas.width = boardWidth * resolution;
      canvas.height = boardWidth * resolution;


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
  }, [board, boardWidth, lines, variations, answers, questions, moves]);
  
  return (
    <div style={{width: boardWidth, height: boardWidth}}>
      <canvas id="stones" ref={canvasRef} style={style} onClick={handleClick}></canvas>
    </div>
  );
};

export default Stones

