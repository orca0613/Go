import { Box, styled } from "@mui/material";

// The box holding just the board does not change, so we can define it here
const BoardBox = styled(Box)({
  backgroundImage: `url("images/wood4.jpg")`,
  height: "100%",
  width: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  position: "relative", // So that children position absolute can align correctly
})

interface GoBoardProps {
  lines: number;
  cellWidth: number;
  children?: React.ReactNode;
  // edgePadding?: number;
}

export function GoBoard(props: GoBoardProps) {
  const s = props.cellWidth;
  // const edgePadding = props.edgePadding ?? 5;
  // Board length is number of lines x space between, +1 px for line on both sides
  const boardLength = `${props.lines * s + 1}px`
  const boardBoxLength = `${(props.lines + 1) * s + 2}px`
  return (
    <Box sx={{ height: boardBoxLength, width: boardBoxLength }} key={'board'}>
      <BoardBox key={'board-box'}>
        <Box sx={{
          borderWidth: "1px",
          borderStyle: "solid",
          height: boardLength,
          width: boardLength,
          backgroundSize: `${s}px ${s}px`,
          backgroundImage: `linear-gradient(to right, black 1px, transparent 1px), 
          linear-gradient(to bottom, black 1px, transparent 1px)`,
          position: "absolute", // Important so children don't affect board position
        }} key={'cell'}/>
        {props.children}
      </BoardBox>
    </Box>
  )
}
