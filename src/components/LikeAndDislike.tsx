import { useEffect, useState } from "react"
import { addElementToLocalStorage, deleteElementFromLocalStorage, isInLocalStorage } from "../util/functions"
import { DISLIKED, LANGUAGE_IDX, LIKED } from "../util/constants"
import { Box, Button } from "@mui/material"
import { menuWords } from "../util/menuWords"
import { changeCount, getProblemInformations } from "../network/problemInformation"
import { addElement, deleteElement } from "../network/userDetail"

interface LADProps {
  problemId: string,
  username: string
}

export function LikeAndDislike({ problemId, username }: LADProps) {
  const languageIdx = Number(localStorage.getItem(LANGUAGE_IDX))
  const [info, setInfo] = useState({
    liked: false,
    likeCount: 0,
    disliked: false,
    dislikeCount: 0
  })

  function handleLike() {
    const c = info.likeCount
    if (info.liked) {
      changeCount(problemId, "like", username, true)
      deleteElement(problemId, username, LIKED)
      deleteElementFromLocalStorage(LIKED, problemId)
      setInfo({
        ...info,
        liked: false,
        likeCount: c - 1
      })
    } else {
      changeCount(problemId, "like", username)
      addElement(problemId, username, LIKED)
      addElementToLocalStorage(LIKED, problemId)
      setInfo({
        ...info,
        liked: true,
        likeCount: c + 1
      })
    }
  }

  function handleDislike() {
    const c = info.dislikeCount
    if (info.disliked) {
      changeCount(problemId, "dislike", username, true)
      deleteElement(problemId, username, DISLIKED)
      deleteElementFromLocalStorage(DISLIKED, problemId)
      setInfo({
        ...info,
        disliked: false,
        dislikeCount: c - 1
      })
    } else {
      changeCount(problemId, "dislike", username)
      addElement(problemId, username, DISLIKED)
      addElementToLocalStorage(DISLIKED, problemId)
      setInfo({
        ...info,
        disliked: true,
        dislikeCount: c + 1
      })
    }
  }

  useEffect(() => {
    const newLiked = isInLocalStorage(LIKED, problemId)
    const newDisliked = isInLocalStorage(DISLIKED, problemId)
    if (problemId) {
      const newInformation = getProblemInformations(problemId)
      .then(information => {
        setInfo({
          liked: newLiked,
          likeCount: information.like,
          disliked: newDisliked,
          dislikeCount: information.dislike
        })
      })
    }
  }, [problemId])
  return (
    <Box sx={{alignItems: "center", margin: 2}}>
      <Button sx={{color: info.liked? "green" : "black"}} onClick={handleLike}>{menuWords.like[languageIdx]} {info.likeCount}</Button>
      <Button sx={{color: info.disliked? "red" : "black"}} onClick={handleDislike}>{menuWords.dislike[languageIdx]} {info.dislikeCount}</Button>
    </Box>
  )
}