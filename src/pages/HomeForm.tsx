import React from 'react'
import { Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { rootState } from '../redux/rootReducer'

export function HomeForm() {
  const navigate = useNavigate()

  const userName = useSelector((state: rootState) => state.user.username)
  const userLevel = useSelector((state: rootState) => state.user.userlevel)

  const movePage = (address: string) => {
      navigate(address)
  }
  return (
    <>
      <div>
        <Button onClick={() => movePage('problem')}>problem page</Button>
        <Button onClick={() => movePage('signup')}>sign up</Button>
        <Button onClick={() => movePage('test-problem')}>register my problem</Button>
        <Button onClick={() => movePage('test-variations')}>register variations</Button>
      </div>
      <h1>welcome {userName}, your level is {userLevel}</h1>
    </>
  )
}
