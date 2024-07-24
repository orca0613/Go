import { useParams } from "react-router-dom"
import { initialUserInfo } from "../../util/initialForms"
import { LoadingPage } from "../LoadingPage"
import { useGetSampleCreatedQuery, useGetSampleLikedQuery, useGetSampleRequestsQuery, useGetSampleSolvedQuery, useGetSampleUnsolvedQuery } from "../../slices/sampleProblemApiSlice"
import { CREATED, LIKED, REQUESTS, SOLVED, UNRESOLVED, USERINFO } from "../../util/constants"
import { getUnsolvedIdxArray } from "../../util/functions"
import MyPageProblems from "./MyPageProblems"
import { useEffect, useState } from "react"
import { SampleProblemInformation } from "../../util/types"

export function MyPageProblemBox() {

  const { param } = useParams()
  const userInfo = JSON.parse(sessionStorage.getItem(USERINFO) || initialUserInfo)
  const createdString = JSON.stringify(userInfo.created)
  const solvedString = JSON.stringify(userInfo.solved)
  const likedString = JSON.stringify(userInfo.liked)
  const requestsString = JSON.stringify(userInfo.withQuestions)
  const unsolvedString = JSON.stringify(getUnsolvedIdxArray(userInfo.tried, userInfo.solved))

  const { data: created, isLoading: cpLoading } = useGetSampleCreatedQuery(createdString)
  const { data: solved, isLoading: spLoading } = useGetSampleSolvedQuery(solvedString)
  const { data: unsolved, isLoading: upLoading } = useGetSampleUnsolvedQuery(unsolvedString)
  const { data: liked, isLoading: lpLoading } = useGetSampleLikedQuery(likedString)
  const { data: requests, isLoading: rpLoading } = useGetSampleRequestsQuery(requestsString)

  const [problemList, setProblemList] = useState<SampleProblemInformation[]>([])

  useEffect(() => {
    switch (param) {
      case CREATED:
        setProblemList(created || [])
        break
      case SOLVED:
        setProblemList(solved || []) 
        break
      case UNRESOLVED:
        setProblemList(unsolved || [])
        break
      case LIKED:
        setProblemList(liked || [])
        break
      case REQUESTS:
        setProblemList(requests || [])
        break
      default:
        break
    }
  }, [param, created, solved, unsolved, liked, requests])

  if (cpLoading || spLoading || upLoading || lpLoading || rpLoading) return <LoadingPage></LoadingPage>

  return (
    <MyPageProblems problemList={problemList} part={String(param)} request={param === REQUESTS}></MyPageProblems>
  )

}