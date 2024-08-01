import { Box, Button, Checkbox, Divider, Pagination, Stack, Typography, useMediaQuery } from "@mui/material";
import { MessageForm, UserInfo } from "../util/types/types";
import { ChangeEvent, useState } from "react";
import { menuWords } from "../util/menuWords";
import { LANGUAGE_IDX, USERINFO, messagesPerPage } from "../util/constants";
import { useNavigate } from "react-router-dom";
import { nameButtonStyle } from "../util/styles";
import { initialMessageForm, initialUserInfo } from "../util/initialForms";
import { MessageBox } from "./MessageBox";
import { useCheckMessageMutation, useHideMessageMutation } from "../slices/messageApiSlice";
import { CheckMessageForm, HideMessageForm } from "../util/types/queryTypes";
import { alertErrorMessage } from "../util/functions";

interface MLProps {
  receivedMessages: MessageForm[]
  sentMessages: MessageForm[]
}

export default function MessageList({ receivedMessages, sentMessages }: MLProps) {
  const userInfo: UserInfo = JSON.parse(sessionStorage.getItem(USERINFO) || initialUserInfo)
  const languageIdx = Number(localStorage.getItem(LANGUAGE_IDX))
  const navigate = useNavigate()
  const isMobile = useMediaQuery("(max-width: 600px)")
  const divider = <Divider orientation="horizontal" sx={{borderColor: "ger"}} />
  const [isReceived, setIsReceived] = useState(true)
  const [received, setReceived] = useState(receivedMessages)
  const [sent, setSent] = useState(sentMessages)
  const [checked, setChecked] = useState(0)
  const [page, setPage] = useState(1)
  const [messageList, setMessageList] = useState<MessageForm[]>(receivedMessages)
  const [openCount, setOpenCount] = useState(0)
  const all = 2 ** messagesPerPage - 1
  const [contents, setContents] = useState<MessageForm>(initialMessageForm)
  const [hideMessage, { isLoading: dmLoading }] = useHideMessageMutation()
  const [checkMessage, { isLoading: cmLoading }] = useCheckMessageMutation()

  async function openMessage(message: MessageForm) {
    if (!message.checked) {
      const form: CheckMessageForm = {
        id: message._id,
        name: userInfo.name,
      }
      try {
        await checkMessage(form).unwrap()
      } catch (error) {
        if (typeof error === "object" && error !== null && "originalStatus" in error) {
          alertErrorMessage(Number(error.originalStatus))
        }
      }
    }
    setContents(message)
    setOpenCount(openCount + 1)
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
    const where = isReceived? "hideToReceiver" : "hideToSender"
    const startIdx = (page - 1) * messagesPerPage
    const idList: string[] = []
    for (let i = 0; i < 20; i++) {
      if ((1 << i) & checked && startIdx + i < messageList.length) {
        idList.push(messageList[startIdx + i]._id)
      }
    }
    const form: HideMessageForm = {
      idList: idList.join("&"),
      name: userInfo.name,
      where: where
    }
    try {
      await hideMessage(form).unwrap()
      setChecked(0)
      location.reload()
    } catch (error) {
      if (typeof error === "object" && error !== null && "originalStatus" in error) {
        alertErrorMessage(Number(error.originalStatus))
      }
    }
  }

  const handlePageChange = (event: ChangeEvent<unknown>, val: number) => {
    setPage(val)
    setChecked(0)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  function handleReceived(r: boolean) {
    setIsReceived(r)
    setChecked(0)
    setPage(1)
    if (r) {
      setMessageList(received)
    } else {
      setMessageList(sent)
    }
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
        variant={isReceived? "contained" : "outlined"} 
        onClick={() => handleReceived(true)}
      >
        {menuWords.receivedMessage[languageIdx]}
      </Button>
      <Button 
        sx={{mx: 1, textTransform: "none", fontSize: isMobile? "70%" : "100%"}} 
        variant={isReceived? "outlined" : "contained"} 
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
              isReceived? <Button onClick={() => navigate(`/userpage/${message.sender}`)} sx={nameButtonStyle}>{message.sender}</Button> : 
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
              isReceived? <Button onClick={() => navigate(`/userpage/${message.sender}`)} sx={nameButtonStyle}>{message.sender}</Button> : 
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
      <MessageBox
        contents={contents}
        isMobile={isMobile}
        isReceived={isReceived}
        openCount={openCount}
      />
    </Box>
  )
}