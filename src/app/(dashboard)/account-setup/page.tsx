"use client";

import { AccountSetupTasks } from "@/components/AccountSetup";
import DashboardInnerPage from "@/components/DashBoard/InnerPage";

export default function AccountSetupPage() {
    return (
        <DashboardInnerPage
            title="Complete Account Setup"
            description="Get your account ready by following these steps to receive payments
          securely"
        >
            <AccountSetupTasks />
        </DashboardInnerPage>
    );
}
