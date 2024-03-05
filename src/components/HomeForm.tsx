
import { Button, Typography } from '@mui/material'
import { menuWords } from '../util/menuWords'
import { LANGUAGE_IDX, USERINFO, initialUserInfo } from '../util/constants'
import { UserInfo } from '../util/types'
import { useEffect, useState } from 'react'

export function HomeForm() {

  const userInfo: UserInfo = JSON.parse(localStorage.getItem(USERINFO) || initialUserInfo)
  const [username, setUsername] = useState(userInfo.name)
  const languageIdx = Number(localStorage.getItem(LANGUAGE_IDX))

  useEffect(() => {
    const newUserInfo: UserInfo = JSON.parse(localStorage.getItem(USERINFO) || initialUserInfo)
    setUsername(newUserInfo.name)
  }, [userInfo])


  return (
    <>
      <Typography variant='h3' sx={{margin: 3, fontWeight: "bold"}}>{menuWords.welcome[languageIdx]} {username}</Typography>
    </>
  )
}
