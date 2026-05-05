"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { signIn, useSession } from "next-auth/react";
import { useHttp } from "@/hooks/useHttp";
import { setForgotPasswordOtp } from "@/lib/features/forgotPasswordSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { handleErrors } from "@/utils/functions";
import { UserType } from "@/utils/constants";
import {
  ErrorResponse,
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
  SwitchHostData 
} from "@/types";

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
      http.post("/auth/signup", { ...values, userType: UserType.HOST }),

    onMutate: (values) => {
      return { email: values.email };
    },

    onSuccess: (data, _values, context) => {
      router.push(
        `/verify-email?email=${encodeURIComponent(context?.email ?? "")}`
      );
      console.log("Signup successful", data);
    },

    onError: (error: AxiosError<ErrorResponse>) =>
      handleErrors(error, "Signup"),
  });

  const verifyEmailOnSignup = useMutation({
    mutationFn: (values: verifyEmail) => 
      http.post<string>("/auth/verify-account", values),

    onSuccess: () => {
      toast.success("Account created successfully");
      router.push("/login");
    },

    onError: (error: AxiosError<ErrorResponse>) =>
      handleErrors(error, "Verify Email"),
  });

  const resendVerifyEmailToken = useMutation({
    mutationFn: (values: ResendVerifyEmailTokenValues) =>
      http.post("/auth/resend-verification-otp", values),

    onSuccess: (data) => {
      console.log("Resend Token successful", data);
      toast.success("Token sent successfully");
    },

    onError: (error: AxiosError<ErrorResponse>) =>
      handleErrors(error, "Resend Verify Email Token"),
  });

  const loginMutation = useMutation<void, AxiosError<ErrorResponse>, LoginFormValues, {email:string}>({
    mutationFn: async (values: LoginFormValues) => {
      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (result?.error) {
        throw new AxiosError(result.error);
      }
    },

    onMutate: (values) => {
      return { email: values.email };
    },

    onSuccess: () => {
      router.push("/dashboard");
      queryClient.clear();
    },

    onError: (error: AxiosError<ErrorResponse>, _values, context) => {
      if (error.response?.data?.data === "EMAIL_NOT_CONFIRMED") {
        router.push(
          `/verify-email?email=${encodeURIComponent(context?.email ?? "")}`
        );
      }

      handleErrors(error, "Login");
    },
  });

  const forgotPassword = useMutation({
    mutationFn: (values: ResetPasswordEmailValues) =>
      http.post("/auth/forgot-password", values),

    onMutate: (values) => {
      return { email: values.email };
    },

    onSuccess: (data, _values, context) => {
      console.log("Forgot password successful", data);
      router.push(
        `/forgot-password/otp?email=${encodeURIComponent(context?.email ?? "")}`
      );
    },

    onError: (error: AxiosError<ErrorResponse>) =>
      handleErrors(error, "Forgot Password"),
  });

  const verifyEmailOnForgotPassword = useMutation({
    mutationFn: (values: verifyEmailValues) =>
      http.post("/api/auth/verify-reset-otp", values),

    onMutate: (values) => {
      return { email: values.email, otp: values.token };
    },

    onSuccess: (data, _values, context) => {
      console.log("Email verified successfully", data);
      router.push(
        `/reset-password?email=${encodeURIComponent(context?.email ?? "")}`
      );
      dispatch(setForgotPasswordOtp(context?.otp));
    },

    onError: (error: AxiosError<ErrorResponse>) =>
      handleErrors(error, "Verify Email"),
  });

  const resetPassword = useMutation({
    mutationFn: (values: SetNewPasswordValues) => {
      console.log(values)
      const { otp, password } = values;

      return http.post("/auth/reset-password", 
        {
        email:values.email,
        newPassword: password,
        otp,
      });
    },

    onSuccess: (data) => {
      dispatch(setForgotPasswordOtp(""));
      console.log("Password Reset successfully", data);
      toast.success("New password set successfully");
      router.push("/login");
    },

    onError: (error: AxiosError<ErrorResponse>) =>
      handleErrors(error, "Password Reset"),
  });


  const switchToHostMutation = useMutation({
    mutationFn: async (): Promise<ApiResponse<SwitchHostData>> => {
      const token = session?.user?.accessToken;
      if (!token) throw new Error("Authentication required");

      const result = await http.post<ApiResponse<SwitchHostData>>(
        "/users/me/switch-to-host"
      );
      if (!result) throw new Error("Failed to switch to host");
      
      return result;
    },
    onSuccess: async (response) => {
      toast.success(response.message || "Successfully switched to Host");

      if (response.data) {
        await updateSession({
          ...session,
          user: {
            ...session?.user,
            accessToken: response.data.accessToken,
            refreshToken: response.data.refreshToken,
            // role: 'HOST' 
          }
        });
      }

      // 3. Clear/Invalidate queries so UI fetches fresh host-specific data
      queryClient.invalidateQueries({ queryKey: ["getUser"] });
      queryClient.invalidateQueries({ queryKey: ["host"] });
      queryClient.invalidateQueries({ queryKey: ["host-performance"] });

      // 4. (Optional) Redirect to the host dashboard
      // router.push("/host/dashboard"); 
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      handleErrors(error, "Switch to Host");
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
    switchToHostMutation, 
    session,
  };
}