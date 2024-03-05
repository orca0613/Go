
import { CSSProperties, useEffect, useRef } from 'react';


interface BackgroundProps {
  boardWidth: number 
  lines: number 
  style?: CSSProperties 
}

const Background = ({ boardWidth, lines, style}: BackgroundProps) => {

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
  
    if (ctx && canvas) {
  
      canvas.width = boardWidth;
      canvas.height = boardWidth;
  
      const img = new Image()
      img.src = "/images/wood4.jpg"
      img.onload = function() {
        ctx.drawImage(img, 0, 0, boardWidth, boardWidth)
      }
    } 
  }, [lines, boardWidth])

  

  return (
    <canvas id="empty-board" ref={canvasRef} style={style} ></canvas>
  );
};

export default Background
