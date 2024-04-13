import { useEffect, useState } from "react"
import { LANGUAGE_IDX, LIKED, USERINFO, initialUserInfo } from "../util/constants"
import { Box, Checkbox, Typography } from "@mui/material"
import { addUsername, deleteUsername, getProblemInformations } from "../network/problemInformation"
import { addElement, deleteElement } from "../network/userDetail"
import { UserInfo } from "../util/types"
import { Favorite, FavoriteBorder } from "@mui/icons-material"

interface LADProps {
  problemIdx: number,
  username: string,
}

export function LikeAndDislike({ problemIdx, username }: LADProps) {
  const languageIdx = Number(localStorage.getItem(LANGUAGE_IDX))
  const userInfo: UserInfo = JSON.parse(sessionStorage.getItem(USERINFO) || initialUserInfo)
  const [info, setInfo] = useState({
    like: false,
    likeCount: 0,
  })

  function handleLike() {
    const c = info.likeCount
    const idx = userInfo.liked.indexOf(problemIdx)
    if (info.like) {
      deleteUsername(username, problemIdx, LIKED)
      deleteElement(problemIdx, username, LIKED)
      setInfo({
        ...info,
        like: false,
        likeCount: c - 1
      })
      if (idx !== -1) {
        userInfo.liked.splice(idx, 1)
      }
    } else {
      addElement(problemIdx, username, LIKED)
      addUsername(username, problemIdx, LIKED)
      setInfo({
        ...info,
        like: true,
        likeCount: c + 1
      })
      if (idx === -1) {
        userInfo.liked.push(problemIdx)
      }
    }
    sessionStorage.setItem(USERINFO, JSON.stringify(userInfo))
  }

  useEffect(() => {
    if (problemIdx >= 0) {
      const newInformation = getProblemInformations(problemIdx)
      .then(information => {
        setInfo({
          like: userInfo.liked.includes(problemIdx),
          likeCount: information.liked.length,
        })
      })

    }
  }, [problemIdx])
  return (
    <Box textAlign="center" display="flex" alignItems="center" justifyContent="center">
      <Checkbox icon={<FavoriteBorder/>} checkedIcon={<Favorite/>} checked={info.like} color="error" onChange={handleLike}></Checkbox>
      <Typography>{info.likeCount}</Typography>
    </Box>
  )
}