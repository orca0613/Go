import { Box, Button, Divider, Typography } from "@mui/material";
import { ReplyForm, UserInfo } from "../util/types";
import { LANGUAGE_IDX, USERINFO, initialUserInfo } from "../util/constants";
import { deleteReply } from "../network/reply";
import { menuWords } from "../util/menuWords";


interface ReplyProps {
  replyForm: ReplyForm
}
export function Reply({ replyForm }: ReplyProps) {
  const userInfo: UserInfo = JSON.parse(sessionStorage.getItem(USERINFO) || initialUserInfo)
  const languageIdx = Number(localStorage.getItem(LANGUAGE_IDX))
  const divider = <Divider orientation="horizontal" sx={{borderColor: "black" }} />

  const comment = replyForm.deleted? "삭제된 댓글입니다." : replyForm.comment
  
  async function deleteReplyAndRefresh() {
    const del = await deleteReply(replyForm._id, userInfo.name)
    if (del) {
      alert(menuWords.deletedNotice[languageIdx])
      return location.reload()
    }
    alert(menuWords.cancel[languageIdx])
  }


  return (
    <Box display="grid">
      <Box display="flex" justifyContent="space-between">
        <Box display="grid">
          <Typography sx={{
            color: "steelblue",
            fontSize: "70%",
            fontWeight: 300,
          }}>
            {replyForm.name}
          </Typography>
          <Typography sx={{
            fontSize: "50%",
            fontWeight: 50,
          }}>
            {String(replyForm.time).slice(0, 19)}
          </Typography>
          <Typography sx={{
            fontSize: "100%",
            fontWeight: replyForm.deleted? 150 : 300,
            color: replyForm.deleted? "GrayText" : "inherit"
          }}>
            {comment}
          </Typography>
        </Box>
      {replyForm.name === userInfo.name && !replyForm.deleted? <Button sx={{fontSize: "50%"}} color="error" onClick={deleteReplyAndRefresh}>{menuWords.delete[languageIdx]}</Button> : <></>}
      </Box>
      {divider}
    </Box>
  )
}