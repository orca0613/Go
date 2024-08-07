import { Button, TextField, FormControl, InputLabel, Select, MenuItem, Box, SelectChangeEvent, Divider } from '@mui/material'
import React, { useState } from 'react'
import { LANGUAGE_IDX, languageList } from '../util/constants'
import { useNavigate } from 'react-router-dom'
import { menuWords } from '../util/menuWords'
import { alertErrorMessage, getLevelText, isValidEmail } from '../util/functions'
import { useWindowSize } from 'react-use'
import { levelArray } from '../util/initialForms'
import { LOGIN_PATH } from '../util/paths'
import { useCheckMailQuery, useCheckUserNameQuery, useCreateAccountMutation } from '../slices/userApiSlice'
import { CreateAccountForm } from '../util/types/queryTypes'

export function Signup() {

  const navigate = useNavigate()
  const [level, setLevel] = useState(18)
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [repeatPassword, setRepeatPassword] = useState("")
  const [emailErrorMessage, setEmailErrorMessage] = useState("")
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("")
  const [repeatPasswordErrorMessage, setRepeatPasswordErrorMessage] = useState("")
  const [nameErrorMessage, setNameErrorMessage] = useState("")
  const { data: emailDuplicate, isLoading: edLoading, refetch: edRefetch } = useCheckMailQuery(email || "a")
  const { data: nameDuplicate, isLoading: ndLoading, refetch: ndRefetch } = useCheckUserNameQuery(name || "a")
  const [createAccount, { isLoading: caLoading }] = useCreateAccountMutation()
  const [language, setLanguage] = useState(Number(localStorage.getItem(LANGUAGE_IDX)))
  const invalidChars = [" ", "!", "@", "#", "$", "%", "^", "&", "*", "(", ")"]
  

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value
    setEmail(newEmail)
    if (newEmail.includes(" ")) {
      setEmailErrorMessage(menuWords.spaceWarning[language])
    } else {
      setEmailErrorMessage("")
    }
  }
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value
    setName(newName)
    setNameErrorMessage("")
    if (newName.length > 15) {
      setNameErrorMessage(menuWords.nameLengthWarning[language])
    }
    for (const char of newName) {
      if (invalidChars.includes(char)) {
        setNameErrorMessage(menuWords.specialCharWarning[language])
      }
    }
  }
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value
    setPassword(newPassword)
    if (newPassword.length < 8) {
      setPasswordErrorMessage(menuWords.passwordWarning[language])
      return
    }
    if (newPassword.includes(" ")) {
      setPasswordErrorMessage(menuWords.spaceWarning[language])
    } else {
      setPasswordErrorMessage("")
    }
  }
  const handleRepeatPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newRepeat = e.target.value
    setRepeatPassword(newRepeat)
    if (newRepeat !== password) {
      setRepeatPasswordErrorMessage(menuWords.repeatPasswordWarning[language])
    } else {
      setRepeatPasswordErrorMessage("")
    }
  }

  const levelChange = (e: SelectChangeEvent) => {
    setLevel(Number(e.target.value))
  }

  async function checkMailAndSetEmailError() {
    if (!email) return false
    // 이메일 중복여부 확인. 문자열이 이메일의 포맷에 맞는지 확인하는 기능은 아직 없음.
    if (!isValidEmail(email)) {
      setEmailErrorMessage(menuWords.invalidEmailFormWarning[language])
      return false
    }
    try {
      edRefetch().unwrap()
      if (!emailDuplicate) {
        setEmailErrorMessage("")
        return true
      } else {
        setEmailErrorMessage(menuWords.emailWarning[language])
        return false
      }
    } catch (error) {
      if (typeof error === "object" && error !== null && "originalStatus" in error) {
        alertErrorMessage(Number(error.originalStatus))
      }
    }
  }

  async function checkUserNameAndSetNameError() {
    if (!name) return false
    try {
      ndRefetch().unwrap()
      if (!nameDuplicate) {
        setNameErrorMessage("")
        return true 
      } else {
        setNameErrorMessage(menuWords.nameWarning[language])
        return false
      }
    } catch (error) {
      if (typeof error === "object" && error !== null && "originalStatus" in error) {
        alertErrorMessage(Number(error.originalStatus))
      }
    }
  }

  async function checkInformationAndregister() {
    if (emailErrorMessage || nameErrorMessage || passwordErrorMessage || repeatPasswordErrorMessage) {
      return
    }
    const isValidEmail = await checkMailAndSetEmailError()
    const isValidName = await checkUserNameAndSetNameError()

    if (isValidEmail && isValidName) {
      const form: CreateAccountForm = {
        email: email,
        password: password,
        name: name,
        level: level,
        language: language,
      }
      try {
        createAccount(form).unwrap()
        alert(menuWords.welcomeSignup[language])
        navigate(LOGIN_PATH)
      } catch (error) {
        if (typeof error === "object" && error !== null && "originalStatus" in error) {
          alertErrorMessage(Number(error.originalStatus))
        }
      }
      
    } else {
      return
    }
  
  }

  const {width, height} = useWindowSize()
  const variant = "standard"
  
  function changeLanguage(e: SelectChangeEvent) {
    const l = Number(e.target.value)
    setLanguage(l)
  }

  return (
    <Box sx={{margin: "3%"}} textAlign="center" display="grid" justifyContent="center">
      <FormControl  sx={{height: height / 7, width: Math.min(width, 300)}}>
        <InputLabel id="language-select-label">{menuWords.language[language]}</InputLabel>
        <Select
          labelId="language-select-label"
          id="language-select"
          value={String(language)}
          label={languageList[language]}
          onChange={changeLanguage}
          variant={variant}
        >
          {languageList.map((l, idx) => {
            return <MenuItem key={l} value={idx}>{l}</MenuItem>
          })}
        </Select>
      </FormControl>
      <TextField
        error={emailErrorMessage.length > 0}
        helperText={emailErrorMessage}
        sx={{height: height / 7, width: Math.min(width, 300)}}
        name='email'
        label={menuWords.eMail[language]} 
        variant={variant}
        value={email}
        onChange={handleEmailChange}
      />
      <TextField 
        error={nameErrorMessage.length > 0}
        helperText={nameErrorMessage}
        sx={{height: height / 7, width: Math.min(width, 300)}}
        name='name'
        label={menuWords.name[language]} 
        variant={variant}
        value={name}
        onChange={handleNameChange}
      />
      <TextField 
        error={passwordErrorMessage.length > 0}
        helperText={passwordErrorMessage}
        sx={{height: height / 7, width: Math.min(width, 300)}}
        name='password'
        type='password'
        label={menuWords.password[language]}
        variant={variant}
        value={password}
        onChange={handlePasswordChange}
      />
      <TextField
        error={repeatPasswordErrorMessage.length > 0}
        helperText={repeatPasswordErrorMessage}
        sx={{height: height / 7, width: Math.min(width, 300)}}
        name='repeatPassword'
        type='password'
        label={menuWords.repeatPassword[language]} 
        variant={variant}
        value={repeatPassword}
        onChange={handleRepeatPasswordChange}
      />
      <FormControl  sx={{height: height / 7, width: Math.min(width, 300)}}>
        <InputLabel id="level-select-label">{menuWords.level[language]}</InputLabel>
        <Select
          labelId="level-select-label"
          id="level-select"
          value={String(level)}
          label={menuWords.level[language]}
          onChange={levelChange}
          variant={variant}
        >
          {levelArray.map(level => {
            return <MenuItem key={level} value={level}>{getLevelText(level, language)}</MenuItem>
          })}
        </Select>
      </FormControl>
      <Button variant="contained" color="info" sx={{height: height / 15, width: Math.min(width, 300)}} onClick={checkInformationAndregister}>{menuWords.create[language]}</Button>
    </Box>
  )
}