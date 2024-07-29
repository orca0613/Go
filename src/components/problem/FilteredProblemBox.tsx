import { FilterForm, SampleProblemInformation } from '../../util/types/types'
import { useEffect, useState } from 'react'
import { ownParse } from '../../util/functions'
import { useParams } from 'react-router-dom'
import { initFilter } from '../../util/initialForms'
import { LoadingPage } from '../LoadingPage'
import { useGetSampleByFilterQuery } from '../../slices/sampleProblemApiSlice'
import FilteredProblems from './FilteredProblems'

export default function FilteredProblemBox() {

  const { params } = useParams()
  const f = params? ownParse(params) : initFilter
  const filter: FilterForm = {
    tier: Number(f.tier),
    level: Number(f.level),
    creator: String(f.creator)
  }

  const { data: filteredProblems, isLoading: fpLoading } = useGetSampleByFilterQuery(String(params))
  const [problemList, setProblemList] = useState<SampleProblemInformation[]>([])

  useEffect(() => {
    if (filteredProblems) {
      setProblemList(filteredProblems)
    }
  }, [params, filteredProblems])

  if (fpLoading) {
    return (
      <LoadingPage></LoadingPage>
    )
  }

  return (
    <FilteredProblems problemList={problemList} tier={filter.tier} level={filter.level} creator={filter.creator}></FilteredProblems>
  )
}

