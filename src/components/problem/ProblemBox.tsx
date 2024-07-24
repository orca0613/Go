import { useParams } from "react-router-dom"
import { initialProblemInfo } from "../../util/initialForms"
import { Problem } from "./Problem"
import { LoadingPage } from "../LoadingPage"
import { useGetProblemByIdxQuery } from "../../slices/problemApiSlice"

export function ProblemBox() {

  const { param } = useParams()

  const { data: problemInfo, isLoading: piLoading } = useGetProblemByIdxQuery(Number(param))

  if (piLoading) return <LoadingPage></LoadingPage>

  return (
    <Problem pi={problemInfo ?? initialProblemInfo}></Problem>
  )

}