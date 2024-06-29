import { Box, Button, Typography } from '@mui/material'
import React from 'react'
import { LANGUAGE_IDX } from '../util/constants'
import { menuWords } from '../util/menuWords'

export function LoadingPage() {
  const languageIdx = Number(localStorage.getItem(LANGUAGE_IDX))
  const spinner = <img src="/images/Spinner.gif" alt="loading..." />
  const pinkSpinner = <img src="/images/Spinner.svg" alt="loading..." width="20%" height="20%" />



  return (

    <Box textAlign="center" alignContent="center" alignSelf="center">
      <Box mt={20}>
        {pinkSpinner}
      </Box>
      <Typography justifyContent="center">{menuWords.loadingWarning[languageIdx]}</Typography>
    </Box>
  )
}