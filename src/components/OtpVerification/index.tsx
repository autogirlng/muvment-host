"use client";

import { useEffect, useState } from "react";
import { Spinner, OtpField } from "@/ui";
import { OtpVerificationProps } from "./props";



const OtpVerification = ({
    numInputs = 6,
    verifyOtp,
    isVerifyOtpLoading,
    resendOtp,
    isResendOtpLoading,
    setOtp,
    otp,
    error,
    children,
}: OtpVerificationProps) => {
    const handleChange = (otp: string) => setOtp(otp);

    const [seconds, setSeconds] = useState<number>(30);

    useEffect(() => {
        const interval = setInterval(() => {
            if (seconds > 0) setSeconds(seconds - 1);

            if (seconds === 0) {
                clearInterval(interval);
            }
        }, 1000);

        return () => clearInterval(interval);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [seconds]);

    useEffect(() => {
        if (otp.length === numInputs) {
            verifyOtp();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [otp]);

    return (
        <div className="space-y-8">
            {children}

            <OtpField
                numInputs={numInputs}
                name="otp"
                id="otp"
                type="otp"
                label="Enter OTP"
                placeholder=""
                value={otp}
                onChange={handleChange}
                error={
                    error?.response?.data?.data === "INCORRECT_OTP" ||
                        error?.response?.data?.data === "OTP_NOT_FOUND"
                        ? "Incorrect pin, please check and try again"
                        : ""
                }
                disabled={isVerifyOtpLoading || isResendOtpLoading}
            />
            {isVerifyOtpLoading || isResendOtpLoading ? (
                <Spinner />
            ) : seconds > 0 ? (
                <p className="text-grey-500 text-sm 3xl:text-base">
                    Resend Code in {`${seconds}s`}
                </p>
            ) : (
                <button
                    className="text-sm 3xl:text-base text-primary-500"
                    onClick={() => {
                        resendOtp();
                        setSeconds(30);
                    }}
                >
                    Resend Code
                </button>
            )}
        </div>
    );
};

export default OtpVerification;
