"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { Button, FullPageSpinner, Pagination } from "@/ui";
import { BlurredDialog } from "@/ui/dialog";
import EmptyState from "@/components/EmptyState";
import useHostPendingBalance from "@/hooks/wallet/useHostPendingBalance";
import useHostEarningHistory from "@/hooks/wallet/useHostEarningHistory";
import { useHostDeductions } from "@/hooks/disputes/useHostDeductions";
import DashboardSectionTitle from "@/components/DashBoard/SectionTitle";
import PendingBalanceSummary from "@/components/Wallet/PendingBalanceSummary";
import PendingBalanceBookingsTable from "@/components/Wallet/PendingBalanceBookingsTable";
import EarningHistoryTable from "@/components/Wallet/EarningHistoryTable";
import WalletHistoryToggle, { WalletHistoryTab } from "@/components/Wallet/WalletHistoryToggle";
import type { HostBookingDeduction } from "@/types";
import { formatNgnAmount } from "@/utils/formatters";

const PAGE_LIMIT = 10;

export default function WalletPage() {
    const [historyTab, setHistoryTab] = useState<WalletHistoryTab>("payouts");
    const [payoutPage, setPayoutPage] = useState(1);
    const [earningPage, setEarningPage] = useState(1);
    const [filterYear, setFilterYear] = useState<number | "">("");
    const [filterMonth, setFilterMonth] = useState<number | "">("");
    const [selectedDeduction, setSelectedDeduction] = useState<HostBookingDeduction | null>(null);
    const [disputeContext, setDisputeContext] = useState("");
    const [isDisputeDialogOpen, setIsDisputeDialogOpen] = useState(false);
    const [isDisputesDialogOpen, setIsDisputesDialogOpen] = useState(false);

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
        bookingItems: earningItems,
        totalCount: earningTotal,
        totalEarnings,
        isError: earningError,
        isLoading: earningLoading,
        isFetching: earningFetching,
    } = useHostEarningHistory({
        enabled: true,
        currentPage: earningPage,
        pageLimit: PAGE_LIMIT,
        year: filterYear || undefined,
        month: filterMonth || undefined,
    });

    const { useDisputeDeduction, useGetMyDisputes } = useHostDeductions();
    const disputeDeduction = useDisputeDeduction();
    const disputes = useGetMyDisputes({ page: 0, size: 10 });

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

    const openDisputeDialog = (deduction: HostBookingDeduction) => {
        setSelectedDeduction(deduction);
        setDisputeContext("");
        setIsDisputeDialogOpen(true);
    };

    const handleSubmitDispute = () => {
        const hostContext = disputeContext.trim();
        if (!selectedDeduction || !hostContext) {
            toast.error("Please add a short reason for this dispute.");
            return;
        }

        disputeDeduction.mutate(
            {
                deductionId: selectedDeduction.id,
                payload: { hostContext },
            },
            {
                onSuccess: () => {
                    toast.success("Deduction dispute submitted successfully");
                    setIsDisputeDialogOpen(false);
                    setSelectedDeduction(null);
                    setDisputeContext("");
                },
                onError: () => {
                    toast.error("Could not submit dispute. Please try again.");
                },
            }
        );
    };

    const renderDisputeAction = (deduction: HostBookingDeduction) => (
        <button
            type="button"
            className="text-primary-500 font-semibold hover:text-primary-700 disabled:text-grey-400"
            onClick={() => openDisputeDialog(deduction)}
            disabled={disputeDeduction.isPending}
        >
            Dispute deduction
        </button>
    );

    const isPayoutTab = historyTab === "payouts";
    const tableLoading = isPayoutTab ? payoutLoading : earningLoading;
    const tableError = isPayoutTab ? payoutError : earningError;
    const tableTotal = isPayoutTab ? payoutTotal : earningTotal;
    const tablePage = isPayoutTab ? payoutPage : earningPage;

    return (
        <main className="py-11 space-y-11">
            <div className="space-y-6 md:space-y-8">
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
                            onChange={(e) => {
                                setFilterYear(e.target.value ? Number(e.target.value) : "");
                                setEarningPage(1);
                            }}
                        >
                            <option value="">All Years</option>
                            {years.map((year) => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                        <select
                            className="p-2 border border-grey-200 rounded-lg text-sm bg-white"
                            value={filterMonth}
                            onChange={(e) => {
                                setFilterMonth(e.target.value ? Number(e.target.value) : "");
                                setEarningPage(1);
                            }}
                        >
                            <option value="">All Months</option>
                            {months.map((month) => (
                                <option key={month.value} value={month.value}>{month.label}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="bg-primary-50 rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <span className="text-grey-700 font-medium">Earnings for selected period:</span>
                    {earningLoading || earningFetching ? (
                        <div className="w-24 h-8 bg-primary-100 animate-pulse rounded"></div>
                    ) : (
                        <span className="text-2xl font-bold text-primary-900 tabular-nums">
                            ₦{totalEarnings?.toLocaleString() || "0"}
                        </span>
                    )}
                </div>
            </div>

            <div className="space-y-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <DashboardSectionTitle title={isPayoutTab ? "Booking payouts" : "Earning history"} />
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        <button
                            type="button"
                            className="px-4 py-2 rounded-lg border border-grey-200 text-xs md:text-sm font-semibold text-primary-500 hover:bg-primary-75 transition-colors"
                            onClick={() => setIsDisputesDialogOpen(true)}
                        >
                            View all disputes
                        </button>
                        <WalletHistoryToggle
                            value={historyTab}
                            onChange={(tab) => {
                                setHistoryTab(tab);
                                if (tab === "payouts") setPayoutPage(1);
                                if (tab === "earnings") setEarningPage(1);
                            }}
                        />
                    </div>
                </div>

                {tableLoading ? (
                    <FullPageSpinner />
                ) : tableError ? (
                    <p>something went wrong</p>
                ) : isPayoutTab ? (
                    payoutItems.length === 0 ? (
                        <EmptyState
                            title="No payout bookings"
                            image="/icons/empty_trnx_state.png"
                            imageSize="w-[182px] 3xl:w-[265px]"
                        />
                    ) : (
                        <PendingBalanceBookingsTable items={payoutItems} />
                    )
                ) : (
                    <EarningHistoryTable items={earningItems} actions={renderDisputeAction} />
                )}

                {tableTotal > 0 && (
                    <Pagination
                        className="pagination-bar"
                        currentPage={tablePage}
                        totalCount={tableTotal}
                        pageLimit={PAGE_LIMIT}
                        onPageChange={(page) => {
                            if (isPayoutTab) {
                                setPayoutPage(page);
                                return;
                            }
                            setEarningPage(page);
                        }}
                    />
                )}
            </div>

            <BlurredDialog
                open={isDisputeDialogOpen}
                onOpenChange={setIsDisputeDialogOpen}
                title="Dispute deduction"
                description="Explain why this deduction should be reviewed."
                width="max-w-[560px]"
                content={
                    <div className="space-y-5">
                        {selectedDeduction && (
                            <div className="rounded-2xl bg-white border border-grey-200 p-4 text-sm text-grey-700 space-y-2">
                                <p className="capitalize">
                                    Type: {selectedDeduction.type.replace(/_/g, " ").toLowerCase()}
                                </p>
                                <p>Amount: ₦{formatNgnAmount(Number(selectedDeduction.amount) || 0)}</p>
                                <p>Booking ID: {selectedDeduction.bookingId}</p>
                            </div>
                        )}
                        <textarea
                            className="w-full min-h-32 rounded-2xl border border-grey-300 bg-white p-4 text-sm text-grey-800 outline-none focus:border-primary-500"
                            placeholder="Add context for the support team"
                            value={disputeContext}
                            onChange={(event) => setDisputeContext(event.target.value)}
                        />
                        <Button
                            color="primary"
                            radius="lg"
                            fullWidth
                            loading={disputeDeduction.isPending}
                            disabled={disputeDeduction.isPending}
                            onClick={handleSubmitDispute}
                        >
                            Submit dispute
                        </Button>
                    </div>
                }
            />
            <BlurredDialog
                open={isDisputesDialogOpen}
                onOpenChange={setIsDisputesDialogOpen}
                title="All disputes"
                width="max-w-[720px]"
                content={
                    <div className="space-y-4">
                        {disputes.isLoading ? (
                            <FullPageSpinner />
                        ) : disputes.isError ? (
                            <p className="text-red-500 p-4 bg-red-50 rounded-lg border border-red-100">
                                Failed to load disputes. Please try again.
                            </p>
                        ) : (disputes.data?.data.content ?? []).length > 0 ? (
                            <div className="space-y-3">
                                {(disputes.data?.data.content ?? []).map((dispute) => (
                                    <div
                                        key={dispute.id}
                                        className="rounded-2xl bg-white border border-grey-200 p-4 text-sm text-grey-700 space-y-2"
                                    >
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                            <p className="font-semibold text-grey-900">
                                                Deduction ID: {dispute.deductionId}
                                            </p>
                                            <span className="w-fit rounded-full bg-grey-100 px-3 py-1 text-xs font-semibold text-grey-700 capitalize">
                                                {dispute.status.replace(/_/g, " ").toLowerCase()}
                                            </span>
                                        </div>
                                        <p>{dispute.hostContext}</p>
                                        {dispute.csTicketReference && (
                                            <p>Ticket: {dispute.csTicketReference}</p>
                                        )}
                                        {dispute.resolutionNotes && (
                                            <p>Resolution: {dispute.resolutionNotes}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="rounded-2xl bg-white border border-grey-200 p-6 text-center text-sm text-grey-600">
                                No disputes yet.
                            </div>
                        )}
                    </div>
                }
            />
        </main>
    );
}
