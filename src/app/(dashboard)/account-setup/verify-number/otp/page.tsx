"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useAppSelector } from "@/lib/hooks";
import { formatPhoneNumber } from "@/utils/functions";
import DashboardInnerPage from "@/components/DashBoard/InnerPage";
import OtpVerification from "@/components/OtpVerification";
import usePhoneNumberVerification from "@/hooks/usePhoneNumberVerification";

export default function VerifyNumberOtpPage() {
    const { phoneNumberToVerify } = useAppSelector((state) => state.accountSetup);
    const [otp, setOtp] = useState<string>("");
    const { verifyPhoneNumberToken, resendVerifyPhoneToken, pushToAccountSetup } =
        usePhoneNumberVerification();

    const router = useRouter();

    useEffect(() => {
        if (pushToAccountSetup) {
            return router.push("/account-setup");
        }
        if (!phoneNumberToVerify) {
            router.push("/account-setup/verify-number");
        }
    }, [phoneNumberToVerify, pushToAccountSetup]);

    const formattedPhoneNumber = useMemo(
        () => (phoneNumberToVerify ? formatPhoneNumber(phoneNumberToVerify) : ""),
        [phoneNumberToVerify]
    );

    const handleVerifyOtp = () => {
        verifyPhoneNumberToken.mutate({
            otp,
        });
    };

    const handleResendOtp = () => {
        // resendVerifyPhoneToken.mutate({
        //     phoneNumber: phoneNumberToVerify!,
        // });
    };

    return (
        <DashboardInnerPage
            isInnerPage
            title="Verify Phone Number"
            description={`We’ve sent an OTP code via SMS to ${formattedPhoneNumber} to verify it’s you.`}
            backLink="/account-setup/verify-number"
        >
            <OtpVerification
                numInputs={6}
                verifyOtp={handleVerifyOtp}
                isVerifyOtpLoading={verifyPhoneNumberToken.isPending}
                isResendOtpLoading={resendVerifyPhoneToken.isPending}
                resendOtp={handleResendOtp}
                otp={otp}
                setOtp={setOtp}
                error={verifyPhoneNumberToken.error}
            />
        </DashboardInnerPage>
    );
}
