import { Box } from "@mui/material";
import { Coordinate } from "./types";



interface AnswerPointProps{
  cellWidth: number;
  coord: Coordinate;
  borderWidth?: number;
}

export function AnswerPoint({ cellWidth, coord, borderWidth = 1}: AnswerPointProps) {
  const pointSize = cellWidth / 5
  return (
    <Box
      sx={{
        position: 'absolute',
        left: `${(coord[1]) * cellWidth + cellWidth / 2 - pointSize / 2}px`,
        top: `${(coord[0]) * cellWidth + cellWidth / 2 - pointSize / 2}px`,
        height: pointSize,
        width: pointSize,
        backgroundColor: "green",
        borderStyle: "solid",
        borderRadius: "50%",
        borderWidth: `${borderWidth}px`,
      }}
      key={'flower-point'}
    />
  )
}
