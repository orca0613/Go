import { Button, TextField, FormControl, InputLabel, Select, MenuItem, Box, SelectChangeEvent, Divider } from '@mui/material'
import React, { useState } from 'react'
import { checkMail, checkUserName, createUser } from '../util/functions'

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

  const [form, setForm] = useState(initialForm)
  const [level, setLevel] = useState(18)
  const divider = <Divider orientation="horizontal" sx={{mt: 1, mb: 2, borderColor: "white" }} />
  const [emailErrorMessage, setEmailErrorMessage] = useState("")
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("")
  const [nameErrorMessage, setNameErrorMessage] = useState("")
  

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const levelChange = (e: SelectChangeEvent) => {
    setLevel(Number(e.target.value))
    console.log(e.target.value)
  }

  async function checkMailAndSetEmailError() {
    // 이메일 중복여부 확인. 문자열이 이메일의 포맷에 맞는지 확인하는 기능은 아직 없음.
    const email = form.email
    const isValid = await checkMail(email)
    if (isValid === true) {
      setEmailErrorMessage("")
      return true
    } else {
      setEmailErrorMessage("Change the email")
      return false
    }
  }


  function checkPasswordAndSetPasswordError() {
    // 패스워드가 적합한 형태인지 확인. 길이가 8이상, repeat-password와 일치하는지 공백문자가 있는지 여부만 확인.
    if (form.password.length < 8) {
      setPasswordErrorMessage('Make longer password')
      return false
    } else {
      if (form.password !== form.repeatPassword) {
        setPasswordErrorMessage('Check repeat password')
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
      setNameErrorMessage("Change the name")
      return false
    }
  }

  function create() {
    console.log("register")
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
          label='e-mail' 
          variant='standard'
          value={form.email}
          onChange={handleInputChange}
        />
        <TextField 
          error={nameErrorMessage.length > 0? true : false}
          helperText={nameErrorMessage}
          sx={{mr: margin, ml: margin, width: 200}}
          name='name'
          label='name' 
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
          label='password' 
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
          label='repeat-password' 
          variant='standard' 
          value={form.repeatPassword}
          onChange={handleInputChange}
        />
      </Box>
      {divider}
      <Box sx={{margin: margin}}>
        <FormControl sx={{mr: margin, ml: margin, width: 200}}>
          <InputLabel id="level-select-label">level</InputLabel>
          <Select
            labelId="level-select-label"
            id="level-select"
            value={String(level)}
            label="level"
            onChange={levelChange}
            variant='standard'
          >
            <MenuItem value={18}>18k</MenuItem>
            <MenuItem value={17}>17k</MenuItem>
            <MenuItem value={16}>16k</MenuItem>
            <MenuItem value={15}>15k</MenuItem>
            <MenuItem value={14}>14k</MenuItem>
            <MenuItem value={13}>13k</MenuItem>
            <MenuItem value={12}>12k</MenuItem>
            <MenuItem value={11}>11k</MenuItem>
            <MenuItem value={10}>10k</MenuItem>
            <MenuItem value={9}>9k</MenuItem>
            <MenuItem value={8}>8k</MenuItem>
            <MenuItem value={7}>7k</MenuItem>
            <MenuItem value={6}>6k</MenuItem>
            <MenuItem value={5}>5k</MenuItem>
            <MenuItem value={4}>4k</MenuItem>
            <MenuItem value={3}>3k</MenuItem>
            <MenuItem value={2}>2k</MenuItem>
            <MenuItem value={1}>1k</MenuItem>
            <MenuItem value={-1}>1d</MenuItem>
            <MenuItem value={-2}>2d</MenuItem>
            <MenuItem value={-3}>3d</MenuItem>
            <MenuItem value={-4}>4d</MenuItem>
            <MenuItem value={-5}>5d</MenuItem>
            <MenuItem value={-6}>6d</MenuItem>
            <MenuItem value={-7}>7d</MenuItem>
            <MenuItem value={-8}>8d</MenuItem>
            <MenuItem value={-9}>9d</MenuItem>
          </Select>
        </FormControl>
        <Button sx={{mr: margin, ml: margin, width: 200}} onClick={checkInformationAndregister}>create</Button>
      </Box>
    </Box> 
  )
}