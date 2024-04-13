import { Box, Button, TextField } from "@mui/material"
import { ReplyForm, UserInfo } from "../util/types"
import { useEffect, useState } from "react"
import { Reply } from "./Reply"
import { LANGUAGE_IDX, LOGIN_PATH, USERINFO, initialUserInfo } from "../util/constants"
import { menuWords } from "../util/menuWords"
import { useNavigate } from "react-router-dom"
import { addReply, getReplies } from "../network/reply"

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
  const navigate = useNavigate()
  

  useEffect(() => {
    if (problemId) {
      const newAllReplies = getReplies(problemId)
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
      alert(menuWords.loginWarning[languageIdx])
      navigate(LOGIN_PATH)
    }
    setReply(inputValue)

    addReply(problemId, inputValue, username)
  }

  return (
    <Box>
      {allReplies.map((r, idx) => {
        return (
          <Reply replyForm={r} key={idx}/>
        )
      })}
      <TextField fullWidth onChange={handleInputValueChange} variant="standard" label={menuWords.comment[languageIdx]} value={inputValue}></TextField>
      <Box sx={{textAlign: "right"}}>
        <Button onClick={registerReply}>{menuWords.register[languageIdx]}</Button>
      </Box>
    </Box>
  )
}