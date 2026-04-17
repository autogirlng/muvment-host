"use client";

import dynamic from "next/dynamic";
import DashboardInnerPage from "@/components/DashBoard/InnerPage";

const SettingsAccountSetup = dynamic(
    () => import("@/components/Settings/AccountSetup"),
    { ssr: false }
);

export default function AccountSetupPage() {
    return (
        <DashboardInnerPage title="Account Setup" isInnerPage backLink="/settings">
            <SettingsAccountSetup />
        </DashboardInnerPage>
    );
}
