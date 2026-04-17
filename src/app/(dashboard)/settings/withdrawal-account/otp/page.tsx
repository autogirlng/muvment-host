"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import OtpVerification from "@/components/OtpVerification";
import DashboardInnerPage from "@/components/DashBoard/InnerPage";
import useSetupWithdrawalAccount from "@/hooks/useSetupWithdrawalAccount";
import { useAppSelector } from "@/lib/hooks";

export default function SettingsWithdrawalAccountOtpPage() {
    const router = useRouter();

    const { accountDetails } = useAppSelector((state) => state.accountSetup);

    const {
        verifyBankAccountOtp,
        sendBankAccountOtp,
        loading,
        setLoading,
        pushToDashboard,
    } = useSetupWithdrawalAccount();

    useEffect(() => {
        if (pushToDashboard) {
            return router.push("/settings");
        }
        if (!accountDetails.accountName) {
            router.push("/settings/withdrawal-account");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [accountDetails, pushToDashboard]);

    const [otp, setOtp] = useState<string>("");

    return (
        <DashboardInnerPage
            isInnerPage
            title="Setup Withdrawal Account"
            description="We've sent an OTP code to your email to verify it's you."
            backLink="/settings/withdrawal-account"
        >
            <OtpVerification
                verifyOtp={async () => {
                    setLoading(true);
                    verifyBankAccountOtp.mutate({
                        token: otp,
                    });
                }}
                isVerifyOtpLoading={verifyBankAccountOtp.isPending || loading}
                isResendOtpLoading={sendBankAccountOtp.isPending}
                resendOtp={() => {
                    sendBankAccountOtp.mutate();
                }}
                otp={otp}
                setOtp={setOtp}
                error={verifyBankAccountOtp.error}
            />
        </DashboardInnerPage>
    );
}
