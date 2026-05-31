"use client";

import { useState } from "react";
import { FullPageSpinner, Pagination } from "@/ui";
import DashboardSectionTitle from "@/components/DashBoard/SectionTitle";
import WalletBalance from "@/components/Wallet/WalletBalance";
import EarningHistoryTable from "@/components/Wallet/EarningHistoryTable";
import PendingBalanceBookingsTable from "@/components/Wallet/PendingBalanceBookingsTable";
import WalletHistoryToggle, { WalletHistoryTab } from "@/components/Wallet/WalletHistoryToggle";
import useHostEarningHistory from "@/hooks/wallet/useHostEarningHistory";

export default function Wallet() {
    const [historyTab, setHistoryTab] = useState<WalletHistoryTab>("payouts");
    const [currentPage, setCurrentPage] = useState(1);
    const pageLimit = 10;
    const {
        bookingItems,
        totalCount,
        totalPending,
        totalPaid,
        totalEarnings,
        isError,
        isLoading,
    } = useHostEarningHistory({ currentPage, pageLimit });

    return (
        <>
            <WalletBalance />
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <DashboardSectionTitle title="Transaction History" />
                    <WalletHistoryToggle
                        value={historyTab}
                        onChange={(tab) => {
                            setHistoryTab(tab);
                            setCurrentPage(1);
                        }}
                    />
                </div>
                {isLoading ? (
                    <FullPageSpinner />
                ) : isError ? (
                    <p className="text-red-500 p-4 bg-red-50 rounded-lg border border-red-100">
                        Failed to load wallet history. Please try again.
                    </p>
                ) : historyTab === "payouts" ? (
                    <>
                        <PendingBalanceBookingsTable items={bookingItems} />
                        {totalCount > 0 && (
                            <Pagination
                                currentPage={currentPage}
                                totalCount={totalCount}
                                pageLimit={pageLimit}
                                onPageChange={setCurrentPage}
                            />
                        )}
                    </>
                ) : (
                    <EarningHistoryTable
                        totalPending={totalPending}
                        totalPaid={totalPaid}
                        totalEarnings={totalEarnings}
                    />
                )}
            </div>
        </>
    );
}
