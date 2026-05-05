"use client";

import VerifyPhoneNumber from "@/components/AccountSetup/VerifyPhoneNumber";
import DashboardInnerPage from "@/components/DashBoard/InnerPage";

export default function SettingsVerifyNumberPage() {
    return (
        <DashboardInnerPage
            isInnerPage
            title="Verify Phone Number"
            description="Please complete the form below to verify your identity and ensure the security of your account"
            backLink="/settings"
        >
            <VerifyPhoneNumber />
        </DashboardInnerPage>
    );
}
