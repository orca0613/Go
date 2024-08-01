import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { menuWords } from '../util/menuWords';
import { alertErrorMessage, getLanguageIdx } from '../util/functions';
import { useCheckEmailAndGetUrlQuery } from '../slices/userApiSlice';

export default function CheckEmailDialog() {
  const languageIdx = getLanguageIdx()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("")
  const { data: url, isLoading: urlLoading, refetch } = useCheckEmailAndGetUrlQuery(email || "a")

  async function checkEmailAndMovePage() {
    try {
      await refetch().unwrap()
      if (url) {
        alert(menuWords.checkPasswordUrlNotice[languageIdx])
        setOpen(false)
      } else {
        alert(menuWords.noEmailWarning[languageIdx])
      }
    } catch (error) {
      if (typeof error === "object" && error !== null && "originalStatus" in error) {
        alertErrorMessage(Number(error.originalStatus))
      }
    }
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
  }

  return (
    <React.Fragment>
      <Button color='inherit' sx={{textTransform: "none"}} onClick={() => setOpen(true)}>
        {menuWords.findPassword[languageIdx]}
      </Button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
      >
        <DialogContent>
          <DialogContentText>
            {menuWords.eMail[languageIdx]}
          </DialogContentText>
          <TextField
            sx={{width: "100%"}}
            margin="dense"
            id="email"
            name="email"
            type="email"
            variant="standard"
            onChange={handleEmailChange}
          />
        </DialogContent>
        <DialogActions sx={{justifyContent: "space-around"}}>
          <Button sx={{textTransform: "none"}} onClick={() => setOpen(false)}>{menuWords.cancel[languageIdx]}</Button>
          <Button sx={{textTransform: "none"}} onClick={checkEmailAndMovePage}>{menuWords.confirm[languageIdx]}</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}