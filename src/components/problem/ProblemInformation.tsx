import { Box, Button, Divider, Typography } from "@mui/material";
import { useState } from "react";

const divider = <Divider orientation="horizontal" sx={{mt: 1, mb: 2 }} />

interface PIProps {
  creator: string
  level: number
  comment: string
  color: string
}

export function ProblemInformation({ color, creator, level, comment }: PIProps) {
  const turn = color === "b"? "BLACK" : "WHITE"
  const [like, setLike] = useState(false)
  const [dislike, setDislike] = useState(false)
  return (
    <Box sx={{margin: 3}}>
      <Typography mb="0.5ch" variant="h6">{turn}</Typography>
      {divider}
      <Typography mb="0.5ch" variant="h6">creator: {creator}</Typography>
      {divider}
      <Typography mb="0.5ch" variant="h6">level: {level > 0? `${level}K` : `${Math.abs(level)}D`}</Typography>
      {divider}
      <Typography mb="0.5ch" variant="body1">{comment}</Typography>
      {divider}
      <Box sx={{alignItems: "center"}}>
        <Button sx={{color: like? "green" : "black"}} onClick={() => setLike(!like)}>like</Button>
        <Button sx={{color: dislike? "red" : "black"}} onClick={() => setDislike(!dislike)}>dislike</Button>
      </Box>
      {divider}
    </Box>
  )
}