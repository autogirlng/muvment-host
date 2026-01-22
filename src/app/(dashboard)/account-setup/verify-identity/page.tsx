"use client";

import VerifyIdentity from "@/components/AccountSetup/VerifyIdentity";
import DashboardInnerPage from "@/components/DashBoard/InnerPage";

export default function VerifyIdentityPage() {
    return (
        <DashboardInnerPage
            isInnerPage
            title="Verify Your Identity"
            description="Please complete the form below to verify your identity and ensure the security of your account"
            backLink="/account-setup"
        >
            <VerifyIdentity />
        </DashboardInnerPage>
    );
}
