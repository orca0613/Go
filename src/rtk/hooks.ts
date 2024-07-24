import { useEffect, useState } from "react";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./store";
// import { STORED_USER_KEY, useGetUserInfoQuery } from "features/authApiSlice";
// import { isSuperAdmin } from "utils/role";

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useFetchApi = (asyncActionCreator: Function) => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(asyncActionCreator());
  }, [dispatch, asyncActionCreator]);
};

/**
 * local storage hook for persisting local state data
 * @param key key of the stored item
 * @param fallbackValue default value if item is not found
 * @returns
 */
export function useSessionStorage<T>(key: string, fallbackValue: T) {
  // Retrieve the initial value from localStorage if it exists
  const storedValue = typeof window !== "undefined" ? sessionStorage.getItem(key) : null;
  const initial = storedValue ? JSON.parse(storedValue) : fallbackValue;

  // Create a state to hold the current value
  const [value, setValue] = useState(initial);

  // Update the local storage whenever the value changes
  useEffect(() => {
    if (value === null) {
      sessionStorage.removeItem(key);
    } else {
      sessionStorage.setItem(key, JSON.stringify(value));
    }
  }, [key, value]);

  return [value, setValue] as const;
}

// export function useUserInfo(skipCondition?: boolean) {
//   const user = localStorage.getItem(STORED_USER_KEY);
//   return useGetUserInfoQuery(user ?? "", { skip: !user || skipCondition });
// }

// export function useIsSuperAdmin(skipCondition?: boolean) {
//   const { data, isLoading } = useUserInfo(skipCondition);
//   return { isSuperAdmin: isSuperAdmin(data?.role), isLoading };
// }
