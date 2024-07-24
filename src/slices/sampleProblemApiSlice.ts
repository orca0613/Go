import { CREATED_TAG, FILTER_TAG, LIKED_TAG, NEWEST_TAG, RECOMMENDED_TAG, REPRESENTATIVE_TAG, SOLVED_TAG, UNSOLVED_TAG, USER_SOLVED_TAG, apiSlice } from "../rtk/api";

import { SAMPLE_PATH } from "../util/paths";
import { SampleProblemInformation } from "../util/types";

const myPageTag = [
  CREATED_TAG,
  SOLVED_TAG,
  UNSOLVED_TAG,
  LIKED_TAG,
]

const sampleProblemApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getRecommended: builder.query<SampleProblemInformation[], string>({
      query: (name) => `${SAMPLE_PATH}/get-recommended/${name}`,
      transformResponse: (res: SampleProblemInformation[]) => {
        return res
      },
      providesTags: [RECOMMENDED_TAG],
    }),
    getNewest: builder.query<SampleProblemInformation[], void>({
      query: () => `${SAMPLE_PATH}/get-newest`,
      transformResponse: (res: SampleProblemInformation[]) => {
        return res
      },
      keepUnusedDataFor: 300,
      providesTags: [NEWEST_TAG]
    }),
    getSampleByFilter: builder.query<SampleProblemInformation[], string>({
      query: (filter) => `${SAMPLE_PATH}/get-by-filter/${filter}`,
      transformResponse: (res: SampleProblemInformation[]) => {
        return res
      },
      keepUnusedDataFor: 300,
      providesTags: [FILTER_TAG]
    }),
    getUserRepresentative: builder.query<SampleProblemInformation[], string>({
      query: (name) => `${SAMPLE_PATH}/get-representative/${name}`,
      transformResponse: (res: SampleProblemInformation[]) => {
        return res
      },
      providesTags: [REPRESENTATIVE_TAG]
    }),
    getUserSolved: builder.query<SampleProblemInformation[], string>({
      query: (name) => `${SAMPLE_PATH}/get-solved/${name}`,
      transformResponse: (res: SampleProblemInformation[]) => {
        return res
      },
      providesTags: [USER_SOLVED_TAG]
    }),
    getSampleCreated: builder.query<SampleProblemInformation[], string>({
      query: (problemIndexList) => `${SAMPLE_PATH}/get-by-idx-list/${problemIndexList}`,
      transformResponse: (res: SampleProblemInformation[]) => {
        return res
      },
      providesTags: [CREATED_TAG]
    }),    
    getSampleSolved: builder.query<SampleProblemInformation[], string>({
      query: (problemIndexList) => `${SAMPLE_PATH}/get-by-idx-list/${problemIndexList}`,
      transformResponse: (res: SampleProblemInformation[]) => {
        return res
      },
      providesTags: [SOLVED_TAG]
    }),    
    getSampleUnsolved: builder.query<SampleProblemInformation[], string>({
      query: (problemIndexList) => `${SAMPLE_PATH}/get-by-idx-list/${problemIndexList}`,
      transformResponse: (res: SampleProblemInformation[]) => {
        return res
      },
      providesTags: [UNSOLVED_TAG]
    }),    
    getSampleLiked: builder.query<SampleProblemInformation[], string>({
      query: (problemIndexList) => `${SAMPLE_PATH}/get-by-idx-list/${problemIndexList}`,
      transformResponse: (res: SampleProblemInformation[]) => {
        return res
      },
      providesTags: [LIKED_TAG]
    }),
  })

})

export const { 
  useGetRecommendedQuery, 
  useGetNewestQuery, 
  useGetSampleByFilterQuery, 
  useGetUserRepresentativeQuery,
  useGetUserSolvedQuery,
  useGetSampleCreatedQuery,
  useGetSampleSolvedQuery,
  useGetSampleUnsolvedQuery,
  useGetSampleLikedQuery,
 } = sampleProblemApiSlice