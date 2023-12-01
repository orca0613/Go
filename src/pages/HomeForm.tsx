
import { Typography } from '@mui/material'
import { USER_NAME } from '../util/constants'

export function HomeForm() {
  const username = localStorage.getItem(USER_NAME)

  return (
    <>
      <Typography variant='h3' sx={{margin: 3, fontWeight: "bold"}}>Welcome {username}</Typography>
    </>
  )
}
