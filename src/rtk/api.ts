import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_URL, TOKEN } from "../util/constants";

export const RECOMMENDED_TAG = "Recommended"
export const NEWEST_TAG = "Newest"
export const FILTER_TAG = "Filter"
export const REPRESENTATIVE_TAG = "Representative"
export const USER_SOLVED_TAG = "UserSolved"
export const ALL_CREATOR_TAG = "AllCreator"
export const CREATED_TAG = "Created"
export const SOLVED_TAG = "Solved"
export const UNSOLVED_TAG = "Unsolved"
export const LIKED_TAG = "Liked"
export const USER_DETAIL_TAG = "UserDetail"
export const PROBLEM_TAG = "Problem"
export const LIKE_COUNT_TAG = "LikeCount "

const baseQuery = fetchBaseQuery({
  baseUrl: API_URL,
  credentials: "include",
  prepareHeaders: (headers) => {
    const token = sessionStorage.getItem(TOKEN) || ""
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

export const apiSlice = createApi({
  baseQuery: baseQuery,
  endpoints: () => ({}), // Endpoints are injected in features
  tagTypes: [
    RECOMMENDED_TAG,
    NEWEST_TAG,
    FILTER_TAG,
    REPRESENTATIVE_TAG,
    USER_SOLVED_TAG,
    ALL_CREATOR_TAG,
    CREATED_TAG,
    SOLVED_TAG,
    UNSOLVED_TAG,
    LIKED_TAG,
    USER_DETAIL_TAG,
    PROBLEM_TAG,
    LIKE_COUNT_TAG,
    
  ],
});
