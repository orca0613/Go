import { CREATED_TAG, FILTER_TAG, LIKED_TAG, LIKE_COUNT_TAG, NEWEST_TAG, PROBLEM_TAG, RECOMMENDED_TAG, REPRESENTATIVE_TAG, SOLVED_TAG, UNSOLVED_TAG, USER_SOLVED_TAG, apiSlice } from "../rtk/api";
import { PATCH, problemKeepingTime } from "../util/constants";

import { SAMPLE_PATH } from "../util/paths";
import { handleLikedForm } from "../util/types/queryTypes";
import { SampleProblemInformation } from "../util/types/types";

const sampleProblemApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getRecommended: builder.query<SampleProblemInformation[], string>({
      query: (name) => `${SAMPLE_PATH}/get-recommended/${name}`,
      transformResponse: (res: SampleProblemInformation[]) => {
        return res
      },
      keepUnusedDataFor: problemKeepingTime,
      providesTags: [RECOMMENDED_TAG],
    }),
    getNewest: builder.query<SampleProblemInformation[], void>({
      query: () => `${SAMPLE_PATH}/get-newest`,
      transformResponse: (res: SampleProblemInformation[]) => {
        return res
      },
      keepUnusedDataFor: problemKeepingTime,
      providesTags: [NEWEST_TAG]
    }),
    getSampleByFilter: builder.query<SampleProblemInformation[], string>({
      query: (filter) => `${SAMPLE_PATH}/get-by-filter/${filter}`,
      transformResponse: (res: SampleProblemInformation[]) => {
        return res
      },
      keepUnusedDataFor: problemKeepingTime,
      providesTags: [FILTER_TAG]
    }),
    getUserRepresentative: builder.query<SampleProblemInformation[], string>({
      query: (name) => `${SAMPLE_PATH}/get-representative/${name}`,
      transformResponse: (res: SampleProblemInformation[]) => {
        return res
      },
      keepUnusedDataFor: problemKeepingTime,
      providesTags: [REPRESENTATIVE_TAG]
    }),
    getUserSolved: builder.query<SampleProblemInformation[], string>({
      query: (name) => `${SAMPLE_PATH}/get-solved/${name}`,
      transformResponse: (res: SampleProblemInformation[]) => {
        return res
      },
      keepUnusedDataFor: problemKeepingTime,
      providesTags: [USER_SOLVED_TAG]
    }),
    getSampleCreated: builder.query<SampleProblemInformation[], string>({
      query: (problemIndexList) => `${SAMPLE_PATH}/get-by-idx-list/${problemIndexList}`,
      transformResponse: (res: SampleProblemInformation[]) => {
        return res
      },
      keepUnusedDataFor: problemKeepingTime,
      providesTags: [CREATED_TAG]
    }),    
    getSampleSolved: builder.query<SampleProblemInformation[], string>({
      query: (problemIndexList) => `${SAMPLE_PATH}/get-by-idx-list/${problemIndexList}`,
      transformResponse: (res: SampleProblemInformation[]) => {
        return res
      },
      keepUnusedDataFor: problemKeepingTime,
      providesTags: [SOLVED_TAG]
    }),    
    getSampleUnsolved: builder.query<SampleProblemInformation[], string>({
      query: (problemIndexList) => `${SAMPLE_PATH}/get-by-idx-list/${problemIndexList}`,
      transformResponse: (res: SampleProblemInformation[]) => {
        return res
      },
      keepUnusedDataFor: problemKeepingTime,
      providesTags: [UNSOLVED_TAG, SOLVED_TAG]
    }),    
    getSampleLiked: builder.query<SampleProblemInformation[], string>({
      query: (problemIndexList) => `${SAMPLE_PATH}/get-by-idx-list/${problemIndexList}`,
      transformResponse: (res: SampleProblemInformation[]) => {
        return res
      },
      keepUnusedDataFor: problemKeepingTime,
      providesTags: [LIKED_TAG]
    }),
    getSampleRequests: builder.query<SampleProblemInformation[], string>({
      query: (problemIndexList) => `${SAMPLE_PATH}/get-by-idx-list/${problemIndexList}`,
      transformResponse: (res: SampleProblemInformation[]) => {
        return res
      },
    }),
    handleLiked: builder.mutation<void, handleLikedForm>({
      query: (body) => ({
        url: `${SAMPLE_PATH}/handle-liked`,
        method: PATCH,
        body,
      }),
      invalidatesTags: [LIKED_TAG, LIKE_COUNT_TAG]
    }),
    getLikeCount: builder.query<number, number>({
      query: (problemIndex) => `${SAMPLE_PATH}/get-like/${problemIndex}`,
      transformResponse: (res: number) => {
        return res
      },
      providesTags: [LIKE_COUNT_TAG]
    })
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
  useGetSampleRequestsQuery,
  useHandleLikedMutation,
  useGetLikeCountQuery
 } = sampleProblemApiSlice