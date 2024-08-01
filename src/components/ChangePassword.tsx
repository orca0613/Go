import { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { menuWords } from '../util/menuWords';
import { useWindowSize } from 'react-use';
import { LOGIN_PATH } from '../util/paths';
import { alertErrorMessage, getLanguageIdx, saveLoginInfo } from '../util/functions';
import { useChangePasswordMutation } from '../slices/userApiSlice';
import { ChangePasswordForm } from '../util/types/queryTypes';
import { error } from 'console';

export default function ChangePassword() {
  const { userId } = useParams()
  const navigate = useNavigate()
  const [errorMessage, setErrorMessage] = useState("")
  const [password, setPassword] = useState("")
  const [repeat, setRepeat] = useState("")
  const [changePassword, { isLoading: cpLoading }] = useChangePasswordMutation()
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
    } 
    if (password !== repeat) {
      setErrorMessage(menuWords.repeatPasswordWarning[languageIdx])
      return
    }
    const form: ChangePasswordForm = {
      id: userId || "",
      password: password
    }
    try {
      await changePassword(form).unwrap()
      alert(menuWords.modifiedNotice[languageIdx])
      sessionStorage.clear()
      saveLoginInfo("", "", false)
      navigate(LOGIN_PATH)
    } catch (error) {
      if (typeof error === "object" && error !== null && "originalStatus" in error) {
        alertErrorMessage(Number(error.originalStatus))
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