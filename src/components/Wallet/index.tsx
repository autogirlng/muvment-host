"use client";

import { FullPageSpinner } from "@/ui";
import DashboardSectionTitle from "@/components/DashBoard/SectionTitle";
import WalletBalance from "@/components/Wallet/WalletBalance";
import EarningHistoryTable from "@/components/Wallet/EarningHistoryTable";
import { useHostPerformance } from "@/hooks/performance/useHostPerformance";

export default function Wallet() {
    const { useGetEarningHistory } = useHostPerformance();
    const { data: earningData, isLoading: earningLoading } = useGetEarningHistory();
    const earningItems = earningData?.data?.hostEarningItems ?? [];
    const totalEarnings = earningData?.data?.totalEarnings;

    return (
        <>
            <WalletBalance />
            <div className="space-y-6">
                <DashboardSectionTitle title="Transaction History" />
                {earningLoading ? (
                    <FullPageSpinner />
                ) : (
                    <EarningHistoryTable
                        items={earningItems}
                        totalEarnings={totalEarnings}
                    />
                )}
            </div>
        </>
    );
}
