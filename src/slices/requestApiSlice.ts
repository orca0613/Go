import { USER_DETAIL_TAG, apiSlice } from "../rtk/api";
import { REQUESTS_DB_PATH, USER_DB_PATH } from "../util/paths";
import { CreateAccountForm, LoginRequest, LoginResponse } from "../util/types/types";
import { PATCH, POST } from "../util/constants";
import { checkRequestForm, sendRequestForm } from "../util/types/queryTypes";

const requestApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    sendRequest: builder.mutation<void, sendRequestForm>({
      query: (body) => ({
        url: `${REQUESTS_DB_PATH}/send`,
        method: POST,
        body,
      })
    }),
    checkRequest: builder.mutation<void, checkRequestForm>({
      query: (body) => ({
        url: `${REQUESTS_DB_PATH}/check`,
        method: PATCH,
        body,
      })
    })
  })
})

export const { useSendRequestMutation, useCheckRequestMutation } = requestApiSlice