"use client";

import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import { updateUserData } from "@/lib/features/userSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setPhoneNumberToVerify } from "@/lib/features/accountSetupSlice";
import { handleErrors } from "@/utils/functions";
import {
  ErrorResponse,
  SendPhoneNumberTokenValues,
  VerifyPhoneNumberTokenValues,
} from "@/types";
import { useHttp } from "@/hooks/useHttp";

export default function usePhoneNumberVerification() {
  const http = useHttp();

  const { user } = useAppSelector((state) => state.user);

  const [credentialsError, setCredentialsError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [pushToAccountSetup, setPushToAccountSetup] = useState<boolean>(false);

  const dispatch = useAppDispatch();
  const router = useRouter();

  const sendPhoneNumberToken = useMutation({
    mutationFn: (values: SendPhoneNumberTokenValues) =>
      http.post("/v1/auth/request-phone-otp", {email:values.email}),

    onMutate: (values) => {
      return { phoneNumber: values.phoneNumber, email:values.email };
    },

    onSuccess: (data, _values, context) => {
      console.log("Verify Phone Number successful", data);
      dispatch(setPhoneNumberToVerify(context?.phoneNumber));
      router.push(`/account-setup/verify-number/otp`);
    },

    onError: (error: AxiosError<ErrorResponse>) =>
      handleErrors(error, "Verify Phone Number"),
  });

  const resendVerifyPhoneToken = useMutation({
    mutationFn: (values: SendPhoneNumberTokenValues) =>
      http.post("/api/account-setup/sendOtp", values),

    onSuccess: (data) => {
      console.log("Resend Token successful", data);
      toast.success("Token sent successfully");
    },

    onError: (error: AxiosError<ErrorResponse>) =>
      handleErrors(error, "Resend Verify Phone Token"),
  });

  const verifyPhoneNumberToken = useMutation({
    mutationFn: (values: VerifyPhoneNumberTokenValues) =>
      http.post("/v1/auth/verify-phone", {email:user?.data.email, otp:values.otp}),

    onSuccess: (data) => {
      console.log("Phone Number Verified Successfully", data);
      toast.success("Phone Number Verified Successfully");
      if(user){
        dispatch(updateUserData({ ...user, data:{...user?.data, phoneVerified:true} }));

      }
      setPushToAccountSetup(true);
      dispatch(setPhoneNumberToVerify(""));
    },

    onError: (error: AxiosError<ErrorResponse>) =>
      handleErrors(error, "Verify phone number"),
  });

  return {
    sendPhoneNumberToken,
    resendVerifyPhoneToken,
    verifyPhoneNumberToken,
    credentialsError,
    setCredentialsError,
    loading,
    setLoading,
    user,
    pushToAccountSetup,
  };
}
