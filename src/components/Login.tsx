import { Box, Button, Checkbox, FormControlLabel, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { menuWords } from '../util/menuWords'
import { getUserDetail } from '../network/userDetail'
import { logIn } from '../network/user'
import { HOME, LANGUAGE_IDX, USERINFO, expires } from '../util/constants'
import { UserInfo } from '../util/types'
import { useWindowSize } from 'react-use'
import CheckEmailDialog from './CheckEmailDialog'
import { isValidEmail } from '../util/functions'
import { initialUserInfo } from '../util/initialForms'

export function Login() {
	const navigate = useNavigate()
	const movePage = (address: string) => {
		navigate(address)
  }

  function setCookie(name: string, val: string) {
    let date = new Date()
    date.setTime(date.getTime() + expires)
    document.cookie = `${name}=${val}; expires=${date.toUTCString()}; SameSite=None; Secure`
  }

  function getCookie(name: string) {
    const nameEQ = name + "="
    const cookies = document.cookie.split(";")
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trimStart()
      if (cookie.indexOf(nameEQ) === 0) {
        return cookie.substring(nameEQ.length, cookie.length)
      }
    }
    return ""
  }
  const [email, setEmail] = useState(getCookie("email"))
  const [emailErrorMessage, setEmailErrorMessage] = useState("")
  const [saveInfo, setSaveInfo] = useState(Boolean(getCookie("saved")))
  const [password, setPassword] = useState(getCookie("pw"))
  const [name, setName] = useState("")
  const languageIdx = Number(localStorage.getItem(LANGUAGE_IDX))
  const {width, height} = useWindowSize()

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

  useEffect(() => {
    if (!name) {
      return
    }
    getUserDetail(name)
    .then(r => {
      const userInfo: UserInfo = JSON.parse(sessionStorage.getItem(USERINFO) || initialUserInfo)
      const newUserInfo: UserInfo = {
        ...userInfo,
        point: r.point,
        created: r.created,
        withQuestions: r.withQuestions,
        tried: r.tried,
        solved: r.solved,
        liked: r.liked,
        auto: r.auto,
        totalLike: r.totalLike,
      }
      sessionStorage.setItem(USERINFO, JSON.stringify(newUserInfo))
      if (r.withQuestions.length) {
        alert(menuWords.requestWarning[languageIdx])
      }
    })
    movePage(HOME)
  }, [name])

  async function logInAndSetting() {
    if (!isValidEmail(email)) {
      setEmailErrorMessage(menuWords.invalidEmailFormWarning[languageIdx])
      return
    }
    const username = await logIn(email, password)
    if (username.length > 0) {
      setName(username)
    }
    if (saveInfo) {
      setCookie("email", email)
      setCookie("pw", password)
      setCookie("saved", JSON.stringify(true))
    } else {
      setCookie("email", "")
      setCookie("pw", "")
      setCookie("saved", "")
    }
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
        <FormControlLabel labelPlacement='start' control={<Checkbox checked={saveInfo} onChange={() => setSaveInfo(!saveInfo)}/>} label={menuWords.saveInformations[languageIdx]}/>

        <Box sx={{margin: 3}}>
          <Button sx={{color: "red", textTransform: "none"}} onClick={() => movePage('/signup')}>{menuWords.signup[languageIdx]}</Button>
          <CheckEmailDialog></CheckEmailDialog>
        </Box>
      </Box>
    </>
  )
}