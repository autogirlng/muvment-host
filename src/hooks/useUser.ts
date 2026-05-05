"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { clearUser, setUser } from "@/lib/features/userSlice";
import { useAppDispatch } from "@/lib/hooks";
import { useHttp } from "@/hooks/useHttp";
import { User } from "@/types";

export default function useUser() {
  const http = useHttp();
  const dispatch = useAppDispatch();
  const { data: session, status } = useSession();

  const getUser = useQuery({
    queryKey: ["getUser"],
    queryFn: () => http.get<User>("/users/me"),
    enabled: !!session?.user?.accessToken,
    retry: 1,
  });

  useEffect(() => {
    if (getUser.isSuccess) {
      dispatch(
        setUser({
          // @ts-ignore
          user: getUser.data,
          userToken: session?.user?.accessToken || "",
          isAuthenticated: true,
          isLoading: false,
        })
      );
    }

    if (getUser.isError) {
      dispatch(clearUser());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getUser.isError, getUser.isSuccess]);

  return {
    getUser,
    session,
  };
  
}
