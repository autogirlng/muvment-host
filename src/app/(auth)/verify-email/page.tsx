"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import OtpVerification from "@/components/OtpVerification";
import useAuth from "@/hooks/useAuth";
import AuthPageHeader from "@/components/Header/AuthPageHeader";


export default function VerifyEmailPage() {
    const router = useRouter();
    const emailParams = useSearchParams();
    const email = emailParams.get("email");

    if (!email) {
        router.push("/signup");
    }

    const { verifyEmailOnSignup, resendVerifyEmailToken } = useAuth();
    const [otp, setOtp] = useState<string>("");

    return (
        <OtpVerification
            verifyOtp={() => {
                verifyEmailOnSignup.mutate({ email: email as string, otp });
            }}
            isVerifyOtpLoading={verifyEmailOnSignup.isPending}
            isResendOtpLoading={resendVerifyEmailToken.isPending}
            resendOtp={() => {
                resendVerifyEmailToken.mutate({ email: email as string });
            }}
            otp={otp}
            setOtp={setOtp}
            error={verifyEmailOnSignup.error}
        >
            <Image
                src="/icons/mailbox.png"
                alt=""
                className="w-[200px] h-[134px]"
                width={200}
                height={134}
            />
            <AuthPageHeader
                title="We’ve sent a mail your way"
                description="We sent you an OTP to verify your email. If you can’t find it please
          check your spam first before resending the code."
            />
        </OtpVerification>
    );
}
