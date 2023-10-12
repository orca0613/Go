import { Box } from "@mui/material";
import { Coordinate } from "./types";



interface GoStoneProps{
  cellWidth: number;
  color: string;
  // example: [16, 4] is star point in upper right corner
  coord: Coordinate
  borderWidth?: number;
}

export function GoStone({ cellWidth, coord, color, borderWidth = 1}: GoStoneProps) {
  color = color === 'b'? 'black' : 'white'
  return (
    <Box
      sx={{
        position: 'absolute',
        left: `${(coord[1]) * cellWidth}px`,
        top: `${(coord[0]) * cellWidth}px`,
        height: cellWidth - borderWidth,
        width: cellWidth - borderWidth,
        backgroundColor: color,
        borderStyle: "solid",
        borderRadius: "50%",
        borderWidth: `${borderWidth}px`,
      }}
    />
  )
}
