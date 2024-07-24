import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import { useState } from 'react';
import { checkMailAndSendUrl } from '../network/user';
import { HOME, LANGUAGE_IDX } from '../util/constants';
import { useNavigate } from 'react-router-dom';
import { menuWords } from '../util/menuWords';
import { getLanguageIdx } from '../util/functions';

export default function CheckEmailDialog() {
  const languageIdx = getLanguageIdx()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false);

  async function checkEmailAndMovePage(email: string) {
    const result = await checkMailAndSendUrl(email)
    if (result) {
      alert(menuWords.checkPasswordUrlNotice[languageIdx])
      navigate(HOME)
    } else {
      alert(menuWords.noEmailWarning[languageIdx])
    }
  }

  return (
    <React.Fragment>
      <Button color='inherit' sx={{textTransform: "none"}} onClick={() => setOpen(true)}>
        {menuWords.findPassword[languageIdx]}
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
            const email = formJson.email;
            checkEmailAndMovePage(email)
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