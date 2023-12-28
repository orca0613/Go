
import { CSSProperties, useEffect, useRef } from 'react';


interface BoardProps {
  boardWidth: number 
  lines: number
  cellSize: number
  offset: number
  style?: CSSProperties
}

const Background = ({ boardWidth, lines, cellSize, offset, style}: BoardProps) => {

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
  
    if (ctx && canvas) {
  
      canvas.width = cellSize * (lines - 1) + offset * 2;
      canvas.height = cellSize * (lines - 1) + offset * 2;
  
      const img = new Image()
      img.src = "../../public/images/wood4.jpg"
      img.onload = function() {
        ctx.drawImage(img, 0, 0, boardWidth, boardWidth)
      }
    } 
  }, [lines])

  

  return (
    <canvas id="empty-board" ref={canvasRef} style={style} ></canvas>
  );
};

export default Background