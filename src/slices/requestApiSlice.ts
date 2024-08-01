import { apiSlice } from "../rtk/api";
import { REQUESTS_DB_PATH } from "../util/paths";
import { PATCH, POST } from "../util/constants";
import { CheckRequestForm, SendRequestForm } from "../util/types/queryTypes";

const requestApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    sendRequest: builder.mutation<void, SendRequestForm>({
      query: (body) => ({
        url: `${REQUESTS_DB_PATH}/send`,
        method: POST,
        body,
      })
    }),
    checkRequest: builder.mutation<void, CheckRequestForm>({
      query: (body) => ({
        url: `${REQUESTS_DB_PATH}/check`,
        method: PATCH,
        body,
      })
    })
  })
})

export const { useSendRequestMutation, useCheckRequestMutation } = requestApiSlice