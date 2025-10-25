"use client";

import SetupWithdrawalAccount from "@/components/AccountSetup/SetupWithdrawalAccount";
import DashboardInnerPage from "@/components/DashBoard/InnerPage";

export default function WithdrawalAccountSetupPage() {
    return (
        <DashboardInnerPage
            isInnerPage
            title="Setup Withdrawal Account"
            description="Please complete the form below to verify your identity and ensure the security of your account"
            backLink="/account-setup"
        >
            <SetupWithdrawalAccount />
        </DashboardInnerPage>
    );
}
