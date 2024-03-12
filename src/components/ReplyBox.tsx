import { Box, Button, TextField } from "@mui/material"
import { ReplyForm, UserInfo } from "../util/types"
import { useEffect, useState } from "react"
import { Reply } from "./Reply"
import { LANGUAGE_IDX, USERINFO, initialUserInfo } from "../util/constants"
import { menuWords } from "../util/menuWords"
import { addReply, getReply } from "../network/problemInformation"

interface ReplyBoxProps {
  problemId: string
}

export function ReplyBox({ problemId }: ReplyBoxProps) {
  const userInfo: UserInfo = JSON.parse(sessionStorage.getItem(USERINFO) || initialUserInfo)
  const [allReplies, setAllReplies] = useState<ReplyForm[]>([])
  const [reply, setReply] = useState("")
  const [inputValue, setInputValue] = useState("")
  const username = userInfo.name
  const languageIdx = Number(localStorage.getItem(LANGUAGE_IDX))
  

  useEffect(() => {
    if (problemId) {
      const newAllReplies = getReply(problemId)
      newAllReplies.then(r => {
        setAllReplies(r)
      })
      setInputValue("")
    }
  }, [problemId, reply])

  function handleInputValueChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInputValue(e.target.value)
  }

  function registerReply() {
    if (!username) {
      return
    }
    setReply(inputValue)
    const newReplyForm: ReplyForm = {
      name: username,
      date: new Date(),
      comment: inputValue
    }
    addReply(problemId, newReplyForm, username)
  }

  return (
    <Box>
      {allReplies.map((r, idx) => {
        return (
          <Reply 
            name={r.name}
            date={String(r.date).slice(0, 19)}
            comment={r.comment}
            key={idx}
          />
        )
      })}
      <TextField fullWidth onChange={handleInputValueChange} variant="standard" label={menuWords.comment[languageIdx]} value={inputValue}></TextField>
      <Button onClick={registerReply}>{menuWords.register[languageIdx]}</Button>
    </Box>
  )
}