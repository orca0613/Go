import { Button, TextField } from '@mui/material'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface SignupFormInput {
    email: string,
    password: string,
}
const initialForm: SignupFormInput = {
    email: 'abc@abc.com',
    password: '',
}

export function Signup() {

  const [form, setForm] = useState(initialForm)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }
  const checkPassword = (email: string, password: string) => {
    if (email === 'polarbear13@naver.com' && password === '180917') {
      alert('welcome to my world')
    } else {
      alert('get out of here')
    }
  }
  const navigate = useNavigate()
  const movePage = (address: string) => {
    navigate(address)
  }
  
  return (
    <>
        <TextField 
        name='email'
        label='e-mail' 
        variant='outlined'
        value={form.email}
        onChange={handleInputChange}
        />
        <TextField 
        name='password'
        type='password'
        label='password' 
        variant='outlined' 
        value={form.password}
        onChange={handleInputChange}

        />

        <Button onClick={() => checkPassword(form.email, form.password)}>log in</Button>
        <Button onClick={() => movePage('/')}>return</Button>
    </>
  )
}