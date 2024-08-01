import { USER_DETAIL_TAG, apiSlice } from "../rtk/api";
import { USER_DB_PATH } from "../util/paths";
import { DELETE, PATCH, POST } from "../util/constants";
import { ChangePasswordForm, CheckPasswordResponse, CreateAccountForm, DeleteAccountForm, LoginRequest, LoginResponse } from "../util/types/queryTypes";

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
    }),
    checkMail: builder.query<boolean, string>({
      query: (email) => `${USER_DB_PATH}/check-email/${email}`,
      transformResponse: (res: boolean) => {
        return res
      }
    }),
    checkUserName: builder.query<boolean, string>({
      query: (name) => `${USER_DB_PATH}/check-name/${name}`,
      transformResponse: (res: boolean) => {
        return res
      }
    }),
    changePassword: builder.mutation<void, ChangePasswordForm>({
      query: (body) => ({
        url: `${USER_DB_PATH}/change-password`,
        method: PATCH,
        body,
      })
    }),
    deleteAccount: builder.mutation<void, DeleteAccountForm>({
      query: (body) => ({
        url: `${USER_DB_PATH}/delete-id`,
        method: DELETE,
        body,
      })
    }),
    checkPassword: builder.query<CheckPasswordResponse, string>({
      query: (info) => `${USER_DB_PATH}/check-password/${info}`,
      transformResponse: (res: CheckPasswordResponse) => {
        return res
      }
    }),
    checkEmailAndGetUrl: builder.query<boolean, string>({
      query: (email) => `${USER_DB_PATH}/check-mail/${email}`,
      transformResponse: (res: boolean) => {
        return res
      }
    })
  })
})

export const { 
  useLoginMutation,
  useCreateAccountMutation,
  useCheckMailQuery,
  useCheckUserNameQuery,
  useChangePasswordMutation,
  useDeleteAccountMutation,
  useCheckEmailAndGetUrlQuery,
  useCheckPasswordQuery,
 } = userApiSlice