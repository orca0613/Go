import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import { useState } from 'react';
import { USERINFO } from '../util/constants';
import { UserInfo } from '../util/types/types';
import { useNavigate } from 'react-router-dom';
import { menuWords } from '../util/menuWords';
import React from 'react';
import { initialUserInfo } from '../util/initialForms';
import { useCheckPasswordQuery } from '../slices/userApiSlice';
import { alertErrorMessage } from '../util/functions';

interface CPDProps {
  languageIdx: number
}

export default function CheckPasswordDialog({ languageIdx }: CPDProps) {
  const userInfo: UserInfo = JSON.parse(sessionStorage.getItem(USERINFO) || initialUserInfo)
  const navigate = useNavigate()
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("")
  const { data: form, isLoading, refetch } = useCheckPasswordQuery(userInfo.name + " " + password)

  async function checkPasswordAndMovePage() {
    try {
      await refetch().unwrap()
      if (form && form.match) {
        return navigate(`/change-password/${form.id}`)
      }
      alert(menuWords.incorrectPasswordWarning[languageIdx])
      return
    } catch (error) {
      if (typeof error === "object" && error !== null && "originalStatus" in error) {
        alertErrorMessage(Number(error.originalStatus))
      }
    }
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
  }

  return (
    <React.Fragment>
      <Button variant='contained' sx={{width: "100%", backgroundColor: "tomato", textTransform: "none"}} onClick={() => setOpen(true)}>
        {menuWords.changePassword[languageIdx]}
      </Button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
      >
        <DialogContent>
          <DialogContentText>
            {menuWords.curPasswordNotice[languageIdx]}
          </DialogContentText>
          <TextField
            sx={{width: "100%"}}
            margin="dense"
            id="password"
            name="password"
            type="password"
            autoComplete="off"
            variant="standard"
            onChange={handlePasswordChange}
          />
        </DialogContent>
        <DialogActions sx={{justifyContent: "space-around"}}>
          <Button sx={{textTransform: "none"}} onClick={() => setOpen(false)}>{menuWords.cancel[languageIdx]}</Button>
          <Button sx={{textTransform: "none"}} onClick={checkPasswordAndMovePage}>{menuWords.confirm[languageIdx]}</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}