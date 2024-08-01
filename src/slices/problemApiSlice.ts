import { ALL_CREATOR_TAG, CREATED_TAG, FILTER_TAG, LIKED_TAG, NEWEST_TAG, PROBLEM_TAG, RECOMMENDED_TAG, REPRESENTATIVE_TAG, SOLVED_TAG, UNSOLVED_TAG, USER_DETAIL_TAG, USER_SOLVED_TAG, apiSlice } from "../rtk/api";
import { DELETE, PATCH, POST } from "../util/constants";
import { PROBLEM_DB_PATH } from "../util/paths";
import { CreateProblemForm, DeleteProblemForm, ModifyProblemForm, UpdateVariationsForm } from "../util/types/queryTypes";
import { ProblemAndVariations } from "../util/types/types";

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
      invalidatesTags: [
        NEWEST_TAG, 
        FILTER_TAG, 
        REPRESENTATIVE_TAG, 
        ALL_CREATOR_TAG, 
        CREATED_TAG,
        USER_DETAIL_TAG,
      ]
    }),
    deleteProblem: builder.mutation<void, DeleteProblemForm>({
      query: (body) =>({
        url: `${PROBLEM_DB_PATH}/delete`,
        method: DELETE,
        body,
      }),
      invalidatesTags: [
        RECOMMENDED_TAG, 
        NEWEST_TAG, 
        FILTER_TAG, 
        REPRESENTATIVE_TAG, 
        USER_SOLVED_TAG, 
        ALL_CREATOR_TAG, 
        CREATED_TAG,
        SOLVED_TAG,
        UNSOLVED_TAG,
        LIKED_TAG,
        USER_DETAIL_TAG,
      ]
    }),
    getProblemByIdx: builder.query<ProblemAndVariations, number>({
      query: (problemIdx) => `${PROBLEM_DB_PATH}/get-by-idx/${problemIdx}`,
      transformResponse: (res: ProblemAndVariations) => {
        return res
      },
      providesTags: [PROBLEM_TAG]
    }),
    updateVariations: builder.mutation<void, UpdateVariationsForm>({
      query: (body) => ({
        url: `${PROBLEM_DB_PATH}/update-variations`,
        method: PATCH,
        body,
      }),
      invalidatesTags: [USER_DETAIL_TAG, PROBLEM_TAG]
    }),
    modifyProblem: builder.mutation<void, ModifyProblemForm>({
      query: (body) => ({
        url: `${PROBLEM_DB_PATH}/modify-problem`,
        method: PATCH,
        body,
      }),
      invalidatesTags: [
        RECOMMENDED_TAG, 
        NEWEST_TAG, 
        FILTER_TAG, 
        REPRESENTATIVE_TAG, 
        USER_SOLVED_TAG, 
        ALL_CREATOR_TAG, 
        CREATED_TAG,
        SOLVED_TAG,
        UNSOLVED_TAG,
        LIKED_TAG,
        USER_DETAIL_TAG,
        PROBLEM_TAG,
      ]
    })
  })
})

export const { 
  useCreateProblemMutation, 
  useDeleteProblemMutation, 
  useGetProblemByIdxQuery,
  useUpdateVariationsMutation,
  useModifyProblemMutation,
} = problemApiSlice