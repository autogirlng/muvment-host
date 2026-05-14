"use client";
import { useState } from "react";
import { FullPageSpinner, Pagination } from "@/ui";
import EmptyState from "@/components/EmptyState";
import useHostPendingBalance from "@/hooks/wallet/useHostPendingBalance";
import useHostEarningHistory from "@/hooks/wallet/useHostEarningHistory";
import DashboardSectionTitle from "@/components/DashBoard/SectionTitle";
import WalletBalance from "@/components/Wallet/WalletBalance";
import PendingBalanceSummary from "@/components/Wallet/PendingBalanceSummary";
import PendingBalanceBookingsTable from "@/components/Wallet/PendingBalanceBookingsTable";

const PAGE_LIMIT = 10;

export default function WalletPage() {
    const [payoutPage, setPayoutPage] = useState(1);
    
    // Filters for earning history
    const [filterYear, setFilterYear] = useState<number | "">("");
    const [filterMonth, setFilterMonth] = useState<number | "">("");

    const {
        items: payoutItems,
        totalCount: payoutTotal,
        totalAmountToPay,
        totalPaidToHost,
        totalAmountHostHaveMade,
        isError: payoutError,
        isLoading: payoutLoading,
    } = useHostPendingBalance({
        currentPage: payoutPage,
        pageLimit: PAGE_LIMIT,
    });

    // Earning history now used solely for filtering total earnings over a period
    const {
        totalEarnings,
        isError: earningError,
        isLoading: earningLoading,
        isFetching: earningFetching,
    } = useHostEarningHistory({
        currentPage: 1,
        pageLimit: 1,
        enabled: true,
        year: filterYear || undefined,
        month: filterMonth || undefined,
    });

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 5 }, (_, i) => currentYear - i);
    const months = [
        { value: 1, label: "January" },
        { value: 2, label: "February" },
        { value: 3, label: "March" },
        { value: 4, label: "April" },
        { value: 5, label: "May" },
        { value: 6, label: "June" },
        { value: 7, label: "July" },
        { value: 8, label: "August" },
        { value: 9, label: "September" },
        { value: 10, label: "October" },
        { value: 11, label: "November" },
        { value: 12, label: "December" },
    ];

    return (
        <main className="py-11 space-y-11">
            <div className="space-y-6 md:space-y-8">
                {/* <WalletBalance /> */}
                <PendingBalanceSummary
                    totalAmountToPay={totalAmountToPay}
                    totalPaidToHost={totalPaidToHost}
                    totalAmountHostHaveMade={totalAmountHostHaveMade}
                    totalEarningsHistory={totalEarnings}
                    isLoading={payoutLoading}
                    isError={payoutError}
                    earningHistoryLoading={earningLoading}
                    earningHistoryError={earningError}
                />
            </div>
            
            {/* Earning Filter Section */}
            <div className="rounded-3xl border border-grey-200 bg-white p-6 md:p-8 space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-grey-800">Check Earnings by Period</h3>
                        <p className="text-sm text-grey-500 mt-1">Select a year and month to see your total earnings.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <select 
                            className="p-2 border border-grey-200 rounded-lg text-sm bg-white"
                            value={filterYear}
                            onChange={(e) => setFilterYear(e.target.value ? Number(e.target.value) : "")}
                        >
                            <option value="">All Years</option>
                            {years.map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                        <select 
                            className="p-2 border border-grey-200 rounded-lg text-sm bg-white"
                            value={filterMonth}
                            onChange={(e) => setFilterMonth(e.target.value ? Number(e.target.value) : "")}
                        >
                            <option value="">All Months</option>
                            {months.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                        </select>
                    </div>
                </div>
                
                <div className="bg-primary-50 rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <span className="text-grey-700 font-medium">Earnings for selected period:</span>
                    {(earningLoading || earningFetching) ? (
                        <div className="w-24 h-8 bg-primary-100 animate-pulse rounded"></div>
                    ) : (
                        <span className="text-2xl font-bold text-primary-900 tabular-nums">
                            ₦{totalEarnings?.toLocaleString() || "0"}
                        </span>
                    )}
                </div>
            </div>

            <div className="space-y-6">
                <DashboardSectionTitle title="Booking payouts" />
                
                {payoutLoading ? (
                    <FullPageSpinner />
                ) : payoutError ? (
                    <p>something went wrong</p>
                ) : payoutItems.length === 0 ? (
                    <EmptyState
                        title="No payout bookings"
                        image="/icons/empty_trnx_state.png"
                        imageSize="w-[182px] 3xl:w-[265px]"
                    />
                ) : (
                    <PendingBalanceBookingsTable items={payoutItems} />
                )}
                
                <Pagination
                    className="pagination-bar"
                    currentPage={payoutPage}
                    totalCount={payoutTotal}
                    pageLimit={PAGE_LIMIT}
                    onPageChange={(page) => setPayoutPage(page)}
                />
            </div>
        </main>
    );
}
