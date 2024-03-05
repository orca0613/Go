
import { CSSProperties, useEffect, useRef } from 'react';
import { Coordinate } from '../../util/types';
import { flowerPointPosition } from '../../util/constants';

interface BoardProps {
  boardWidth: number
  lines: number
  cellSize: number
  offset: number
  lineWidth: number
  style?: CSSProperties
}

const EmptyBoard = ({ lines, cellSize, offset, lineWidth, style, boardWidth}: BoardProps) => {

  const starPoints = flowerPointPosition[lines - 1]
  const starPointSize = Math.min(5, cellSize / 10)
  const canvasRef = useRef<HTMLCanvasElement>(null);

  function drawLine(ctx: CanvasRenderingContext2D, c1: Coordinate, c2: Coordinate, color: string) {

    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth
    ctx.beginPath();
    ctx.moveTo(c1[0], c1[1]);
    ctx.lineTo(c2[0], c2[1]);
    ctx.stroke();
  }

  function drawCircle(ctx: CanvasRenderingContext2D, size: number, coordinate: Coordinate, color: string) {
    const x = cellSize * (coordinate[0]) + offset;
    const y = cellSize * (lines - 1 - coordinate[1]) + offset;

    ctx.fillStyle = color === 'b'? 'black' : 'gray';
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');

    if (ctx && canvas) {

      canvas.width = boardWidth;
      canvas.height = boardWidth;

      for (let i = offset; i < boardWidth; i += cellSize) {
        // Draw vertical line
        drawLine(ctx, [i, offset], [i, canvas.height - offset], 'black')
        // Draw horizontal line
        drawLine(ctx, [offset, i], [canvas.width - offset, i], 'black')
      }

      // Draw star points
      starPoints.forEach((point) => {
        drawCircle(ctx, starPointSize, point, 'b')
      })
    }
  }, [lines, boardWidth]);

  return (
    <canvas id="empty-board" ref={canvasRef} style={style} ></canvas>
  );
};

export default EmptyBoard