import React from 'react'
import { Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'

export function HomeForm() {
  const navigate = useNavigate()

  const movePage = (address: string) => {
      navigate(address)
  }
  return (
    <>
      <div>
        <Button onClick={e => movePage('problem')}>problem page</Button>
        <Button onClick={e => movePage('signup')}>sign up</Button>
        <Button onClick={e => movePage('Test')}>test</Button>
      </div>
      <h1>hello world</h1>
    </>
  )
}
