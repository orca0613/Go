import { ProblemInformation } from '../../util/types'
import { useEffect, useState } from 'react'
import SampleProblemBox from './SampleProblemBox'
import { getAllProblems } from '../../network/problemInformation'

export default function AllProblems() {

  const [allProblem, setAllProblem] = useState<ProblemInformation[]>([])

  useEffect(() => {
    const result = getAllProblems()
    const all: ProblemInformation[] = []
    result.then(r => {
      r.map(p => {
        all.push(p)
      })
      all.reverse()
      setAllProblem(all)
    })
  }, [])

  return (
    <SampleProblemBox problems={allProblem}></SampleProblemBox>
  )
}