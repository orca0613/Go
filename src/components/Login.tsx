import { Box, Button, Checkbox, FormControlLabel, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { menuWords } from '../util/menuWords'
import { HOME, LANGUAGE_IDX, TOKEN, USERINFO } from '../util/constants'
import { useWindowSize } from 'react-use'
import CheckEmailDialog from './CheckEmailDialog'
import { getCookie, isValidEmail, saveLoginInfo } from '../util/functions'
import { useLoginMutation } from '../slices/userApiSlice'
import { UserInfo } from '../util/types/types'
import { initialUserInfo } from '../util/initialForms'

export function Login() {
	const navigate = useNavigate()
  const [login, { isLoading: loginLoading }] = useLoginMutation()

  const [email, setEmail] = useState(getCookie("email"))
  const [emailErrorMessage, setEmailErrorMessage] = useState("")
  const [saveInfo, setSaveInfo] = useState(Boolean(getCookie("saved")))
  const [password, setPassword] = useState(getCookie("pw"))
  const languageIdx = Number(localStorage.getItem(LANGUAGE_IDX))
  const {width, height} = useWindowSize()

  useEffect(() => {
    if (email && password && saveInfo) {
      logInAndSetting()
    }
  }, [])

  const inputEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value
    setEmail(newEmail)
    if (newEmail.includes(" ")) {
      setEmailErrorMessage(menuWords.spaceWarning[languageIdx])
    } else {
      setEmailErrorMessage("")
    }
  }

  const inputPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
  }

  async function logInAndSetting() {
    if (!isValidEmail(email)) {
      setEmailErrorMessage(menuWords.invalidEmailFormWarning[languageIdx])
      return
    }
    const data = {
      email: email,
      password: password
    }
    const res = await login(data).unwrap();
    if (!res) {
      return
    }
    const userInfo: UserInfo = JSON.parse(sessionStorage.getItem(USERINFO) || initialUserInfo)
    const newUserInfo: UserInfo = {
      ...userInfo,
      name: res.name,
      level: res.level,
      language: res.language,
    }
    localStorage.setItem(LANGUAGE_IDX, String(res.language))
    sessionStorage.setItem(USERINFO, JSON.stringify(newUserInfo))
    sessionStorage.setItem(TOKEN, res.token)
    saveLoginInfo(email, password, saveInfo)
    navigate(HOME)
  }

  return (
    <>
      <Box sx={{margin: "3%"}} textAlign="center" display="grid" justifyContent="center">
        <TextField 
        error={emailErrorMessage.length > 0}
        helperText={emailErrorMessage}
        sx={{height: height / 7, width: Math.min(width, 300)}}
        name='email'
        label={menuWords.eMail[languageIdx]} 
        variant='standard'
        value={email}
        onChange={inputEmailChange}
        />
        <TextField 
        sx={{height: height / 7, width: Math.min(width, 300)}}
        name='password'
        type='password'
        label={menuWords.password[languageIdx]} 
        variant='standard'
        value={password}
        onChange={inputPasswordChange}
        />
        <Button 
        variant='contained'
        color='info'
        sx={{height: height / 15, width: Math.min(width, 300), textTransform: "none"}}
        onClick={logInAndSetting}>
          {menuWords.login[languageIdx]}
        </Button>
        <FormControlLabel labelPlacement='start' control={<Checkbox checked={saveInfo} onChange={() => setSaveInfo(!saveInfo)}/>} label={menuWords.autoLogin[languageIdx]}/>

        <Box sx={{margin: 3}}>
          <Button sx={{color: "red", textTransform: "none"}} onClick={() => navigate('/signup')}>{menuWords.signup[languageIdx]}</Button>
          <CheckEmailDialog></CheckEmailDialog>
        </Box>
      </Box>
    </>
  )
}