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

function pickStr(obj: Record<string, unknown>, ...keys: string[]): string {
  for (const k of keys) {
    const v = obj[k];
    if (typeof v === "string" && v.length > 0) return v;
    if (typeof v === "number" && Number.isFinite(v)) return String(v);
  }
  return "";
}

function coerceVerified(v: unknown): boolean {
  if (v === true || v === 1) return true;
  if (v === false || v === 0 || v == null) return false;
  if (typeof v === "string") {
    const s = v.trim().toLowerCase();
    return s === "true" || s === "1" || s === "yes";
  }
  return Boolean(v);
}

/** Walk `{ data: { ... } }` wrappers until we find an object that looks like a user profile. */
function extractProfilePayload(raw: Record<string, unknown>): Record<string, unknown> {
  let cur: Record<string, unknown> = raw;
  for (let depth = 0; depth < 4; depth++) {
    if (pickStr(cur, "email") || pickStr(cur, "userId", "user_id")) {
      return cur;
    }
    const next = cur.data;
    if (next && typeof next === "object" && !Array.isArray(next)) {
      cur = next as Record<string, unknown>;
      continue;
    }
    break;
  }
  return raw;
}

/** Maps `/users/me` JSON (camelCase or snake_case, envelope or bare profile) into `User`. */
function normalizeUserFromMeApi(raw: unknown): User {
  if (raw == null || typeof raw !== "object") {
    throw new Error("Invalid user profile response");
  }

  const r = raw as Record<string, unknown>;
  const d = extractProfilePayload(r);

  return {
    status: String(r.status ?? "SUCCESSFUL"),
    message: String(r.message ?? ""),
    errorCode: r.errorCode as string | undefined,
    timestamp: String(r.timestamp ?? ""),
    data: {
      userId: pickStr(d, "userId", "user_id", "id", "sub"),
      firstName: pickStr(d, "firstName", "first_name"),
      lastName: pickStr(d, "lastName", "last_name"),
      email: pickStr(d, "email"),
      phoneNumber: pickStr(d, "phoneNumber", "phone_number"),
      userType: "HOST",
      emailVerified: coerceVerified(d.emailVerified ?? d.email_verified),
      phoneVerified: coerceVerified(d.phoneVerified ?? d.phone_verified),
      profilePictureUrl:
        pickStr(d, "profilePictureUrl", "profile_picture_url") || undefined,
      referralCode:
        pickStr(d, "referralCode", "referral_code") || undefined,
    },
  };
}

export default function useUser() {
  const http = useHttp();
  const dispatch = useAppDispatch();
  const { data: session, status } = useSession();
  const userToken = useAppSelector((s) => s.user.userToken);

  const bearer =
    session?.user?.accessToken || userToken || "";
  const getUser = useQuery({
    queryKey: ["getUser", bearer],
    queryFn: async () => {
      const raw = await http.get<unknown>(USER_ME_PATH);
      return normalizeUserFromMeApi(raw);
    },
    enabled: !!bearer && (!!userToken || status !== "loading"),
    retry: 1,
  });

  useEffect(() => {
    if (getUser.isSuccess && getUser.data) {
      dispatch(
        setUser({
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
