import { Button, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { menuWords } from '../util/menuWords'
import { LANGUAGE_IDX } from '../util/constants'

export function NotFound() { 

  const navigate = useNavigate()
  const languageIdx = Number(localStorage.getItem(LANGUAGE_IDX))
  const movePage = (address: string) => {
    navigate(address)
  }

  return (
    <>
      <Typography variant='h3'>{menuWords.notFoundWarning[languageIdx]}</Typography>
      <Button onClick={() => movePage('/')}>{menuWords.return[languageIdx]}</Button>
    </>
  )
}
