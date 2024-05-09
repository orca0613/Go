import { CSSProperties } from "react";

interface BackgroundProps {
  boardWidth: number 
  lines: number 
  style?: CSSProperties
}

const Background = ({ boardWidth, style}: BackgroundProps) => {

  return (
    <img src="/images/wood4.jpg"
    style={style}
    alt="black" width={boardWidth} height={boardWidth}/>
  );
};

export default Background
