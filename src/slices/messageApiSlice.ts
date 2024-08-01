import { PROBLEM_TAG, RECEIVED_MESSAGE_TAG, SENT_MESSAGE_TAG, UNCHECKED_MESSAGE_TAG, apiSlice } from "../rtk/api";
import { MESSAGE_DB_PATH } from "../util/paths";
import { MessageForm } from "../util/types/types";
import { PATCH, POST } from "../util/constants";
import { CheckMessageForm, HideMessageForm, SendMessageForm,  } from "../util/types/queryTypes";

const messageApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    sendMessage: builder.mutation<void, SendMessageForm>({
      query: (body) => ({
        url: `${MESSAGE_DB_PATH}/send`,
        method: POST,
        body,
      }),
      invalidatesTags: [SENT_MESSAGE_TAG]
    }),
    getReceivedMessage: builder.query<MessageForm[], string>({
      query: (name) => `${MESSAGE_DB_PATH}/get-by-receiver/${name}`,
      transformResponse: (res: MessageForm[]) => {
        return res
      },
      providesTags: [RECEIVED_MESSAGE_TAG, PROBLEM_TAG]
    }),
    getSentMessage: builder.query<MessageForm[], string>({
      query: (name) => `${MESSAGE_DB_PATH}/get-by-sender/${name}`,
      transformResponse: (res: MessageForm[]) => {
        return res
      },
      providesTags: [SENT_MESSAGE_TAG]
    }),
    checkMessage: builder.mutation<void, CheckMessageForm>({
      query: (body) => ({
        url: `${MESSAGE_DB_PATH}/check`,
        method: PATCH,
        body,
      }),
      invalidatesTags: [RECEIVED_MESSAGE_TAG, UNCHECKED_MESSAGE_TAG]
    }),
    hideMessage: builder.mutation<void, HideMessageForm>({
      query: (body) => ({
        url: `${MESSAGE_DB_PATH}/hide-message`,
        method: PATCH,
        body,
      }),
      invalidatesTags: [RECEIVED_MESSAGE_TAG, SENT_MESSAGE_TAG, UNCHECKED_MESSAGE_TAG]
    }),
    getNumberUnchecked: builder.query<number, string>({
      query: (name) => `${MESSAGE_DB_PATH}/get-unchecked/${name}`,
      transformResponse: (res: number) => {
        return res
      },
      providesTags: [UNCHECKED_MESSAGE_TAG]
    })
  })
})

export const { 
  useSendMessageMutation, 
  useGetReceivedMessageQuery, 
  useGetSentMessageQuery,
  useCheckMessageMutation,
  useHideMessageMutation,
  useGetNumberUncheckedQuery,
} = messageApiSlice