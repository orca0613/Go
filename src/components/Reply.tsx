import { Avatar, Box, Button, Divider, Typography } from "@mui/material";
import { ReplyForm, UserInfo } from "../util/types/types";
import { LANGUAGE_IDX, USERINFO } from "../util/constants";
import { hideReply } from "../network/reply";
import { menuWords } from "../util/menuWords";
import { initialUserInfo } from "../util/initialForms";
import { loginWarning } from "../util/functions";
import { useNavigate } from "react-router-dom";
import { LOGIN_PATH } from "../util/paths";


interface ReplyProps {
  replyForm: ReplyForm
}
export function Reply({ replyForm }: ReplyProps) {
  const userInfo: UserInfo = JSON.parse(sessionStorage.getItem(USERINFO) || initialUserInfo)
  const languageIdx = Number(localStorage.getItem(LANGUAGE_IDX))
  const navigate = useNavigate()
  const divider = <Divider orientation="horizontal" sx={{borderColor: "whitesmoke" }} />

  const comment = replyForm.deleted? menuWords.deletedComment[languageIdx] : replyForm.comment
  
  async function deleteReplyAndRefresh() {
    const del = await hideReply(replyForm._id, userInfo.name)
    if (del) {
      alert(menuWords.deletedNotice[languageIdx])
      return location.reload()
    }
    loginWarning()
    sessionStorage.clear()
    navigate(LOGIN_PATH)
  }


  return (
    <Box display="grid">
      <Box my={1} display="flex" alignItems="center" justifyContent="space-between">
        <Box display="flex" alignItems="center">
          <Avatar sx={{ bgcolor: "black", mr: 1}}>{replyForm.name[0]}</Avatar>
          <Typography sx={{fontWeight: 300, fontSize: "70%"}}>{replyForm.name}</Typography>
        </Box>
        <Box>
          <Typography sx={{fontSize: "50%",fontWeight: 50}}>{String(replyForm.time).slice(0, 16).replace("T", " ")}</Typography>
        </Box>
      </Box>
      <Box display="flex" justifyContent="space-between">
        <Typography sx={{fontWeight: replyForm.deleted? 150 : 300, color: replyForm.deleted? "GrayText" : "inherit"}}>{comment}</Typography>
        {replyForm.name === userInfo.name && !replyForm.deleted? <Button sx={{fontSize: "50%", textTransform: "none"}} color="error" onClick={deleteReplyAndRefresh}>{menuWords.delete[languageIdx]}</Button> : <></>}
      </Box>
      {divider}
    </Box>
  )
}