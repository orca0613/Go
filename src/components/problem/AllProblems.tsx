import { ProblemInfo } from '../../util/types'
import { useEffect, useState } from 'react'
import { convertFromStringToTwoD, getProblems } from '../../util/functions'
import SampleProblemBox from './SampleProblemBox'
import { setProblemList } from '../../redux/actions'
import problemStore from '../../store/problemStore'

export default function AllProblems() {

  const [allProblem, setAllProblem] = useState<ProblemInfo[]>([])


  useEffect(() => {
    const result = getProblems()
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
      problemStore.dispatch(setProblemList(all))
    })
  }, [])

  return (
    <SampleProblemBox></SampleProblemBox>
  )
}