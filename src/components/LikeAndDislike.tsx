import { useEffect, useState } from "react"
import { DISLIKED, LANGUAGE_IDX, LIKED } from "../util/constants"
import { Box, Button, Grid } from "@mui/material"
import { menuWords } from "../util/menuWords"
import { addUsername, deleteUsername, getProblemInformations } from "../network/problemInformation"
import { addElement, deleteElement } from "../network/userDetail"

interface LADProps {
  problemId: string,
  username: string,
}

export function LikeAndDislike({ problemId, username }: LADProps) {
  const languageIdx = Number(localStorage.getItem(LANGUAGE_IDX))
  const [info, setInfo] = useState({
    like: false,
    dislike: false,
    likeCount: 0,
    dislikeCount: 0,
  })

  function handleLike() {
    const c = info.likeCount
    if (info.like) {
      deleteUsername(username, problemId, LIKED)
      deleteElement(problemId, username, LIKED)
      setInfo({
        ...info,
        like: false,
        likeCount: c - 1
      })
    } else {
      addElement(problemId, username, LIKED)
      addUsername(username, problemId, LIKED)
      setInfo({
        ...info,
        like: true,
        likeCount: c + 1
      })
    }
  }

  function handleDislike() {
    const c = info.dislikeCount
    if (info.dislike) {
      deleteElement(problemId, username, DISLIKED)
      deleteUsername(username, problemId, DISLIKED)
      setInfo({
        ...info,
        dislike: false,
        dislikeCount: c - 1
      })
    } else {
      addUsername(username, problemId, DISLIKED)
      addElement(problemId, username, DISLIKED)
      setInfo({
        ...info,
        dislike: true,
        dislikeCount: c + 1
      })
    }
  }

  useEffect(() => {
    if (problemId) {
      const newInformation = getProblemInformations(problemId)
      .then(information => {
        setInfo({
          like: information.liked.includes(username),
          likeCount: information.liked.length,
          dislike: information.disliked.includes(username),
          dislikeCount: information.disliked.length
        })
      })

    }
  }, [problemId])
  return (
    <Grid container textAlign="center">
      <Grid item xs={12}>
        <Button sx={{color: info.like? "green" : "black"}} onClick={handleLike}>{menuWords.like[languageIdx]} {info.likeCount}</Button>
        <Button sx={{color: info.dislike? "red" : "black"}} onClick={handleDislike}>{menuWords.dislike[languageIdx]} {info.dislikeCount}</Button>
      </Grid>
    </Grid>
  )
}