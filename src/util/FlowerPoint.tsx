import { Box } from "@mui/material";
import { Coordinate } from "./types";



interface FlowerPointProps{
  cellWidth: number;
  coord: Coordinate
  borderWidth?: number;
}

export function FlowerPoint({ cellWidth, coord, borderWidth = 1}: FlowerPointProps) {
  const pointSize = cellWidth / 20
  return (
    <Box
      sx={{
        position: 'absolute',
        left: `${(coord[1]) * cellWidth + cellWidth / 2 - pointSize / 2}px`,
        top: `${(coord[0]) * cellWidth + cellWidth / 2 - pointSize / 2}px`,
        height: pointSize,
        width: pointSize,
        backgroundColor: "black",
        borderStyle: "solid",
        borderRadius: "50%",
        borderWidth: `${borderWidth}px`,
      }}
      key={'flower-point'}
    />
  )
}
