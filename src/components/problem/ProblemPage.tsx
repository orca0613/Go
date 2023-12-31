import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { addElementToLocalStorage, convertFromStringToTwoD, isInLocalStorage } from "../../util/functions";
import { TRIED, USERNAME, initialProblemInfo, initialVariations } from "../../util/constants";
import _ from "lodash";
import { ProblemBox } from "./ProblemBox";
import { changeCount } from "../../network/problemInformation";
import { getProblemById } from "../../network/problem";
import { addElement } from "../../network/userDetail";

export function ProblemPage() {

  const { problemId } = useParams()
  const username = localStorage.getItem(USERNAME)?? ""
  const [problemInfo, setProblemInfo] = useState(initialProblemInfo)

  useEffect(() => {

    if (problemId) {
      changeCount(problemId, "view", username)
      const newProblemInfo = getProblemById(problemId)
      .then(p => {
        setProblemInfo({
          ...p,
          initialState: convertFromStringToTwoD(p.initialState)
        })
        if (!_.isEqual(p.answers, initialVariations)) {
          if (!isInLocalStorage(TRIED, problemId)) {
            addElement(problemId, username, TRIED)
            addElementToLocalStorage(TRIED, problemId)
          }
        }
      })
      
    }

  }, [problemId])

  return (
    <ProblemBox problemInfo={problemInfo}></ProblemBox>
  )
}