import { Button, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface SignupFormInput {
    email: string,
    password: string,
    repeatPassword: string,
    name: string,
    level: number
}
const initialForm: SignupFormInput = {
    email: '',
    password: '',
    repeatPassword: '',
    name: '',
    level: 18,
}

export function Signup() {

  const [form, setForm] = useState(initialForm)
  const [checkEmail, setCheckEmail] = useState(false)
  const [checkPassword, setCheckPassword] = useState(false)
  const [checkName, setCheckName] = useState(false)
  const [level, setLevel] = useState(18)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const levelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLevel(Number(e.target.value))
    console.log(e.target.value)
  }

  function checkMail() {
    // 이메일 중복여부 확인. 문자열이 이메일의 포맷에 맞는지 확인하는 기능은 아직 없음.
    const email = form.email
    fetch(`http://localhost:3001/users/check-email/${email}`)
      .then(response => response.json())
      .then(data => {
        if (data.isDuplicate) {
          console.log('Exist same email')
          setCheckEmail(false)
        } else {
          console.log('This is valid email')
          setCheckEmail(true)
        }
      })
      .catch(error => console.error('Error', error))
    }

  function checkLegalPassword() {
    // 패스워드가 적합한 형태인지 확인. 길이가 8이상, repeat-password와 일치하는지 공백문자가 있는지 여부만 확인.
    if (form.password.length < 8) {
      console.log('Make longer password')
      setCheckPassword(false)
    } else {
      if (form.password !== form.repeatPassword) {
        console.log('Check repeat password')
        setCheckPassword(false)
      } else {
        console.log('This is valid password')
        setCheckPassword(true)
      }
    }
  }

  function checkUserName() {
    // 유저 네임의 중복여부 확인. 이 역시 네임의 포맷이 적합한지 여부는 확인하지 않음.
    const name = form.name
    if (name.includes(' ')) {
      console.log('Space characters are not valid characters.')
      setCheckName(false)
      return
    }
    fetch(`http://localhost:3001/users/check-name/${name}`)
      .then(response => response.json())
      .then(data => {
        if (data.isDuplicate) {
          console.log('Exist same name')
          setCheckName(false)
        } else {
          console.log('This is valid name')
          setCheckName(true)
        }
      })
      .catch(error => console.error('Error', error))
  }

  function registerUser() {
    // 회원가입. 이메일, 패스워드, 네임의 체크가 완료되지 않으면 바로 리턴됨. 회원가입 
    if (checkEmail && checkPassword && checkName) {
      const email = form.email
      const password = form.password
      const name = form.name

      fetch('http://localhost:3001/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({email, password, name, level}),
      })
        .then(response => alert('success'))
        .catch(error => console.error('Error: ', error))
      setCheckEmail(false)
      setCheckName(false)
      setCheckPassword(false)
      
    } else {
      console.log('The check has not been completed.')
      return
    }
  }
  const navigate = useNavigate()
  const movePage = (address: string) => {
    navigate(address)
  }
  
  return (
    <>
      <div>
        <TextField 
          name='email'
          label='e-mail' 
          variant='outlined'
          value={form.email}
          onChange={handleInputChange}
        />
        <Button onClick={checkMail}>check</Button>
      </div>
      <div>
        <TextField 
          name='password'
          type='password'
          label='password' 
          variant='outlined' 
          value={form.password}
          onChange={handleInputChange}
        />
        <>at least 8 characters</>
      </div>
      <div>
        <TextField 
          name='repeatPassword'
          type='password'
          label='repeat-password' 
          variant='outlined' 
          value={form.repeatPassword}
          onChange={handleInputChange}
        />
        <Button onClick={checkLegalPassword}>check</Button>
      </div>
      <div>
        <TextField 
          name='name'
          label='name' 
          variant='outlined' 
          value={form.name}
          onChange={handleInputChange}
        />
        <Button onClick={checkUserName}>check</Button>
      </div>
      <div>
        <TextField 
            name='level'
            label='level' 
            variant='outlined' 
            value={form.level}
            onChange={handleInputChange}
        />
      </div>
  
        <Button onClick={registerUser}>register</Button>
        <Button onClick={() => movePage('/')}>home</Button>
    </>
  )
}