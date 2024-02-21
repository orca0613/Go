import { Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { menuWords } from '../util/menuWords'
import { LANGUAGE_IDX } from '../util/constants'
import _ from 'lodash'

export function NotFound() { 

  const navigate = useNavigate()
  const languageIdx = Number(localStorage.getItem(LANGUAGE_IDX))
  const movePage = (address: string) => {
    navigate(address)
  }

  return (
    <>
      <h1>{menuWords.notFoundWarning[languageIdx]}</h1>
      <Button onClick={() => movePage('/')}>{menuWords.return[languageIdx]}</Button>
    </>
  )
}
