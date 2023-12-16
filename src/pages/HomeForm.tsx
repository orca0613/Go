
import { Typography } from '@mui/material'
import { menuWords } from '../util/menuWords'
import { LANGUAGE_IDX, USERNAME } from '../util/constants'
import UseAutocomplete from '../components/Test'

export function HomeForm() {
  const username = localStorage.getItem(USERNAME)
  const languageIdx = Number(localStorage.getItem(LANGUAGE_IDX))

  return (
    <>
      <Typography variant='h3' sx={{margin: 3, fontWeight: "bold"}}>{menuWords.welcome[languageIdx]} {username}</Typography>
      <UseAutocomplete></UseAutocomplete>
    </>
  )
}
