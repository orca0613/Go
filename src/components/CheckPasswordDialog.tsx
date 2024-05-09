import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import { useState } from 'react';
import { checkPassword } from '../network/user';
import { LANGUAGE_IDX, USERINFO } from '../util/constants';
import { UserInfo } from '../util/types';
import { useNavigate } from 'react-router-dom';
import { menuWords } from '../util/menuWords';
import React from 'react';
import { initialUserInfo } from '../util/initialForms';

export default function CheckPasswordDialog() {
  const userInfo: UserInfo = JSON.parse(sessionStorage.getItem(USERINFO) || initialUserInfo)
  const languageIdx = Number(localStorage.getItem(LANGUAGE_IDX))
  const navigate = useNavigate()
  const [open, setOpen] = useState(false);

  async function checkPasswordAndMovePage(password: string) {
    const id = await checkPassword(userInfo.name, password)
    if (id) {
      return navigate(`/change-password/${id}`)
    }
    alert(menuWords.incorrectPasswordWarning[languageIdx])
    return
  }

  return (
    <React.Fragment>
      <Button variant='contained' sx={{width: "100%", backgroundColor: "tomato", textTransform: "none"}} onClick={() => setOpen(true)}>
        {menuWords.changePassword[languageIdx]}
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
            checkPasswordAndMovePage(password)
            setOpen(false);
          },
        }}
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