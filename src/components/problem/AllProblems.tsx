import { ProblemInfo } from '../../util/types'
import { useEffect, useState } from 'react'
import { convertFromStringToTwoD } from '../../util/functions'
import SampleProblemBox from './SampleProblemBox'
import { getAllProblems } from '../../util/network'

export default function AllProblems() {

  const [allProblem, setAllProblem] = useState<ProblemInfo[]>([])

  useEffect(() => {
    const result = getAllProblems()
    const all: ProblemInfo[] = []
    result.then(r => {
      r.map(p => {
        const newProblem: ProblemInfo = {
          ...p,
          initialState: convertFromStringToTwoD(p.initialState)
        }
        all.push(newProblem)
      })
      setAllProblem(all)
    })
  }, [])

  return (
    <SampleProblemBox problems={allProblem}></SampleProblemBox>
  )
}