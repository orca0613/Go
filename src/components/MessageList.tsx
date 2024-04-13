import { Box, Button, Divider, Modal, Typography, useMediaQuery } from "@mui/material";
import { MessageForm } from "../util/types";
import { useEffect, useState } from "react";
import { checkMessage, getReceivedMessage, getSentMessage } from "../network/message";
import { menuWords } from "../util/menuWords";
import { LANGUAGE_IDX } from "../util/constants";
import CommunicationMenu from "./CommunicationMenu";

export default function MessageList() {
  const languageIdx = Number(localStorage.getItem(LANGUAGE_IDX))
  const isMobile = useMediaQuery("(max-width: 600px)")
  const divider = <Divider orientation="horizontal" sx={{borderColor: "ger", mb: 2}} />
  const [received, setReceived] = useState(true)

  const [messageList, setMessageList] = useState<MessageForm[]>([])
  const [open, setOpen] = useState(false)
  const [contents, setContents] = useState<MessageForm>({
    _id: "",
    sender: "",
    receiver: "",
    title: "",
    contents: "",
    quotation: "",
    time: new Date(),
    checked: false,
    hideToReceiver: false,
    hideToSender: false,
    includeUrl: false,
    url: ""
  })

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
  

  useEffect(() => {
    if (received) {
      const newMessageList = getReceivedMessage()
      .then(m => {
        setMessageList(m)
      })
    } else {
      const newMessageList = getSentMessage()
      .then(m => {
        setMessageList(m)
      })

    }
  }, [received])

  const modal = 
      <Modal
        open={open}
        onClose={() => setOpen(false)}
      >
        <Box sx={style} minWidth={isMobile? "70%" : "30%"} minHeight={"150px"}>
          <Box display="flex">
            <Typography color="teal" mb={2}>{contents.sender}</Typography>
          </Box>
          {divider}
          <Box display="flex">
            <Typography mb={2}>{contents.contents}</Typography>
          </Box>
          {contents.includeUrl && divider}
          {contents.includeUrl? <Typography >{<a style={{color: "teal", textDecoration: "none"}} href={contents.url}>{menuWords.goToTheProblem[languageIdx]}</a>}</Typography> : <></>}
        </Box>
      </Modal>

  function openMessage(message: MessageForm) {
    if (!message.checked) {
      checkMessage(message._id)
    }
    let content = ""
    let url = ""
    if (message.includeUrl) {
      [content, url] = message.contents.split("&")
      const newMessage = {
        ...message,
        contents: content,
        url: url
      }
      setContents(newMessage)
    } else {
      setContents(message)
    }
    setOpen(true)
  }

  const messageLine = (message: MessageForm, key: any) => {
    return (
      <Box key={key} mt={0}>
        <Box display={isMobile? "grid" : "flex"} justifyContent="space-around" textAlign="center" alignItems="center">
          <Box sx={{width: isMobile? "100%" : "10%"}}>
            {
              received? <CommunicationMenu creator={message.sender} left={!isMobile}></CommunicationMenu> : 
              <CommunicationMenu creator={message.receiver} left={!isMobile}></CommunicationMenu>
            }
          </Box>
          <Button 
          onClick={() => openMessage(message)} 
          sx={{width: isMobile? "100%" : "50%", color: message.checked? "gray" : "", justifyContent: isMobile? "center" : "left", textTransform: "none"}}
          >
            {message.title}
          </Button>
          <Typography sx={{width: isMobile? "100%" : "20%"}}>{String(message.time).slice(5, 16).replace("T", " ")}</Typography>
        </Box>
        {divider}
      </Box>
    )
  }

  return (
    <Box mt={5}>
      <Box textAlign="center" my={5}>
        <Button sx={{mx: 2, textTransform: "none"}} variant={received? "contained" : "outlined"} onClick={() => setReceived(true)}>{menuWords.receivedMessage[languageIdx]}</Button>
        <Button sx={{mx: 2, textTransform: "none"}} variant={received? "outlined" : "contained"} onClick={() => setReceived(false)}>{menuWords.sentMessage[languageIdx]}</Button>
      </Box>
      {divider}
      {messageList.map((m, idx) => {
        return messageLine(m, idx)
      })}
      {modal}
    </Box>
  )
}