import { Box, Button, Modal, TextField, Typography } from "@mui/material"
import { menuWords } from "../util/menuWords";
import { HOME, LANGUAGE_IDX } from "../util/constants";
import { ChangeEvent, useEffect, useState } from "react";
import { sendMessage } from "../network/message";
import { useNavigate } from "react-router-dom";


interface SendMessageFormProps {
  receiver: string
  sender: string
  open: number
}

export default function SendMessageForm({ receiver, sender, open }: SendMessageFormProps) {

  const languageIdx = Number(localStorage.getItem(LANGUAGE_IDX))
  const navigate = useNavigate()
  const [messageTitle, setMessageTitle] = useState("")
  const [messageContents, setMessageContents] = useState("")
  const [openModal, setOpenModal] = useState(false)

  const handleContentsChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMessageContents(e.target.value)
  }
  
  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMessageTitle(e.target.value)
  }

  useEffect(() => {
    if (open > 0) {
      setOpenModal(true)
    }
  }, [open])


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


  const sendMessageForm = 
  <Modal 
    open={openModal}
    onClose={() => setOpenModal(false)}
  >
    <Box sx={style}>
      <Box display="flex">
        <Typography mr={2} mb={2}>{menuWords.receiver[languageIdx]}: </Typography>
        <Typography color="teal">{receiver}</Typography>
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
        <Button sx={{textTransform: "none"}} onClick={() => setOpenModal(false)}>{menuWords.cancel[languageIdx]}</Button>
        <Button sx={{textTransform: "none"}} onClick={sendMessageAndClose}>{menuWords.send[languageIdx]}</Button>
      </Box>
    </Box>
  </Modal>

  async function sendMessageAndClose() {
    const result = await sendMessage(sender, receiver, messageTitle, messageContents, "")
    if (result) {
      alert(menuWords.sent[languageIdx])
    } else {
      sessionStorage.clear()
      navigate(HOME)
    }
    setOpenModal(false)
  }

  return (
    <Box>
      {sendMessageForm}
    </Box>
  )
}