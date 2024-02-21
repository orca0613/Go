import { Box, Button, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { menuWords } from '../util/menuWords'
import { getUserDetail } from '../network/userDetail'
import { settingUserDetail } from '../util/functions'
import { logIn } from '../network/user'
import { LANGUAGE_IDX } from '../util/constants'

export function Login() {
	const navigate = useNavigate()
	const movePage = (address: string) => {
		navigate(address)
}
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const languageIdx = Number(localStorage.getItem(LANGUAGE_IDX))

  const inputEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
  }

  const inputPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
  }

  useEffect(() => {
    if (name) {
      const detail = getUserDetail(name)
      if (detail) {
        detail.then(r => {
          settingUserDetail(r)
        })
      }
      movePage("/home")
    }
  }, [name])

  async function logInAndSetting() {
    const username = await logIn(email, password)
    if (username.length > 0) {
      setName(username)
    }
  }

  return (
    <>
      <Box sx={{mt: 3}} textAlign="center">
        <Box>
          <TextField 
            sx={{margin: 3, width: 250}}
            name='email'
            label={menuWords.eMail[languageIdx]} 
            variant='standard'
            value={email}
            onChange={inputEmailChange}
          />
        </Box>

        <Box>
          <TextField 
            sx={{margin: 3, width: 250}}
            name='password'
            type='password'
            label={menuWords.password[languageIdx]} 
            variant='standard'
            value={password}
            onChange={inputPasswordChange}
          />
        </Box>

        <Box sx={{margin: 3}}>
          <Button onClick={logInAndSetting}>{menuWords.login[languageIdx]}</Button>
          <Button onClick={() => movePage('signup')}>{menuWords.signup[languageIdx]}</Button>
        </Box>
      </Box>
    </>
  )
}