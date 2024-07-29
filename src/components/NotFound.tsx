import { Button, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { menuWords } from '../util/menuWords'
import { LANGUAGE_IDX } from '../util/constants'
import _ from 'lodash'
import toast from 'react-hot-toast'
// import ToastDemo from '../toast/Sample'
import { useState } from 'react'


export function NotFound() { 
  const [show, setShow] = useState(false)

  const handleClick = () => {
    setShow(!show)
    toast("test toast")
  }

  const navigate = useNavigate()
  const languageIdx = Number(localStorage.getItem(LANGUAGE_IDX))
  const movePage = (address: string) => {
    navigate(address)
  }

  return (
    <>
      <Typography variant='h3'>{menuWords.notFoundWarning[languageIdx]}</Typography>
      <Button onClick={() => movePage('/')}>{menuWords.return[languageIdx]}</Button>
      {/* <Button onClick={handleClick}>toast</Button> */}
      {/* {show? <ToastDemo title={"hello"} description={"world"}></ToastDemo> : "fuck"} */}
    </>
  )
}
