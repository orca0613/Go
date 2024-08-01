import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { menuWords } from '../util/menuWords';
import React from 'react';
import { LOGIN_PATH } from '../util/paths';
import { UserInfo } from '../util/types/types';
import { USERINFO } from '../util/constants';
import { initialUserInfo } from '../util/initialForms';
import { useDeleteAccountMutation } from '../slices/userApiSlice';
import { DeleteAccountForm } from '../util/types/queryTypes';
import { alertErrorMessage, saveLoginInfo } from '../util/functions';

interface DADProps {
  languageIdx: number
}

export default function DeleteAccountDialog({ languageIdx }: DADProps) {
  const userInfo: UserInfo = JSON.parse(sessionStorage.getItem(USERINFO) || initialUserInfo)
  const navigate = useNavigate()
  const [open, setOpen] = useState(false);
  const [deleteAccount, { isLoading: daLoading }] = useDeleteAccountMutation()


  async function deleteAccountAndMovePage(email: string, password: string) {
    const form: DeleteAccountForm = {
      name: userInfo.name,
      email: email,
      password: password
    }
    try {
      await deleteAccount(form).unwrap()
      sessionStorage.clear()
      saveLoginInfo("", "", false)
      alert(menuWords.deletedNotice[languageIdx])
      navigate(LOGIN_PATH)
    } catch (error) {
      if (typeof error === "object" && error !== null && "originalStatus" in error) {
        alertErrorMessage(Number(error.originalStatus))
      }
    }
  }

  return (
    <React.Fragment>
      <Button variant='contained' sx={{width: "100%", backgroundColor: "red", textTransform: "none"}} onClick={() => setOpen(true)}>
        {menuWords.deleteAccount[languageIdx]}
      </Button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          component: 'form',
          onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries((formData as any).entries());
            const password = formJson.password;
            const email = formJson.email;
            deleteAccountAndMovePage(email, password)
            setOpen(false);
          },
        }}
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
            autoComplete="off"
            variant="standard"
          />
        </DialogContent>
        <DialogContent>
          <DialogContentText>
            {menuWords.password[languageIdx]}
          </DialogContentText>
          <TextField
            sx={{width: "100%"}}
            margin="dense"
            id="password"
            name="password"
            type="password"
            autoComplete="off"
            variant="standard"
          />
        </DialogContent>
        <DialogActions sx={{justifyContent: "space-around"}}>
          <Button sx={{textTransform: "none"}} onClick={() => setOpen(false)}>{menuWords.cancel[languageIdx]}</Button>
          <Button sx={{textTransform: "none"}} type="submit">{menuWords.confirm[languageIdx]}</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}