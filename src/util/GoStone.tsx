import { Box } from "@mui/material";
import { Coordinate } from "./types";



interface GoStoneProps{
  cellWidth: number;
  color: string;
  // example: [16, 4] is star point in upper right corner
  coord: Coordinate
  borderWidth?: number;
  stoneSize?: number
}

export function GoStone({ cellWidth, coord, color, borderWidth = 1, stoneSize = 1}: GoStoneProps) {
  color = color === 'b'? 'black' : 'white'
  const stoneWidth = (cellWidth - borderWidth) * stoneSize
  return (
    <Box
      sx={{
        position: 'absolute',
        left: `${(coord[1]) * cellWidth + (cellWidth - borderWidth - stoneWidth) / 2}px`,
        top: `${(coord[0]) * cellWidth + (cellWidth - borderWidth - stoneWidth) / 2}px`,
        height: stoneWidth,
        width: stoneWidth,
        backgroundColor: color,
        borderStyle: "solid",
        borderRadius: "50%",
        borderWidth: `${borderWidth}px`,
      }}
    />
  )
}
