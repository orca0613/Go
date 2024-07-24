import { apiSlice } from "../rtk/api";
import { PATCH } from "../util/constants";
import { PROBLEMINFO_DB_PATH } from "../util/paths";
import { ChangeCountForm } from "../util/types";

const problemInformationApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    changeCount: builder.mutation<void, ChangeCountForm>({
      query: (body) => ({
        url: `${PROBLEMINFO_DB_PATH}/change-count`,
        method: PATCH,
        body,
      })
    })
  })
})


export const { useChangeCountMutation } = problemInformationApiSlice