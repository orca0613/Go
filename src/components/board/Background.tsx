
import { CSSProperties, useEffect, useRef } from 'react';
import { resolution } from '../../util/constants';


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
  
      const canvasSize = boardWidth + "px"

      canvas.style.width = canvasSize
      canvas.style.height = canvasSize

      canvas.width = boardWidth * resolution;
      canvas.height = boardWidth * resolution;


      ctx.scale(resolution, resolution)
  
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
