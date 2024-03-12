
import { Button, Typography } from '@mui/material'
import { menuWords } from '../util/menuWords'
import { LANGUAGE_IDX, USERINFO, initialUserInfo } from '../util/constants'
import { UserInfo } from '../util/types'


export function HomeForm() {

  const userInfo: UserInfo = JSON.parse(sessionStorage.getItem(USERINFO) || initialUserInfo)
  const username = userInfo.name
  const languageIdx = Number(localStorage.getItem(LANGUAGE_IDX))

  return (
    <>
      <Typography variant='h3' sx={{margin: 3, fontWeight: "bold"}}>{menuWords.welcome[languageIdx]} {username}</Typography>
    </>
  )
}
