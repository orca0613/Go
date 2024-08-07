import { useParams } from "react-router-dom"
import { initialProblemInfo, initialProblemInformation } from "../../util/initialForms"
import { Problem } from "./Problem"
import { LoadingPage } from "../LoadingPage"
import { useGetProblemByIdxQuery } from "../../slices/problemApiSlice"
import { useGetProblemInformationsQuery } from "../../slices/problemInformationApiSlice"
import { useGetLikeCountQuery } from "../../slices/sampleProblemApiSlice"

export function ProblemBox() {

  const { param } = useParams()

  const { data: pi, isLoading: piLoading } = useGetProblemByIdxQuery(Number(param))
  const { data: problemInformations, isLoading: pInfoLoading } = useGetProblemInformationsQuery(Number(param))
  const { data: likeCount, isLoading: lcLoading } = useGetLikeCountQuery(Number(param))

  if (piLoading || pInfoLoading || lcLoading) return <LoadingPage></LoadingPage>

  return (
    <Problem 
      pi={pi ?? initialProblemInfo} 
      problemInformations={problemInformations ?? initialProblemInformation}
      likeCount={Number(likeCount)}
    />
  )

}