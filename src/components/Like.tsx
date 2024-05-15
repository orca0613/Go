import { useEffect, useState } from "react"
import { LIKED, USERINFO } from "../util/constants"
import { Box, Checkbox, Typography } from "@mui/material"
import { getProblemInformations, handleLiked } from "../network/problemInformation"
import { addElement, deleteElement } from "../network/userDetail"
import { UserInfo } from "../util/types"
import { Favorite, FavoriteBorder } from "@mui/icons-material"
import { initialUserInfo } from "../util/initialForms"

interface LADProps {
  problemIdx: number,
  username: string,
  creator: string
}

export function Like({ problemIdx, username, creator }: LADProps) {
  const userInfo: UserInfo = JSON.parse(sessionStorage.getItem(USERINFO) || initialUserInfo)
  const [info, setInfo] = useState({
    like: false,
    likeCount: 0,
    level: 0
  })

  function handleLike() {
    const c = info.likeCount
    const idx = userInfo.liked.indexOf(problemIdx)
    if (info.like) {
      handleLiked(username, problemIdx, creator, info.level, false)
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
      handleLiked(username, problemIdx, creator, info.level, true)
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
          likeCount: Number(information.liked),
          level: information.level
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