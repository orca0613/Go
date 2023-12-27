
import React, { CSSProperties, useEffect, useRef } from 'react';
import { Board, Coordinate } from '../../util/types';
import { divmod } from '../../util/functions';
import _ from 'lodash';

interface StonesProps {
  lines: number
  cellSize: number
  stoneSize: number
  offset: number
  lineWidth: number
  board: Board
  style?: CSSProperties
  moves?: string // A value that links the positions of the moves played ex)"0-28-47-38"
  variations?: string[]
  answers?: string[]
  questions?: string[]
  onClick?: (c: Coordinate) => void
  
}

const Stones = ({ lines, cellSize, stoneSize, offset, lineWidth, board, style, moves, variations, answers, questions, onClick}: StonesProps) => {
  const numberSize = stoneSize
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scaledSize = (cellSize * (lines - 1) + offset * 2);
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
    const y = cellSize * (coordinate[0]) + 1 + offset;
    const x = cellSize * (coordinate[1]) + 1 + offset;

    ctx.fillStyle = color;
    ctx.lineWidth = lineWidth
    ctx.strokeStyle = 'black'
    ctx.stroke()
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawMoveNumber(ctx: CanvasRenderingContext2D, coord: Coordinate, color: string, moveNumber: string) {
    const x = cellSize * (coord[1]) + offset + 1;
    const y = cellSize * (coord[0]) + offset + 1 + numberSize / 3;

    ctx.font = `normal normal bolder ${stoneSize}px sans-serif`;
    ctx.fillStyle = color === 'b'? 'white' : 'black';
    ctx.textAlign = "center";
    ctx.fillText(moveNumber, x, y)


  }

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');

    if (ctx && canvas) {

      const scale = window.devicePixelRatio
    
      canvas.width = scaledSize * scale;
      canvas.height = scaledSize * scale;
      ctx.scale(scale, scale)
  
      canvas.width = cellSize * (lines - 1) + offset * 2;
      canvas.height = cellSize * (lines - 1) + offset * 2;

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
            console.log("shit")
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
  }, [board, moves, variations, answers]);
  
  return (
    <canvas id="stones" ref={canvasRef} style={style} onClick={handleClick}></canvas>
  );
};

export default Stones

