import { Box } from "@mui/material";
import { Coordinate } from "./types";


interface GoStoneProps{
  size: number;
  color: string;
  // example: [16, 4] is star point in upper right corner
  coord: Coordinate; // [x, y] 
  borderWidth?: number;
}

export function GoStone({ size, coord, color, borderWidth = 1}: GoStoneProps) {
  return (
    <Box
      sx={{
        position: 'absolute',
        left: `${(coord[0] - 1) * size}px`,
        top: `${(coord[1] - 1) * size}px`,
        height: size - borderWidth,
        width: size - borderWidth,
        backgroundColor: color,
        borderStyle: "solid",
        borderRadius: "50%",
        borderWidth: `${borderWidth}px`,
      }}
    />
  )
}
