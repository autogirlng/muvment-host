"use client";

import dynamic from "next/dynamic";
import BackLink from "@/components/BackLink";

const SettingsAccountSetup = dynamic(
    () => import("@/components/Settings/AccountSetup"),
    { ssr: false }
);

export default function AccountSetupPage() {
    return (
        <main className="space-y-10 2xl:space-y-[52px] py-[56px]">
            <BackLink backLink="/settings" />
            <SettingsAccountSetup />
        </main>
    );
}
