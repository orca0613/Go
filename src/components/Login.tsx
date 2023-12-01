import { Box, Button, TextField } from '@mui/material'
import React, { useState } from 'react'
// import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { API_URL, USER_LEVEL, USER_NAME } from '../util/constants'
// import { setUserlevel, setUsername } from '../redux/actions'

export function Login() {
	const navigate = useNavigate()
	const movePage = (address: string) => {
		navigate(address)
}
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // const dispatch = useDispatch()

  const inputEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
  }

  const inputPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
  }

  function logIn() {
    // 이메일과 패스워드를 통해 로그인 시도. 로그인에 성공하면 서버로부터 유저의 정보가 리턴됨.
    fetch(`${API_URL}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({email, password}),
    })
      .then(response => response.json())
      .then(user => {
        if (user.name !== false) {
          alert(`hi ${user.name}`)
          localStorage.setItem(USER_NAME, `${user.name}`)
          localStorage.setItem(USER_LEVEL, String(user.level))
          movePage('home')
        } else {
          console.log('wrong information')
        }
      })
      .catch(error => console.error('Error: ', error))
  }

  return (
    <>
      <Box sx={{mt: 3}} textAlign="center">
        <Box>
          <TextField 
            sx={{margin: 3, width: 250}}
            name='email'
            label='e-mail' 
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
            label='password' 
            variant='standard'
            value={password}
            onChange={inputPasswordChange}
          />
        </Box>

        <Box sx={{margin: 3}}>
          <Button onClick={logIn}>log in</Button>
          <Button onClick={() => movePage('signup')}>sign up</Button>
        </Box>
      </Box>
    </>
  )
}