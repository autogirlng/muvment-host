"use client";
import { useState } from "react";
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { ErrorResponse } from "@/types";
import { handleErrors } from "@/utils/functions";
import { useHttp } from "@/hooks/useHttp";

export default function useWithdrawFunds() {
  const http = useHttp();
  const queryClient = useQueryClient();

  const [otp, setOtp] = useState<string>("");
  const [amount, setAmount] = useState<string>("");

  const [openWithdrawModal, setOpenWithdrawalModal] = useState<boolean>(false);
  const [openVerifyOtpModal, setOpenVerifyOtp] = useState<boolean>(false);
  const handleVerifyOtpModal = () => {
    setOpenVerifyOtp(!openVerifyOtpModal);
  };
  const handleWithdrawModal = () => {
    setOpenWithdrawalModal(!openWithdrawModal);
  };

  const sendOtp = useMutation({
    mutationFn: () => http.get("/api/payment/send-otp"),

    onSuccess: (data) => {
      console.log("send withdrawal token Successful", data);
      toast.success("Otp has been sent to your mail");
      setOpenVerifyOtp(true);
      setOpenWithdrawalModal(false);
    },

    onError: (error: AxiosError<ErrorResponse>) => {
      handleErrors(error, "send withdrawal token");
    },
  });

  const verifyOtp = useMutation({
    mutationFn: (token: string) =>
      http.post("/api/payment/verify-otp", { token }),

    onMutate: (values) => {
      return { token: values };
    },

    onSuccess: (data, _values, context) => {
      console.log("verify withdrawal token Successful", data);
      withdrawFunds.mutate(context.token);
    },

    onError: (error: AxiosError<ErrorResponse>) => {
      handleErrors(error, "verify withdrawal token");
    },
  });

  const withdrawFunds = useMutation({
    mutationFn: (token: string) => {
      const amountWithoutComma = parseFloat(amount.replace(/,/g, ""));
      return http.post("/api/payment/disburse", { token, amount:amountWithoutComma });
    },

    onSuccess: (data) => {
      console.log("withdrawal Successfully", data);
      toast.success("Withdrawal Request Submitted successfully");

      queryClient.invalidateQueries({
        queryKey: ["getWalletBalance"],
      });
      queryClient.invalidateQueries({
        queryKey: ["getTransactions"],
      });
      setOpenVerifyOtp(false);
    },

    onError: (error: AxiosError<ErrorResponse>) => {
      handleErrors(error, "withdrawal");
      setOpenVerifyOtp(false);
    },
  });

  return {
    sendOtp,
    verifyOtp,
    amount,
    setAmount,
    otp,
    setOtp,

    openWithdrawModal,
    handleWithdrawModal,
    openVerifyOtpModal,
    handleVerifyOtpModal,
  };
}
