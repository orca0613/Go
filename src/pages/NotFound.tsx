import { Button } from '@mui/material'
import React from 'react'
import { useNavigate } from 'react-router-dom'

export function NotFound() { 
  const navigate = useNavigate()
  const movePage = (address: string) => {
    navigate(address)
  }




  return (
    <>
      <h1>wrong address</h1>
      <Button onClick={() => movePage('/')}>return</Button>
      <Button onClick={() => movePage('problem')}>problem page</Button>
    </>
  )
}
