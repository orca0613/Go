import { Box, Typography } from "@mui/material";


interface ReplyProps {
  name: string
  date: string
  comment: string
}
export function Reply({ name, comment, date }: ReplyProps) {

  return (
    <Box>
      <Typography sx={{
        color: "steelblue",
        fontSize: 20,
        fontWeight: 300,
      }}>{name}</Typography>
      <Typography sx={{
        fontSize: 10,
        fontWeight: 50,
      }}>{date}</Typography>
      <Typography sx={{
        fontSize: 20,
        fontWeight: 300,
      }}>{comment}</Typography>
    </Box>
  )
}