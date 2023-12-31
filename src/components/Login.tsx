import { Box, Button, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { API_URL, ASKED, CREATED, DISLIKED, LANGUAGE_IDX, LIKED, SOLVED, TOKEN, TRIED, USERLEVEL, USERNAME, USERPOINT, WITHQUESTIONS } from '../util/constants'
import { menuWords } from '../util/menuWords'
import { getUserDetail } from '../network/userDetail'

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
    const detail = getUserDetail(name)
    if (detail) {
      detail.then(r => {
        localStorage.setItem(USERPOINT, r.point)
        localStorage.setItem(CREATED, r.created.join("&"))
        localStorage.setItem(TRIED, r.tried.join("&"))
        localStorage.setItem(SOLVED, r.solved.join("&"))
        localStorage.setItem(ASKED, r.asked.join("&"))
        localStorage.setItem(WITHQUESTIONS, r.withQuestions.join("&"))
        localStorage.setItem(LIKED, r.liked.join("&"))
        localStorage.setItem(DISLIKED, r.disliked.join("&"))
      })
    }
    if (name.length > 0) {
      movePage("/home")
    }

  }, [name])

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
        if (user.name !== undefined) {
          alert(`${menuWords.hi[languageIdx]} ${user.name}`)
          localStorage.setItem(USERNAME, user.name)
          localStorage.setItem(USERLEVEL, user.level)
          setName(user.name)
          localStorage.setItem(TOKEN, user.token)
        } else {
          alert(user.response)
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
          <Button onClick={logIn}>{menuWords.login[languageIdx]}</Button>
          <Button onClick={() => movePage('signup')}>{menuWords.signup[languageIdx]}</Button>
        </Box>
      </Box>
    </>
  )
}