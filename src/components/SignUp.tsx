import { Button, TextField, FormControl, InputLabel, Select, MenuItem, Box, SelectChangeEvent, Divider } from '@mui/material'
import React, { useState } from 'react'
import { LANGUAGE_IDX } from '../util/constants'
import { checkMail, checkUserName, createUser } from '../util/network'
import { useNavigate } from 'react-router-dom'
import { menuWords } from '../util/menuWords'

interface SignupFormInput {
    email: string,
    password: string,
    repeatPassword: string,
    name: string,
}
const initialForm: SignupFormInput = {
    email: '',
    password: '',
    repeatPassword: '',
    name: '',
}

export function Signup() {

  const navigate = useNavigate()
  const [form, setForm] = useState(initialForm)
  const [level, setLevel] = useState(18)
  const divider = <Divider orientation="horizontal" sx={{mt: 1, mb: 2, borderColor: "white" }} />
  const [emailErrorMessage, setEmailErrorMessage] = useState("")
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("")
  const [nameErrorMessage, setNameErrorMessage] = useState("")
  const languageIdx = Number(localStorage.getItem(LANGUAGE_IDX))
  

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const levelChange = (e: SelectChangeEvent) => {
    setLevel(Number(e.target.value))
  }

  async function checkMailAndSetEmailError() {
    // 이메일 중복여부 확인. 문자열이 이메일의 포맷에 맞는지 확인하는 기능은 아직 없음.
    const email = form.email
    const isValid = await checkMail(email)
    if (isValid === true) {
      setEmailErrorMessage("")
      return true
    } else {
      setEmailErrorMessage(menuWords.emailWarning[languageIdx])
      return false
    }
  }


  function checkPasswordAndSetPasswordError() {
    // 패스워드가 적합한 형태인지 확인. 길이가 8이상, repeat-password와 일치하는지 공백문자가 있는지 여부만 확인.
    if (form.password.length < 8) {
      setPasswordErrorMessage(menuWords.passwordWarning[languageIdx])
      return false
    } else {
      if (form.password !== form.repeatPassword) {
        setPasswordErrorMessage(menuWords.repeatPasswordWarning[languageIdx])
        return false
      } else {
        setPasswordErrorMessage("")
        return true
      }
    }
  }

  async function checkUserNameAndSetNameError() {
    // 유저 네임의 중복여부 확인. 이 역시 네임의 포맷이 적합한지 여부는 확인하지 않음.
    const name = form.name
    const isValid = await checkUserName(name)
    if (isValid === true) {
      setNameErrorMessage("")
      return true 
    } else {
      setNameErrorMessage(menuWords.nameWarning[languageIdx])
      return false
    }
  }

  function create() {
    const email = form.email
    const password = form.password
    const name = form.name
    createUser(email, password, name, level)
  }

  async function checkInformationAndregister() {
    const email = await checkMailAndSetEmailError()
    const password = checkPasswordAndSetPasswordError()
    const name = await checkUserNameAndSetNameError()

    if (email && password && name) {
      create()
      navigate("/")
      
    } else {
      return
    }
  
  }

  const margin = 7
  
  return (
    <Box sx={{mt: margin}} textAlign="center">
      <Box sx={{margin: margin}}>
        <TextField
          error={emailErrorMessage.length > 0? true : false}
          helperText={emailErrorMessage}
          sx={{mr: margin, ml: margin, width: 200}}
          name='email'
          label={menuWords.eMail[languageIdx]} 
          variant='standard'
          value={form.email}
          onChange={handleInputChange}
        />
        <TextField 
          error={nameErrorMessage.length > 0? true : false}
          helperText={nameErrorMessage}
          sx={{mr: margin, ml: margin, width: 200}}
          name='name'
          label={menuWords.name[languageIdx]} 
          variant='standard' 
          value={form.name}
          onChange={handleInputChange}
        />
      </Box>
      {divider}
      <Box sx={{margin: margin}}>
        <TextField 
          error={passwordErrorMessage.length > 0? true : false}
          helperText={passwordErrorMessage}
          sx={{mr: margin, ml: margin, width: 200}}
          name='password'
          type='password'
          label={menuWords.password[languageIdx]}
          variant='standard'
          value={form.password}
          onChange={handleInputChange}
        />
        <TextField
          error={passwordErrorMessage.length > 0? true : false}
          helperText={passwordErrorMessage}
          sx={{mr: margin, ml: margin, width: 200}}
          name='repeatPassword'
          type='password'
          label={menuWords.repeatPassword[languageIdx]} 
          variant='standard' 
          value={form.repeatPassword}
          onChange={handleInputChange}
        />
      </Box>
      {divider}
      <Box sx={{margin: margin}}>
        <FormControl sx={{mr: margin, ml: margin, width: 200}}>
          <InputLabel id="level-select-label">{menuWords.level[languageIdx]}</InputLabel>
          <Select
            labelId="level-select-label"
            id="level-select"
            value={String(level)}
            label={menuWords.level[languageIdx][languageIdx]}
            onChange={levelChange}
            variant='standard'
          >
            <MenuItem value={18}>{`18${menuWords.K[languageIdx]}`}</MenuItem>
            <MenuItem value={17}>{`17${menuWords.K[languageIdx]}`}</MenuItem>
            <MenuItem value={16}>{`16${menuWords.K[languageIdx]}`}</MenuItem>
            <MenuItem value={15}>{`15${menuWords.K[languageIdx]}`}</MenuItem>
            <MenuItem value={14}>{`14${menuWords.K[languageIdx]}`}</MenuItem>
            <MenuItem value={13}>{`13${menuWords.K[languageIdx]}`}</MenuItem>
            <MenuItem value={12}>{`12${menuWords.K[languageIdx]}`}</MenuItem>
            <MenuItem value={11}>{`11${menuWords.K[languageIdx]}`}</MenuItem>
            <MenuItem value={10}>{`10${menuWords.K[languageIdx]}`}</MenuItem>
            <MenuItem value={9}>{`9${menuWords.K[languageIdx]}`}</MenuItem>
            <MenuItem value={8}>{`8${menuWords.K[languageIdx]}`}</MenuItem>
            <MenuItem value={7}>{`7${menuWords.K[languageIdx]}`}</MenuItem>
            <MenuItem value={6}>{`6${menuWords.K[languageIdx]}`}</MenuItem>
            <MenuItem value={5}>{`5${menuWords.K[languageIdx]}`}</MenuItem>
            <MenuItem value={4}>{`4${menuWords.K[languageIdx]}`}</MenuItem>
            <MenuItem value={3}>{`3${menuWords.K[languageIdx]}`}</MenuItem>
            <MenuItem value={2}>{`2${menuWords.K[languageIdx]}`}</MenuItem>
            <MenuItem value={1}>{`1${menuWords.K[languageIdx]}`}</MenuItem>
            <MenuItem value={-1}>{`1${menuWords.D[languageIdx]}`}</MenuItem>
            <MenuItem value={-2}>{`2${menuWords.D[languageIdx]}`}</MenuItem>
            <MenuItem value={-3}>{`3${menuWords.D[languageIdx]}`}</MenuItem>
            <MenuItem value={-4}>{`4${menuWords.D[languageIdx]}`}</MenuItem>
            <MenuItem value={-5}>{`5${menuWords.D[languageIdx]}`}</MenuItem>
            <MenuItem value={-6}>{`6${menuWords.D[languageIdx]}`}</MenuItem>
            <MenuItem value={-7}>{`7${menuWords.D[languageIdx]}`}</MenuItem>
            <MenuItem value={-8}>{`8${menuWords.D[languageIdx]}`}</MenuItem>
            <MenuItem value={-9}>{`9${menuWords.D[languageIdx]}`}</MenuItem>
          </Select>
        </FormControl>
        <Button sx={{mr: margin, ml: margin, width: 200}} onClick={checkInformationAndregister}>{menuWords.create[languageIdx]}</Button>
      </Box>
    </Box> 
  )
}