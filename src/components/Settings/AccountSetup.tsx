"use client";

import { AccountSetupTasks } from "@/components/AccountSetup";

export default function SettingsAccountSetup() {
    return (
        <div className="bg-white border border-grey-200 rounded-2xl p-6 2xl:p-8 space-y-6">
            <div className="space-y-1">
                <h3 className="text-lg 2xl:text-xl font-semibold text-grey-700">
                    Account Setup
                </h3>
                <p className="text-sm text-grey-500">
                    Complete these tasks to get full access to Muvment&apos;s
                    functionalities
                </p>
            </div>
            <AccountSetupTasks />
        </div>
    );
}
