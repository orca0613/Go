import { ALL_CREATOR_TAG, CREATED_TAG, FILTER_TAG, LIKED_TAG, NEWEST_TAG, RECOMMENDED_TAG, REPRESENTATIVE_TAG, SOLVED_TAG, UNSOLVED_TAG, USER_DETAIL_TAG, USER_SOLVED_TAG, apiSlice } from "../rtk/api";
import { USER_DB_PATH } from "../util/paths";
import { CreateAccountForm, LoginRequest, LoginResponse, UserInfo } from "../util/types";
import { LANGUAGE_IDX, POST, USERINFO } from "../util/constants";

const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (body) => ({
        url: `${USER_DB_PATH}/rtk-login`,
        method: "POST",
        body,
      }),
      transformResponse: (res: LoginResponse ) => {
        return res;
      },
      invalidatesTags: [USER_DETAIL_TAG]
    }),
    createAccount: builder.mutation<void, CreateAccountForm>({
      query: (body) => ({
        url: `${USER_DB_PATH}/create`,
        method: POST,
        body,
      })
    })
  })
})

export const { useLoginMutation } = userApiSlice