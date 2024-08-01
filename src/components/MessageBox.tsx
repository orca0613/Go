import { Box, Button, Divider, Modal, Typography } from "@mui/material";
import { MessageForm, UserInfo } from "../util/types/types";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { menuWords } from "../util/menuWords";
import { getLanguageIdx } from "../util/functions";
import { USERINFO } from "../util/constants";
import { initialUserInfo } from "../util/initialForms";
import SendMessageBox from "./SendMessageBox";

interface MBProps {
  contents: MessageForm
  isMobile: boolean
  isReceived: boolean
  openCount: number
}

export function MessageBox({ contents, isMobile, isReceived, openCount }: MBProps) {

  const [message, setMessage] = useState<MessageForm>(contents)
  const [open, setOpen] = useState(false)
  const [openSendForm, setOpenSendForm] = useState(0)
  const navigate = useNavigate()
  const languageIdx = getLanguageIdx()
  const divider = <Divider orientation="horizontal" sx={{borderColor: "ger"}} />
  const userInfo: UserInfo = JSON.parse(sessionStorage.getItem(USERINFO) || initialUserInfo)

  useEffect(() => {
    if (openCount > 0) {
      setOpen(true)
    }
    if (contents.includeUrl) {
      const [content, url] = contents.contents.split("&")
      contents = {
        ...contents,
        contents: content,
        url: url
      }
    }
    setMessage(contents)
  }, [openCount])



  const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 2,
  };

  function openSendMessageForm(sender: string, name: string) {
    setOpenSendForm(openSendForm + 1)
  }

  return (
    <Box>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
      >
        <Box sx={style} minWidth={isMobile? "70%" : "30%"} minHeight={"150px"}>
          <Box display="flex">
            <Typography color="teal" mb={2}>{message.sender}</Typography>
          </Box>
          {divider}
          <Box>
            <Typography mb={2}>{message.contents}</Typography>
            {message.includeUrl? <Button onClick={() => navigate(`/problem/${message.url}`)} sx={{color: "teal", textDecoration: "none", left: 0}}>{menuWords.goToTheProblem[languageIdx]}</Button> : <></>}
          </Box>
          {divider}
          <Box display="flex" alignItems="center" justifyContent="right">
            <Button onClick={() => openSendMessageForm(message.sender, userInfo.name)} sx={{right: 0, textTransform: "none", display: isReceived? "" : "none"}}>{menuWords.reply[languageIdx]}</Button>
          </Box>
        </Box>
      </Modal>
      <SendMessageBox 
        receiver={isReceived? message.sender : message.receiver}
        sender={isReceived? message.receiver : message.sender}
        open={openSendForm}
      />
    </Box>
  )
}