import type { Middleware, MiddlewareAPI } from "@reduxjs/toolkit";
import { isRejectedWithValue } from "@reduxjs/toolkit";
// import { toast } from "components/shadcn/use-toast";
// import { STORED_TOKEN_KEY, STORED_USER_KEY } from "features/authApiSlice";
const STORED_TOKEN_KEY = "token"
const STORED_USER_KEY = "user"

/**
 * See https://redux-toolkit.js.org/rtk-query/usage/error-handling
 * Log a warning and show error toast
 * If the token has expired, redirect to the login page
 */
export const rtkQueryErrorLogger: Middleware = (api: MiddlewareAPI) => (next) => (action) => {
  if (isRejectedWithValue(action)) {
    // toast({
    //   title: "Error",
    //   variant: "destructive",
    //   description: getErrorMessage(action),
    // });

    // action's paylod format - "payload": {"status":403,"data":{"error":"Forbidden"}}
    if (action.payload && (action.payload as { status: number }).status === 403) {
      // Token has expired, clear the token so client is redirected to the login page
      console.warn("Token has expired, rerouting to login.");
      // toast({
      //   title: "Login expired",
      //   variant: "default",
      //   description: "Login token has expired, rerouting to the login page.",
      // });
      localStorage.removeItem(STORED_TOKEN_KEY);
      localStorage.removeItem(STORED_USER_KEY);
      window.location.replace("/");
    }
  }

  return next(action);
};

function getErrorMessage(action: any) {
  let message = action.error?.message;
  if (action.payload?.status === 400 && typeof action.payload?.data === "string") {
    message = extractErrorMessage(action.payload.data);
  } else if (action.payload?.originalStatus === 401) {
    message = "Permission denied";
  } else if (action.payload?.data) {
    message = action.payload.data.message;
  }
  return message;
}

function extractErrorMessage(error: string) {
  if (typeof error === "string") {
    return error;
  }
  try {
    const zodError = JSON.parse(error);
    return (
      "Request error: " +
      zodError
        .map((e: any) => {
          return `**${e.code}**
        '${e.path?.join(", ")}'
        should be '${e.expected}'
        but it is actually '${e.received}'
      `;
        })
        .join(", ")
    );
  } catch {
    return "An unknown error has occurred";
  }
}
