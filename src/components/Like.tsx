import { useEffect, useState } from "react"
import { LIKED, USERINFO } from "../util/constants"
import { Box, Checkbox, Typography } from "@mui/material"
import { getProblemInformations } from "../network/problemInformation"
import { addElement, deleteElement } from "../network/userDetail"
import { UserInfo } from "../util/types"
import { Favorite, FavoriteBorder } from "@mui/icons-material"
import { initialUserInfo } from "../util/initialForms"
import { getSampleProblemByIdx, handleLiked } from "../network/sampleProblem"

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
  })

  function handleLike() {
    const c = info.likeCount
    const idx = userInfo.liked.indexOf(problemIdx)
    if (info.like) {
      handleLiked(problemIdx, username, creator, false)
      deleteElement(problemIdx, username, LIKED)
      setInfo({
        like: false,
        likeCount: c - 1
      })
      if (idx !== -1) {
        userInfo.liked.splice(idx, 1)
      }
    } else {
      addElement(problemIdx, username, LIKED)
      handleLiked(problemIdx, username, creator, true)
      setInfo({
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
      getSampleProblemByIdx(problemIdx)
      .then(information => {
        setInfo({
          like: userInfo.liked.includes(problemIdx),
          likeCount: Number(information),
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