import { ALL_CREATOR_TAG, FILTER_TAG, RECOMMENDED_TAG, SOLVED_TAG, UNSOLVED_TAG, USER_DETAIL_TAG, apiSlice } from "../rtk/api";
import { PATCH, USERINFO } from "../util/constants";
import { USERDETAIL_DB_PATH } from "../util/paths";
import { AddProblemIndexForm, ChangeSettingForm, UserDetailFromServer } from "../util/types";

const userDetailApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllCreators: builder.query<string[], void>({
      query: () => `${USERDETAIL_DB_PATH}/get-creators`,
      transformResponse: (res: string[]) => {
        return res
      },
      providesTags: [ALL_CREATOR_TAG]
    }),
    changeSetting: builder.mutation<void, ChangeSettingForm>({
      query: (body) => ({
        url: `${USERDETAIL_DB_PATH}/setting`,
        method: PATCH,
        body,
      }),
      invalidatesTags: [RECOMMENDED_TAG, FILTER_TAG]
    }),
    getUserDetail: builder.query<UserDetailFromServer, string>({
      query: (name) => `${USERDETAIL_DB_PATH}/get/${name}`,
      transformResponse: (res: UserDetailFromServer) => {
        sessionStorage.setItem(USERINFO, JSON.stringify(res))
        return res
      },
      providesTags: [USER_DETAIL_TAG]
    }),
    addTried: builder.mutation<void, AddProblemIndexForm>({
      query: (body) => ({
        url: `${USERDETAIL_DB_PATH}/add-element`,
        method: PATCH,
        body,
      }),
      invalidatesTags: [UNSOLVED_TAG]
    }),
    addSolved: builder.mutation<void, AddProblemIndexForm>({
      query: (body) => ({
        url: `${USERDETAIL_DB_PATH}/add-element`,
        method: PATCH,
        body,
      }),
      invalidatesTags: [UNSOLVED_TAG, SOLVED_TAG]
    }),
  })
})


export const { 
  useGetAllCreatorsQuery, 
  useChangeSettingMutation, 
  useGetUserDetailQuery, 
  useAddTriedMutation, 
  useAddSolvedMutation 
} = userDetailApiSlice