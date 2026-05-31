"use client";

import { startTransition } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { signIn, useSession } from "next-auth/react";
import { useHttp } from "@/hooks/useHttp";
import { setForgotPasswordOtp } from "@/lib/features/forgotPasswordSlice";
import { setToken, setUser } from "@/lib/features/userSlice";
import { getClientStore } from "@/lib/storeHolder";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { pickSuccessMessage } from "@/utils/functions";
import { AUTH_API_BASE, UserType, USER_ME_PATH } from "@/utils/constants";
import {
  LoginFormValues,
  ResendVerifyEmailTokenValues,
  ResetPasswordEmailValues,
  SetNewPasswordValues,
  SignupFormValues,
  verifyEmailValues,
  verifyEmail,
  loginResponse,
  // Make sure these two types are exported from your types file
  ApiResponse,
  SwitchHostData,
  User,
} from "@/types";

// Note: You can move this interface to your @/types file
export interface ChangePasswordValues {
  oldPassword: string;
  newPassword: string;
}

function pickLoginString(obj: Record<string, unknown>, ...keys: string[]): string | undefined {
  for (const k of keys) {
    const v = obj[k];
    if (typeof v === "string" && v.length > 0) return v;
    if (typeof v === "number" && Number.isFinite(v)) return String(v);
  }
  return undefined;
}

function coerceLoginDataPayload(obj: Record<string, unknown>): loginResponse["data"] | null {
  const accessToken =
    pickLoginString(obj, "accessToken", "access_token", "token") ?? "";
  if (!accessToken) return null;

  return {
    accessToken,
    refreshToken: pickLoginString(obj, "refreshToken", "refresh_token") ?? "",
    userId:
      pickLoginString(obj, "userId", "user_id", "id", "sub") ?? "",
    firstName: pickLoginString(obj, "firstName", "first_name") ?? "",
    lastName: pickLoginString(obj, "lastName", "last_name") ?? "",
    email: pickLoginString(obj, "email") ?? "",
    profilePictureUrl: pickLoginString(obj, "profilePictureUrl", "profile_picture_url"),
    emailVerified: Boolean(obj.emailVerified ?? obj.email_verified),
    phoneVerified: Boolean(obj.phoneVerified ?? obj.phone_verified),
    roles: obj.roles as unknown[] | undefined,
    organizations: obj.organizations as unknown[] | undefined,
  };
}

