import { REPLY_TAG, apiSlice } from "../rtk/api";
import { PATCH, POST } from "../util/constants";
import { REPLY_DB_PATH } from "../util/paths";
import { AddReplyForm, HideReplyForm } from "../util/types/queryTypes";
import { ReplyForm } from "../util/types/types";


const replyApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getReplies: builder.query<ReplyForm[], string>({
      query: (problemId) => `${REPLY_DB_PATH}/get/${problemId}`,
      transformResponse: (res: ReplyForm[]) => {
        return res
      },
      providesTags: [REPLY_TAG]
    }),
    addReply: builder.mutation<void, AddReplyForm>({
      query: (body) => ({
        url: `${REPLY_DB_PATH}/add`,
        method: POST,
        body,
      }),
      invalidatesTags: [REPLY_TAG]
    }),
    hideReply: builder.mutation<void, HideReplyForm>({
      query: (body) => ({
        url: `${REPLY_DB_PATH}/hide`,
        method: PATCH,
        body,
      }),
      invalidatesTags: [REPLY_TAG]
    })

  })
})

export const { useGetRepliesQuery, useAddReplyMutation, useHideReplyMutation } = replyApiSlice