import { Dispatch, ReactNode, SetStateAction } from "react";
import { AxiosError } from "axios";
import { ErrorResponse } from "@/types";


export interface OtpVerificationProps  {
    verifyOtp: () => void;
    isVerifyOtpLoading: boolean;
    resendOtp: () => void;
    isResendOtpLoading: boolean;
    setOtp: Dispatch<SetStateAction<string>>;
    otp: string;
    error: AxiosError<ErrorResponse> | null;
    children?: ReactNode;
    numInputs?: number;
};