/** Axios body may be the envelope or one level wrapped; supports camelCase and snake_case tokens. */
function normalizeLoginEnvelope(raw: unknown): loginResponse | null {
  if (raw == null || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const d = r.data;

  let payload: Record<string, unknown> | null = null;

  if (d && typeof d === "object" && d !== null && !Array.isArray(d)) {
    const dd = d as Record<string, unknown>;
    if (coerceLoginDataPayload(dd)) {
      payload = dd;
    } else {
      const inner = dd.data;
      if (inner && typeof inner === "object" && inner !== null && !Array.isArray(inner)) {
        const innerObj = inner as Record<string, unknown>;
        if (coerceLoginDataPayload(innerObj)) payload = innerObj;
      }
    }
  }

  if (!payload && coerceLoginDataPayload(r as Record<string, unknown>)) {
    payload = r as Record<string, unknown>;
  }

  const coerced = payload ? coerceLoginDataPayload(payload) : null;
  if (!coerced) return null;

  return {
    status: String(r.status ?? "SUCCESSFUL"),
    message: String(r.message ?? ""),
    errorCode: r.errorCode as string | undefined,
    data: coerced,
    timestamp: String(r.timestamp ?? ""),
  };
}

function userFromLoginResponse(res: loginResponse): User {
  const d = res.data;
  return {
    status: res.status,
    message: res.message,
    errorCode: res.errorCode,
    data: {
      userId: d.userId,
      firstName: d.firstName,
      lastName: d.lastName,
      email: d.email,
      phoneNumber: "",
      userType: "HOST",
      emailVerified: d.emailVerified,
      phoneVerified: d.phoneVerified,
      profilePictureUrl: d.profilePictureUrl,
      referralCode: undefined,
    },
    timestamp: res.timestamp,
  };
}

export default function useAuth() {
  const http = useHttp();
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { forgotPasswordOtp } = useAppSelector((state) => state.forgotPassword);

  // Destructure update function to refresh tokens after switching
  const { data: session, update: updateSession } = useSession();

  const signupMutation = useMutation({
    mutationFn: (values: SignupFormValues) =>
      http.post(`${AUTH_API_BASE}/signup`, { ...values, userType: UserType.HOST }),

    onMutate: (values) => {
      return { email: values.email };
    },

    onSuccess: (data, _values, context) => {
      console.log("[Signup] success", data);
      toast.success(
        pickSuccessMessage(data, "Account created. Check your email to verify.")
      );
      router.push(
        `/verify-email?email=${encodeURIComponent(context?.email ?? "")}`
      );
    },
  });

  const verifyEmailOnSignup = useMutation({
    mutationFn: (values: verifyEmail) =>
      http.post<string>(`${AUTH_API_BASE}/verify-account`, values),

    onSuccess: (data) => {
      console.log("[Verify email signup] success", data);
      toast.success(pickSuccessMessage(data, "Account verified successfully"));
      router.push("/login");
    },
  });

  const resendVerifyEmailToken = useMutation({
    mutationFn: (values: ResendVerifyEmailTokenValues) =>
      http.post(`${AUTH_API_BASE}/resend-verification-otp`, values),

    onSuccess: (data) => {
      console.log("[Resend verification OTP] success", data);
      toast.success(pickSuccessMessage(data, "Verification code sent"));
    },
  });

  const loginMutation = useMutation<void, unknown, LoginFormValues, { email: string }>({
    mutationFn: async (values: LoginFormValues) => {
      const raw = await http.post<unknown>(`${AUTH_API_BASE}/login`, {
        email: values.email,
        password: values.password,
        userType: UserType.HOST,
      });

      const data = normalizeLoginEnvelope(raw);
      const payload = data?.data;
      if (!data || !payload?.accessToken) {
        console.log("[Login] unexpected API response shape", raw);
        toast.error(
          pickSuccessMessage(raw, "Login failed. Please try again.")
        );
        throw new Error("LOGIN_BAD_RESPONSE");
      }

      dispatch(
        setUser({
          user: userFromLoginResponse(data),
          userToken: payload.accessToken,
          isAuthenticated: true,
          isLoading: false,
        })
      );

      const nextAuthResult = await signIn("credentials", {
        redirect: false,
        email: values.email,
        accessToken: payload.accessToken,
        refreshToken: payload.refreshToken ?? "",
      });
      if (nextAuthResult?.error) {
        console.warn("[Login] NextAuth session sync:", nextAuthResult.error);
        toast.error(nextAuthResult.error);
      }

      queryClient.clear();
    },

    onMutate: (values) => {
      return { email: values.email };
    },

    onSuccess: () => {
      toast.success("Signed in successfully");
      router.push("/");
    },

    onError: (error: unknown, _values, context) => {
      if (error instanceof AxiosError) {
        if (error.response?.data?.data === "EMAIL_NOT_CONFIRMED") {
          router.push(
            `/verify-email?email=${encodeURIComponent(context?.email ?? "")}`
          );
        }
        return;
      }
      if (error instanceof Error && error.message !== "LOGIN_BAD_RESPONSE") {
        toast.error(error.message);
      }
    },
  });

  const forgotPassword = useMutation({
    mutationFn: (values: ResetPasswordEmailValues) =>
      http.post(`${AUTH_API_BASE}/forgot-password`, values),

    onMutate: (values) => {
      return { email: values.email };
    },

    onSuccess: (data, _values, context) => {
      console.log("[Forgot password] success", data);
      toast.success(
        pickSuccessMessage(
          data,
          "If this email is registered, you'll receive reset instructions."
        )
      );
      router.push(
        `/forgot-password/otp?email=${encodeURIComponent(context?.email ?? "")}`
      );
    },
  });

  const verifyEmailOnForgotPassword = useMutation({
    mutationFn: (values: verifyEmailValues) =>
      http.post("/api/auth/verify-reset-otp", values),

    onMutate: (values) => {
      return { email: values.email, otp: values.token };
    },

    onSuccess: (data, _values, context) => {
      console.log("[Verify reset OTP] success", data);
      toast.success(
        pickSuccessMessage(data, "Code verified. Set your new password.")
      );
      router.push(
        `/reset-password?email=${encodeURIComponent(context?.email ?? "")}`
      );
      dispatch(setForgotPasswordOtp(context?.otp));
    },
  });

  const resetPassword = useMutation({
    mutationFn: (values: SetNewPasswordValues) => {
      const { otp, password } = values;

      return http.post(`${AUTH_API_BASE}/reset-password`, {
        email: values.email,
        newPassword: password,
        otp,
      });
    },

    onSuccess: (data) => {
      dispatch(setForgotPasswordOtp(""));
      console.log("[Reset password] success", data);
      toast.success(pickSuccessMessage(data, "New password set successfully"));
      router.push("/login");
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: async (values: ChangePasswordValues) => {
      const token =
        session?.user?.accessToken ??
        getClientStore()?.getState().user.userToken;

      if (!token) {
        toast.error("Please sign in to change your password.");
        throw new Error("Authentication required");
      }

      return http.post("/v1/users/change-password", values);
    },
    onSuccess: (data) => {
      console.log("[Change password] success", data);
      toast.success(
        pickSuccessMessage(data, "Password changed successfully.")
      );
    },
  });

  const switchToHostMutation = useMutation({
    mutationFn: async (): Promise<ApiResponse<SwitchHostData>> => {
      const token =
        session?.user?.accessToken ??
        getClientStore()?.getState().user.userToken;
      if (!token) {
        toast.error("Please sign in to continue.");
        throw new Error("Authentication required");
      }

      const result = await http.post<ApiResponse<SwitchHostData>>(
        `${USER_ME_PATH}/switch-to-host`
      );
      if (!result) {
        toast.error("Could not switch to host. Please try again.");
        throw new Error("Failed to switch to host");
      }

      return result;
    },
    onSuccess: async (response) => {
      console.log("[Switch to host] success", response);
      toast.success(
        pickSuccessMessage(response, response.message || "Successfully switched to Host")
      );

      if (response.data?.accessToken) {
        dispatch(setToken(response.data.accessToken));
      }

      if (response.data && session) {
        try {
          await updateSession({
            ...session,
            user: {
              ...session?.user,
              accessToken: response.data.accessToken,
              refreshToken: response.data.refreshToken,
            },
          });
        } catch {
          /* NextAuth session optional when using Redux token only */
        }
      }

      queryClient.invalidateQueries({ queryKey: ["getUser"] });
      queryClient.invalidateQueries({ queryKey: ["host"] });
      queryClient.invalidateQueries({ queryKey: ["host-performance"] });
    },
  });

  return {
    signupMutation,
    loginMutation,
    verifyEmailOnSignup,
    verifyEmailOnForgotPassword,
    resendVerifyEmailToken,
    forgotPassword,
    resetPassword,
    changePasswordMutation,
    switchToHostMutation,
    session,
  };
}
