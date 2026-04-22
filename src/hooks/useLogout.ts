"use client";
import { signOut } from "next-auth/react";
import { clearUser } from "@/lib/features/userSlice";
import { useAppDispatch } from "@/lib/hooks";
import { useQueryClient } from "@tanstack/react-query";

export default function useLogout() {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  const logoutUser = () => {
    dispatch(clearUser());
    queryClient.clear();
    signOut({ callbackUrl: "/login" });
  };

  return {
    logoutUser,
  };
}
