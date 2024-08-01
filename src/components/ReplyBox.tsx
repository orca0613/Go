import { Box, Button, TextField } from "@mui/material"
import { ReplyForm, UserInfo } from "../util/types/types"
import { useEffect, useState } from "react"
import { Reply } from "./Reply"
import { LANGUAGE_IDX, USERINFO } from "../util/constants"
import { menuWords } from "../util/menuWords"
import { initialUserInfo } from "../util/initialForms"
import { useAddReplyMutation, useGetRepliesQuery } from "../slices/replyApiSlice"
import { AddReplyForm } from "../util/types/queryTypes"
import { alertErrorMessage } from "../util/functions"

interface ReplyBoxProps {
  problemId: string
}

export function ReplyBox({ problemId }: ReplyBoxProps) {
  const userInfo: UserInfo = JSON.parse(sessionStorage.getItem(USERINFO) || initialUserInfo)
  const [inputValue, setInputValue] = useState("")
  const [addReply, { isLoading: arLoading }] = useAddReplyMutation()
  const { data: replies, isLoading: rpLoading, refetch } = useGetRepliesQuery(problemId)
  const [allReplies, setAllReplies] = useState<ReplyForm[]>(replies || [])
  const username = userInfo.name
  const languageIdx = Number(localStorage.getItem(LANGUAGE_IDX))

  useEffect(() => {
    try {
      refetch().unwrap()
      setAllReplies(replies || [])
      setInputValue("")
    } catch (error) {
      if (typeof error === "object" && error !== null && "originalStatus" in error) {
        alertErrorMessage(Number(error.originalStatus))
      }
    }
  }, [problemId])

  function handleInputValueChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInputValue(e.target.value)
  }

  async function registerReply() {
    if (!inputValue) {
      alert("please enter reply")
      return
    }
    const form: AddReplyForm = {
      problemId: problemId,
      comment: inputValue,
      name: username,
    }
    try {
      await addReply(form).unwrap()
    } catch (error) {
      if (typeof error === "object" && error !== null && "originalStatus" in error) {
        alertErrorMessage(Number(error.originalStatus))
      }
    }
  }

  return (
    <Box my={3}>
      <TextField 
        fullWidth 
        onChange={handleInputValueChange} 
        variant="standard" 
        label={menuWords.comment[languageIdx]} 
        value={inputValue}
      />
      <Box sx={{textAlign: "right"}}>
        <Button onClick={registerReply} sx={{fontSize: "70%", textTransform: "none"}}>{menuWords.register[languageIdx]}</Button>
      </Box>
      {allReplies.map((r, idx) => {
        return (
          <Reply replyForm={r} key={idx}/>
        )
      })}
    </Box>
  )
}