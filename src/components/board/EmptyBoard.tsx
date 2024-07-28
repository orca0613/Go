import { useCallback, useEffect, RefObject } from 'react';
import { Coordinate } from '../../util/types';
import { resolution } from '../../util/constants';
import { flowerPointPosition } from '../../util/initialForms';

interface EmptyBoardProps {
  size: number;
  lines: number;
  lineWidth: number;
  lineGap: number;
  cellSize: number;
  starPointSize: number;
  canvasRef: RefObject<HTMLCanvasElement>;
}

export function EmptyBoard({
  lines,
  size,
  lineWidth,
  cellSize,
  starPointSize,
  lineGap,
  canvasRef,
}: EmptyBoardProps) {

  const starPoints = flowerPointPosition[lines - 1]

  const drawBackground = useCallback(
    (context: CanvasRenderingContext2D) => {
      const image = new Image();
      image.src = "/images/wood4.jpg";
      image.width = size;
      image.height = size;
      image.onload = () => {
        context.drawImage(image, 0, 0, image.width, image.height);
      };
    },
    [size],
  );

  const drawLine = useCallback(
    (ctx: CanvasRenderingContext2D, c1: Coordinate, c2: Coordinate) => {
      ctx.strokeStyle = "black";
      ctx.lineWidth = lineWidth;
      ctx.beginPath();
      ctx.moveTo(c1[0], c1[1]);
      ctx.lineTo(c2[0], c2[1]);
      ctx.stroke();
    },
    [lineWidth],
  );

  const drawCircle = useCallback(
    (ctx: CanvasRenderingContext2D, size: number, c: Coordinate) => {
      const x = cellSize * c[0] + lineGap;
      const y = cellSize * (lines - 1 - c[1]) + lineGap;

      ctx.fillStyle = "black";
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    },
    [cellSize, lineGap, lines],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (ctx && canvas) {
      canvas.style.width = size + "px";
      canvas.style.height = size + "px";

      canvas.width = size * resolution;
      canvas.height = size * resolution;

      ctx.scale(resolution, resolution);

      for (let i = lineGap; i < size; i += cellSize) {
        // Draw vertical line
        drawLine(ctx, [i, lineGap], [i, size - lineGap]);
        // Draw horizontal line
        drawLine(ctx, [lineGap, i], [size - lineGap, i]);
      }

      starPoints.forEach((point) => {
        drawCircle(ctx, starPointSize, point);
      });

      // Draw background under all other layers
      ctx.globalCompositeOperation = "destination-over";
      drawBackground(ctx);
    }
  }, [
    lines,
    size,
    cellSize,
    lineGap,
    starPointSize,
    drawCircle,
    drawLine,
    drawBackground,
  ]);

  return <canvas ref={canvasRef} width={size} height={size} />;
};

export default EmptyBoard