import { useEffect, useState } from 'react';
import { Box, Button, TextField } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { changePassword } from '../network/user';
import { menuWords } from '../util/menuWords';
import { useWindowSize } from 'react-use';
import { HOME, LANGUAGE_IDX } from '../util/constants';

export default function ChangePassword() {
  const { userId } = useParams()
  const navigate = useNavigate()
  const [errorMessage, setErrorMessage] = useState("")
  const [password, setPassword] = useState("")
  const [repeat, setRepeat] = useState("")
  const {width, height} = useWindowSize()
  const languageIdx = Number(localStorage.getItem(LANGUAGE_IDX))

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
  }

  const handleRepeatChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRepeat(e.target.value)
  }

  function change() {
    if (password.length < 8) {
      setErrorMessage(menuWords.passwordWarning[languageIdx])
      return
    } else if (password !== repeat) {
      setErrorMessage(menuWords.repeatPasswordWarning[languageIdx])
      return
    } else {
      changePassword(userId || "", password)
      navigate(HOME)
    }
  }

  return (
    <Box>
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
      <Button variant="contained" color="info" sx={{height: height / 15, width: Math.min(width, 300)}} onClick={change}>{menuWords.create[languageIdx]}</Button>
    </Box>
  );
}