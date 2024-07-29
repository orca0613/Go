import { RECOMMENDED_TAG, SOLVED_TAG, UNSOLVED_TAG, apiSlice } from "../rtk/api";
import { PATCH } from "../util/constants";
import { PROBLEMINFO_DB_PATH } from "../util/paths";
import { AddUserForm, ChangeCountForm, ProblemInformation } from "../util/types/types";

const problemInformationApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addView: builder.mutation<void, ChangeCountForm>({
      query: (body) => ({
        url: `${PROBLEMINFO_DB_PATH}/add-view`,
        method: PATCH,
        body,
      })
    }),
    addCorrectUser: builder.mutation<void, AddUserForm>({
      query: (body) => ({
        url: `${PROBLEMINFO_DB_PATH}/add-correct`,
        method: PATCH,
        body,
      }),
      invalidatesTags: [SOLVED_TAG, UNSOLVED_TAG, RECOMMENDED_TAG]
    }),
    addWrongUser: builder.mutation<void, AddUserForm>({
      query: (body) => ({
        url: `${PROBLEMINFO_DB_PATH}/add-wrong`,
        method: PATCH,
        body,
      }),
    }),
    getProblemInformations: builder.query<ProblemInformation, Number>({
      query: (problemIdx) => `${PROBLEMINFO_DB_PATH}/get/${problemIdx}`,
      transformResponse: (res: ProblemInformation) => {
        return res
      }
    })

  })
})


export const { useAddViewMutation, useAddCorrectUserMutation, useAddWrongUserMutation, useGetProblemInformationsQuery } = problemInformationApiSlice