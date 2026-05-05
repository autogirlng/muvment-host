"use client";

import dynamic from "next/dynamic";

const Settings = dynamic(() => import("@/components/Settings"), { ssr: false });

export default function SettingsPage() {
    return (
        <main className="py-[56px]">
            <Settings />
        </main>
    );
}
