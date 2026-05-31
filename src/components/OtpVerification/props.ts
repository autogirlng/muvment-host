import { Dispatch, ReactNode, SetStateAction } from "react";

export interface OtpVerificationProps  {
    verifyOtp: () => void;
    isVerifyOtpLoading: boolean;
    resendOtp: () => void;
    isResendOtpLoading: boolean;
    setOtp: Dispatch<SetStateAction<string>>;
    otp: string;
    /** Mutation/API failure from react-query (often AxiosError). */
    error: unknown;
    children?: ReactNode;
    numInputs?: number;
};