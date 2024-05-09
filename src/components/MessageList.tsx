import { Box, Button, Checkbox, Divider, Modal, Pagination, Stack, Typography, useMediaQuery } from "@mui/material";
import { MessageForm } from "../util/types";
import { ChangeEvent, useEffect, useState } from "react";
import { checkMessage, getReceivedMessage, getSentMessage, hideMessage } from "../network/message";
import { menuWords } from "../util/menuWords";
import { LANGUAGE_IDX, messagesPerPage } from "../util/constants";
import { useNavigate } from "react-router-dom";
import { nameButtonStyle } from "../util/styles";

export default function MessageList() {
  const languageIdx = Number(localStorage.getItem(LANGUAGE_IDX))
  const navigate = useNavigate()
  const isMobile = useMediaQuery("(max-width: 600px)")
  const divider = <Divider orientation="horizontal" sx={{borderColor: "ger"}} />
  const [received, setReceived] = useState(true)
  const [checked, setChecked] = useState(0)
  const [page, setPage] = useState(1)
  const [deleted, setDeleted] = useState(false)

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

  const all = 2 ** messagesPerPage - 1
  

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
  }, [received, deleted])

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

  function handleCheckedChange(idx: number) {
    const newChecked = checked ^ (1 << idx)
    setChecked(newChecked)
  }

  function handleAllChange() {
    const newChecked = checked === all? 0 : all
    setChecked(newChecked)
  }

  async function deleteMessage() {
    const where = received? "hideToReceiver" : "hideToSender"
    const startIdx = (page - 1) * messagesPerPage
    const idList: string[] = []
    for (let i = 0; i < 20; i++) {
      if ((1 << i) & checked && i < messageList.length) {
        idList.push(messageList[startIdx + i]._id)
      }
    }
    const remove = await hideMessage(idList.join("&"), where)
    setChecked(0)
    setDeleted(!deleted)
  }

  const handlePageChange = (event: ChangeEvent<unknown>, val: number) => {
    setPage(val)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  function handleReceived(r: boolean) {
    setReceived(r)
    setChecked(0)
    setPage(1)
  }

  const topMenu = 
  <Box display="flex" justifyContent="space-between" alignItems="center">
    <Box display="flex">
      <Checkbox
        checked={checked === all}
        onChange={handleAllChange}
        size="small"
      />
      <Button sx={{textTransform: "none"}} onClick={deleteMessage} color="error" disabled={checked === 0}>{menuWords.delete[languageIdx]}</Button>
    </Box>
    <Box>
      <Button 
        sx={{mx: 1, textTransform: "none", fontSize: isMobile? "70%" : "100%"}} 
        variant={received? "contained" : "outlined"} 
        onClick={() => handleReceived(true)}
      >
        {menuWords.receivedMessage[languageIdx]}
      </Button>
      <Button 
        sx={{mx: 1, textTransform: "none", fontSize: isMobile? "70%" : "100%"}} 
        variant={received? "outlined" : "contained"} 
        onClick={() => handleReceived(false)}
      >
        {menuWords.sentMessage[languageIdx]}
      </Button>
    </Box>
  </Box>

  const mobileMessageLine = (message: MessageForm, key: number) => {
    return (
      <Box key={key}>
        <Box display="flex" alignItems="center" width="100%" justifyContent="space-between">
          <Box display="flex">
            <Checkbox
              checked={Boolean(checked & (1 << key))}
              onChange={() => handleCheckedChange(key)}
              size="small"
            />
            {
              received? <Button onClick={() => navigate(`/userpage/${message.sender}`)} sx={nameButtonStyle}>{message.sender}</Button> : 
              <Button onClick={() => navigate(`/userpage/${message.receiver}`)} sx={nameButtonStyle}>{message.receiver}</Button>
            }
          </Box>
          <Typography justifyContent="right" right={0}>{String(message.time).slice(5, 16).replace("T", " ")}</Typography>
        </Box>
        <Button 
          onClick={() => openMessage(message)} 
          sx={{ color: message.checked? "gray" : "", textTransform: "none"}}
        >
          {message.title}
        </Button>
        {divider}
      </Box>
    )
  }

  const messageLine = (message: MessageForm, key: number) => {
    return (
      <Box key={key} mt={0}>
        <Box display="flex" justifyContent="space-between" textAlign="center" alignItems="center">
          <Box display="flex" sx={{width: "20%"}}>
            <Checkbox
              checked={Boolean(checked & (1 << key))}
              onChange={() => handleCheckedChange(key)}
              sx={{justifyContent: "center"}}
              size="small"
            />
            {
              received? <Button onClick={() => navigate(`/userpage/${message.sender}`)} sx={nameButtonStyle}>{message.sender}</Button> : 
              <Button onClick={() => navigate(`/userpage/${message.receiver}`)} sx={nameButtonStyle}>{message.receiver}</Button>
            }
          </Box>
          <Button 
            onClick={() => openMessage(message)} 
            sx={{width: "50%", color: message.checked? "gray" : "", textTransform: "none"}}
          >
            {message.title}
          </Button>
          <Typography sx={{width: "20%"}}>{String(message.time).slice(5, 16).replace("T", " ")}</Typography>
        </Box>
        {divider}
      </Box>
    )
  }

  return (
    <Box mt={5}>
      <Box textAlign="center">
        {topMenu}
        <Divider orientation="horizontal" sx={{borderColor: "black", borderWidth: 1, my: 2}} />
      </Box>
      {messageList.slice((page - 1) * messagesPerPage, Math.min(page * messagesPerPage, messageList.length)).map((m, idx) => {
        return isMobile? mobileMessageLine(m, idx) : messageLine(m, idx)
      })}
      <Stack spacing={2} my={2}>
        <Pagination 
        page={page}
        count={Math.ceil(messageList.length / messagesPerPage)} 
        onChange={handlePageChange}
        color="primary"
        
        />
      </Stack>
      {modal}
    </Box>
  )
}