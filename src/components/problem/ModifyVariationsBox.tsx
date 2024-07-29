import { useParams } from "react-router-dom"
import { initialProblemInfo, initialProblemInformation } from "../../util/initialForms"
import { LoadingPage } from "../LoadingPage"
import { useGetProblemByIdxQuery } from "../../slices/problemApiSlice"
import { useGetProblemInformationsQuery } from "../../slices/problemInformationApiSlice"
import { ModifyVariations } from "./ModifyVariations"
// import { MobileModifyVariations } from "../mobile/MobileModifyVariations"

export function ModifyVariationsBox() {

  const { param } = useParams()

  const { data: pi, isLoading: piLoading } = useGetProblemByIdxQuery(Number(param))
  const { data: problemInformations, isLoading: pInfoLoading } = useGetProblemInformationsQuery(Number(param))

  if (piLoading || pInfoLoading) return <LoadingPage/>

  return (
    <ModifyVariations 
      pi={pi ?? initialProblemInfo} 
      pInfo={problemInformations || initialProblemInformation}
    />
  )

}