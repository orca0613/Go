import { useEffect, useState } from "react"
import { USERINFO } from "../util/constants"
import { Box, Checkbox, Typography } from "@mui/material"
import { UserInfo } from "../util/types/types"
import { Favorite, FavoriteBorder } from "@mui/icons-material"
import { initialUserInfo } from "../util/initialForms"
import { useHandleLikedMutation } from "../slices/sampleProblemApiSlice"
import { HandleLikedForm } from "../util/types/queryTypes"
import { alertErrorMessage } from "../util/functions"

interface LADProps {
  problemIdx: number,
  username: string,
  creator: string,
  likeCount: number
}

export function Like({ problemIdx, username, creator, likeCount }: LADProps) {
  const userInfo: UserInfo = JSON.parse(sessionStorage.getItem(USERINFO) || initialUserInfo)
  const [info, setInfo] = useState({
    like: userInfo.liked.includes(problemIdx),
    likeCount: likeCount,
  })
  const [handleLiked, { isLoading: hlLoading }] = useHandleLikedMutation()

  async function handleLike() {
    const c = info.likeCount
    const idx = userInfo.liked.indexOf(problemIdx)
    const form: HandleLikedForm = {
      problemIndex: problemIdx,
      name: username,
      creator: creator,
      add: !info.like
    }
    try {
      await handleLiked(form).unwrap()
      if (info.like) {
        setInfo({
          like: false,
          likeCount: c - 1
        })
        if (idx !== -1) {
          userInfo.liked.splice(idx, 1)
        }
      } else {
        setInfo({
          like: true,
          likeCount: c + 1
        })
        if (idx === -1) {
          userInfo.liked.push(problemIdx)
        }
      }
      sessionStorage.setItem(USERINFO, JSON.stringify(userInfo))
    } catch (error) {
      if (typeof error === "object" && error !== null && "originalStatus" in error) {
        alertErrorMessage(Number(error.originalStatus))
      }
    }
  }

  useEffect(() => {
    setInfo({
      like: userInfo.liked.includes(problemIdx),
      likeCount: likeCount,
    })
  }, [problemIdx, likeCount])
  return (
    <Box textAlign="center" display="flex" alignItems="center" justifyContent="center">
      <Checkbox icon={<FavoriteBorder/>} checkedIcon={<Favorite/>} checked={info.like} color="error" onChange={handleLike}></Checkbox>
      <Typography>{info.likeCount}</Typography>
    </Box>
  )
}