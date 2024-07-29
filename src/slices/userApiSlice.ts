import { USER_DETAIL_TAG, apiSlice } from "../rtk/api";
import { USER_DB_PATH } from "../util/paths";
import { CreateAccountForm, LoginRequest, LoginResponse } from "../util/types/types";
import { POST } from "../util/constants";

const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (body) => ({
        url: `${USER_DB_PATH}/login`,
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