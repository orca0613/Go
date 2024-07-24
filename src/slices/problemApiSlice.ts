import { ALL_CREATOR_TAG, CREATED_TAG, FILTER_TAG, NEWEST_TAG, RECOMMENDED_TAG, apiSlice } from "../rtk/api";
import { DELETE, POST } from "../util/constants";
import { PROBLEM_DB_PATH } from "../util/paths";
import { CreateProblemForm, DeleteProblemFrom, ProblemAndVariations } from "../util/types";

const problemApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createProblem: builder.mutation<number, CreateProblemForm>({
      query: (body) => ({
        url: `${PROBLEM_DB_PATH}/create`,
        method: POST,
        body,
      }),
      transformResponse: (res: number) => {
        return res
      },
      invalidatesTags: [NEWEST_TAG, FILTER_TAG, ALL_CREATOR_TAG, CREATED_TAG]
    }),
    deleteProblem: builder.mutation<void, DeleteProblemFrom>({
      query: (body) =>({
        url: `${PROBLEM_DB_PATH}/delete`,
        method: DELETE,
        body,
      }),
      invalidatesTags: [NEWEST_TAG, RECOMMENDED_TAG, FILTER_TAG, ALL_CREATOR_TAG, CREATED_TAG]
    }),
    getProblemByIdx: builder.query<ProblemAndVariations, number>({
      query: (problemIdx) => `${PROBLEM_DB_PATH}/get-by-idx/${problemIdx}`,
      transformResponse: (res: ProblemAndVariations) => {
        return res
      }
    })
  })
})

export const { 
  useCreateProblemMutation, 
  useDeleteProblemMutation, 
  useGetProblemByIdxQuery 
} = problemApiSlice