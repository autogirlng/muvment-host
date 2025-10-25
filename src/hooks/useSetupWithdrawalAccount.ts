"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import { updateUserData } from "@/lib/features/userSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  setAccountDetails,
  setWithdrawalAccountSetupOtp,
} from "@/lib/features/accountSetupSlice";
import { handleErrors } from "@/utils/functions";
import {
  BankCodes,
  ErrorResponse,
  VerifyOtpValues,
  WithdrawalAccountValues,
} from "@/types";
import { useHttp } from "@/hooks/useHttp";

export default function useSetupWithdrawalAccount() {
  const http = useHttp();

  const { user } = useAppSelector((state) => state.user);
  const { accountDetails, withdrawalAccountSetupOtp } = useAppSelector(
    (state) => state.accountSetup
  );

  const [credentialsError, setCredentialsError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [pushToDashboard, setPushToDashboard] = useState<boolean>(false);

  const dispatch = useAppDispatch();
  const router = useRouter();

  const resetAccountDetails = () =>
    dispatch(
      setAccountDetails({ accountNumber: "", bankCode: "", accountName: "" })
    );

  const { data, isLoading } = useQuery({
    queryKey: ["getAllBankCodes"],
    queryFn: () => http.get<BankCodes[]>("/api/withdrawal-account/bankCodes"),
    retry: 2,
  });

  const validateBankAccount = useMutation({
    mutationFn: (values: WithdrawalAccountValues) =>
      http.get<WithdrawalAccountValues>(
        `/api/withdrawal-account/validateBank?accountNumber=${values.accountNumber}&bankCode=${values.bankCode}`
      ),

    onSuccess: (data) => {
      console.log("Bank Account Verified Successfully", data);
      dispatch(setAccountDetails(data as WithdrawalAccountValues));
      setLoading(false);
    },

    onError: (error: AxiosError<ErrorResponse>) => {
      setLoading(false);
      setCredentialsError(true);
      handleErrors(error, "Verify Bank Account");
    },
  });

  const sendBankAccountOtp = useMutation({
    mutationFn: () => http.get("/api/withdrawal-account/send-otp"),

    onSuccess: (data) => {
      router.push(`/account-setup/withdrawal-account/otp`);
      setLoading(false);
      console.log("Bank Account Otp Sent Successfully", data);
    },

    onError: (error: AxiosError<ErrorResponse>) => {
      setLoading(false);
      handleErrors(error, "Send Bank Account Otp");
    },
  });

  const verifyBankAccountOtp = useMutation({
    mutationFn: (values: VerifyOtpValues) =>
      http.post("/api/withdrawal-account/verify-otp", values),

    onMutate: (values) => {
      return { token: values.token };
    },
    onSuccess: (data, _values, context) => {
      console.log("Bank Account Otp Verified", data);
      dispatch(setWithdrawalAccountSetupOtp(context.token));
      addBankAccount.mutate(accountDetails);
    },

    onError: (error: AxiosError<ErrorResponse>) => {
      setLoading(false);
      handleErrors(error, "Verify Bank Account Otp");
    },
  });

  const addBankAccount = useMutation({
    mutationFn: (values: WithdrawalAccountValues) =>
      http.post("/api/withdrawal-account/addWithdrawalAccount", {
        ...values,
        country: user?.message,
        token: withdrawalAccountSetupOtp,
      }),

    onSuccess: (data) => {
      console.log("Withdrawal Account Added Successfully", data);
      toast.success("Withdrawal Account Added Successfully");
      dispatch(updateUserData({ }));
      dispatch(setWithdrawalAccountSetupOtp(""));

      setLoading(false);
      setPushToDashboard(true);

      dispatch(
        setAccountDetails({
          accountNumber: "",
          bankCode: "",
          accountName: "",
        })
      );
    },

    onError: (error: AxiosError<ErrorResponse>) => {
      {
        setLoading(false);
        handleErrors(error, "Add Withdrawal Account");
      }
    },
  });

  return {
    validateBankAccount,
    bankCodes: data || [],
    isLoading,
    accountDetails,
    credentialsError,
    setCredentialsError,
    sendBankAccountOtp,
    verifyBankAccountOtp,
    addBankAccount,
    loading,
    setLoading,
    user,
    resetAccountDetails,
    pushToDashboard,
  };
}
