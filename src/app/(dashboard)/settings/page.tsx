"use client";

import dynamic from "next/dynamic";
import DashboardInnerPage from "@/components/DashBoard/InnerPage";

const Settings = dynamic(() => import("@/components/Settings"), { ssr: false });

export default function SettingsPage() {
    return (
        <DashboardInnerPage title="Settings">
            <Settings />
        </DashboardInnerPage>
    );
}
