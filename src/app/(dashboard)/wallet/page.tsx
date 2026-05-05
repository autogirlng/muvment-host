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
import HostEarningTable from "@/components/Wallet/HostEarningTable";
import WalletHistoryToggle, {
    type WalletHistoryTab,
} from "@/components/Wallet/WalletHistoryToggle";

const PAGE_LIMIT = 10;

export default function WalletPage() {
    const [tableTab, setTableTab] = useState<WalletHistoryTab>("payouts");
    const [payoutPage, setPayoutPage] = useState(1);
    const [earningPage, setEarningPage] = useState(1);

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

    const {
        items: earningItems,
        totalCount: earningTotal,
        totalEarnings,
        isError: earningError,
        isLoading: earningLoading,
        isFetching: earningFetching,
    } = useHostEarningHistory({
        currentPage: earningPage,
        pageLimit: PAGE_LIMIT,
        enabled: true,
    });

    const sectionTitle =
        tableTab === "payouts" ? "Booking payouts" : "Earning history";

    const showPayoutTable = tableTab === "payouts";
    const tableLoading = showPayoutTable ? payoutLoading : earningLoading || earningFetching;
    const tableError = showPayoutTable ? payoutError : earningError;
    const tableItems = showPayoutTable ? payoutItems : earningItems;
    const tableTotal = showPayoutTable ? payoutTotal : earningTotal;
    const tablePage = showPayoutTable ? payoutPage : earningPage;
    const setTablePage = showPayoutTable ? setPayoutPage : setEarningPage;

    const handleTabChange = (tab: WalletHistoryTab) => {
        setTableTab(tab);
    };

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
            <div className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <DashboardSectionTitle title={sectionTitle} />
                    <WalletHistoryToggle value={tableTab} onChange={handleTabChange} />
                </div>
                {tableLoading ? (
                    <FullPageSpinner />
                ) : tableError ? (
                    <p>something went wrong</p>
                ) : tableItems.length === 0 ? (
                    <EmptyState
                        title={
                            showPayoutTable
                                ? "No payout bookings"
                                : "No earning history"
                        }
                        image="/icons/empty_trnx_state.png"
                        imageSize="w-[182px] 3xl:w-[265px]"
                    />
                ) : showPayoutTable ? (
                    <PendingBalanceBookingsTable items={payoutItems} />
                ) : (
                    <HostEarningTable items={earningItems} />
                )}
                <Pagination
                    className="pagination-bar"
                    currentPage={tablePage}
                    totalCount={tableTotal}
                    pageLimit={PAGE_LIMIT}
                    onPageChange={(page) => setTablePage(page)}
                />
            </div>
        </main>
    );
}
