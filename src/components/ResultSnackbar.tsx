import { Alert, Box, Snackbar } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useWindowSize } from 'react-use'
import { menuWords } from '../util/menuWords'
import { getLanguageIdx } from '../util/functions'

interface RsProps {
  result: boolean | undefined,
}


export function ResultSnackbar({ result }: RsProps) {
  const [open, setOpen] = useState(false)
  const {width, height} = useWindowSize()
  const [correct, setCorrect] = useState(result)
  const languageIdx = getLanguageIdx()

  useEffect(() => {
    if (result !== undefined) {
      setOpen(true)
      setCorrect(result)
    }
  }, [result])

  return (
    <Box>
      <Snackbar
        open={open}
        autoHideDuration={1000}
        onClose={() => setOpen(!open)}
        anchorOrigin={{vertical: "bottom", horizontal: "center"}}
        sx={{bottom: height / 2}}
      >
        <Alert
          severity={correct? "success" : "error"}
          variant='filled'
        >
          {correct? menuWords.correct[languageIdx] : menuWords.wrong[languageIdx]}
        </Alert>
      </Snackbar>
    </Box>
  )
}
