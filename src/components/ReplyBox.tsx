import { Box, Button, TextField } from "@mui/material"
import { ReplyForm, UserInfo } from "../util/types"
import { useEffect, useState } from "react"
import { Reply } from "./Reply"
import { LANGUAGE_IDX, USERINFO } from "../util/constants"
import { menuWords } from "../util/menuWords"
import { useNavigate } from "react-router-dom"
import { addReply, getReplies } from "../network/reply"
import { LOGIN_PATH } from "../util/paths"
import { initialUserInfo } from "../util/initialForms"

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
    const newAllReplies = getReplies(problemId)
    newAllReplies.then(r => {
      setAllReplies(r)
    })
    setInputValue("")
  }, [problemId, reply])

  function handleInputValueChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInputValue(e.target.value)
  }

  function logout() {
    sessionStorage.clear()
    navigate(LOGIN_PATH)
  }

  async function registerReply() {
    if (!username) {
      alert(menuWords.loginWarning[languageIdx])
      logout()
    }
    if (!inputValue) {
      alert("please enter reply")
      return
    }
    const add = await addReply(problemId, inputValue, username)
    if (add) {
      setReply(inputValue)
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