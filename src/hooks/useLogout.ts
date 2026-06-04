"use client";
import { signOut } from "next-auth/react";
import { clearUser } from "@/lib/features/userSlice";
import { useAppDispatch } from "@/lib/hooks";
import { useQueryClient } from "@tanstack/react-query";

export default function useLogout() {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  const logoutUser = async () => {
    // 1. Clear the NextAuth JWT cookie first (await so the cookie is gone
    //    before we clear Redux — prevents useUser from re-populating the store
    //    via the still-alive session token during the async gap).
    await signOut({ redirect: false });

    // 2. Clear Redux and React Query cache.
    dispatch(clearUser());
    queryClient.clear();

    // 3. Hard navigate to login so no React state survives.
    window.location.href = "/login";
  };

  return {
    logoutUser,
  };
}
