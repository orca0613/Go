import { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { changePassword } from '../network/user';
import { menuWords } from '../util/menuWords';
import { useWindowSize } from 'react-use';
import { LANGUAGE_IDX } from '../util/constants';
import { LOGIN_PATH } from '../util/paths';
import { getLanguageIdx } from '../util/functions';

export default function ChangePassword() {
  const { userId } = useParams()
  const navigate = useNavigate()
  const [errorMessage, setErrorMessage] = useState("")
  const [password, setPassword] = useState("")
  const [repeat, setRepeat] = useState("")
  const {width, height} = useWindowSize()
  const languageIdx = getLanguageIdx()

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
  }

  const handleRepeatChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRepeat(e.target.value)
  }

  async function change() {
    if (password.length < 8) {
      setErrorMessage(menuWords.passwordWarning[languageIdx])
      return
    } else if (password !== repeat) {
      setErrorMessage(menuWords.repeatPasswordWarning[languageIdx])
      return
    } else {
      const result = await changePassword(userId || "", password)
      if (result) {
        sessionStorage.clear()
        navigate(LOGIN_PATH)
      }
    }
  }

  return (
    <Box sx={{margin: "3%"}} textAlign="center" display="grid" justifyContent="center">

      <Typography sx={{height: height / 7, width: Math.min(width, 300)}}>{menuWords.changePassword[languageIdx]}</Typography>
      <TextField 
        error={errorMessage.length > 0? true : false}
        helperText={errorMessage}
        sx={{height: height / 7, width: Math.min(width, 300)}}
        name='password'
        type='password'
        label={menuWords.password[languageIdx]}
        variant="standard"
        value={password}
        onChange={handlePasswordChange}
      />
      <TextField
        error={errorMessage.length > 0? true : false}
        helperText={errorMessage}
        sx={{height: height / 7, width: Math.min(width, 300)}}
        name='repeatPassword'
        type='password'
        label={menuWords.repeatPassword[languageIdx]} 
        variant="standard"
        value={repeat}
        onChange={handleRepeatChange}
      />
      <Button variant="contained" color="info" sx={{height: height / 15, width: Math.min(width, 300)}} onClick={change}>{menuWords.change[languageIdx]}</Button>
    </Box>
  );
}