import Box from '@mui/material/Box';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { Button, ClickAwayListener, Divider, MenuItem, MenuList, Modal, Paper, TextField, Typography, useMediaQuery } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { LANGUAGE_IDX, USERINFO, initialUserInfo } from '../util/constants';
import { menuWords } from '../util/menuWords';
import { ChangeEvent, useState } from 'react';
import { sendMessage } from '../network/message';
import { UserInfo } from '../util/types';

interface CommunicationMenuProps {
  creator: string
  left? : boolean
}

export default function CommunicationMenu({creator, left}: CommunicationMenuProps) {
  const userInfo: UserInfo = JSON.parse(sessionStorage.getItem(USERINFO) || initialUserInfo)
  const [open, setOpen] = useState(false);
  const [openSendForm, setOpenSendForm] = useState(false)
  const [messageTitle, setMessageTitle] = useState("")
  const [messageContents, setMessageContents] = useState("")
  const languageIdx = Number(localStorage.getItem(LANGUAGE_IDX))
  const navigate = useNavigate()
  const divider = <Divider orientation="horizontal" sx={{borderColor: "ger", mb: 2, mx: 1}} />

  const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: "50%",
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  const handleContentsChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMessageContents(e.target.value)
  }
  
  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMessageTitle(e.target.value)
  }

  async function sendMessageAndClose() {
    const result = await sendMessage(userInfo.name, creator, messageTitle, messageContents, "")
    if (result === true) {
      alert(menuWords.sent[languageIdx])
    }
    setOpenSendForm(false)
  }
  

  const sendMessageForm = 
  <Modal 
    open={openSendForm}
    onClose={() => setOpenSendForm(false)}
  >
    <Box sx={style}>
      <Box display="flex">
        <Typography mr={2} mb={2}>{menuWords.receiver[languageIdx]}: </Typography>
        <Typography color="teal">{creator}</Typography>
      </Box>
      <Box>
        <TextField
          variant='standard'
          label={menuWords.title[languageIdx]}
          value={messageTitle}
          onChange={handleTitleChange}
          >
        </TextField>
      </Box>
      <Box my={3}>
        <TextField
          variant='standard'
          label={menuWords.content[languageIdx]}
          value={messageContents}
          onChange={handleContentsChange}
          >
        </TextField>
      </Box>
      <Box display="flex" justifyContent="space-around">
        <Button sx={{textTransform: "none"}} onClick={() => setOpenSendForm(false)}>{menuWords.cancel[languageIdx]}</Button>
        <Button sx={{textTransform: "none"}} onClick={sendMessageAndClose}>{menuWords.send[languageIdx]}</Button>
      </Box>
    </Box>
  </Modal>


  const menu = 
  <Paper>
    <ClickAwayListener onClickAway={() =>setOpen(false)}>
      <MenuList>
        <MenuItem onClick={test1} sx={{justifyContent: "center"}}>
          {menuWords.sendMessage[languageIdx]}
        </MenuItem>
        {divider}
        <MenuItem onClick={moveToCreated} sx={{justifyContent: "center"}}>
          {menuWords.searchByCreator[languageIdx]}
        </MenuItem>
      </MenuList>
    </ClickAwayListener>
  </Paper>

  function test1() {
    setOpenSendForm(true)
    setOpen(false)
  }
  function moveToCreated() {
    setOpen(false)
    navigate(`/problems/tier=0&low=-10&high=19&creator=${creator}&`)
  }
  return (
    <Box sx={{ display: 'grid'}}>
      <ListItemButton
        alignItems="flex-start"
        onClick={() => setOpen(!open)}
      >
        <ListItemText
          sx={{textAlign: left? "left" : "center"}}
          primary={creator}
          primaryTypographyProps={{
            color: "teal"
          }}
        />
      </ListItemButton>
      {open && menu}
      {sendMessageForm}
    </Box>
  );
}
