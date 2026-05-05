"use client";

import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { clearUser, setUser } from "@/lib/features/userSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useHttp } from "@/hooks/useHttp";
import { USER_ME_PATH } from "@/utils/constants";
import { User, ErrorResponse } from "@/types";

export default function useUser() {
  const http = useHttp();
  const dispatch = useAppDispatch();
  const { data: session, status } = useSession();
  const userToken = useAppSelector((s) => s.user.userToken);

  const bearer =
    session?.user?.accessToken || userToken || "";
  const getUser = useQuery({
    queryKey: ["getUser", bearer],
    queryFn: () => http.get<User>(USER_ME_PATH),
    enabled: !!bearer && (!!userToken || status !== "loading"),
    retry: 1,
  });

  useEffect(() => {
    if (getUser.isSuccess) {
      dispatch(
        setUser({
          // @ts-ignore
          user: getUser.data,
          userToken:
            session?.user?.accessToken || userToken || "",
          isAuthenticated: true,
          isLoading: false,
        })
      );
    }

    if (getUser.isError && getUser.error) {
      const status = (getUser.error as AxiosError<ErrorResponse>).response?.status;
      if (status === 401 || status === 403) {
        dispatch(clearUser());
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getUser.isError, getUser.isSuccess, getUser.error, session?.user?.accessToken, userToken]);

  return {
    getUser,
    session,
  };
  
}
