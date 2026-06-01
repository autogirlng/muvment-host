"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { Button, FullPageSpinner, Pagination } from "@/ui";
import { BlurredDialog } from "@/ui/dialog";
import DashboardSectionTitle from "@/components/DashBoard/SectionTitle";
import WalletBalance from "@/components/Wallet/WalletBalance";
import EarningHistoryTable from "@/components/Wallet/EarningHistoryTable";
import PendingBalanceBookingsTable from "@/components/Wallet/PendingBalanceBookingsTable";
import WalletHistoryToggle, { WalletHistoryTab } from "@/components/Wallet/WalletHistoryToggle";
import useHostEarningHistory from "@/hooks/wallet/useHostEarningHistory";
import useHostPendingBalance from "@/hooks/wallet/useHostPendingBalance";
import { useHostDeductions } from "@/hooks/disputes/useHostDeductions";
import type { HostBookingDeduction } from "@/types";
import { formatNgnAmount } from "@/utils/formatters";

export default function Wallet() {
    const [historyTab, setHistoryTab] = useState<WalletHistoryTab>("payouts");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedDeduction, setSelectedDeduction] = useState<HostBookingDeduction | null>(null);
    const [disputeContext, setDisputeContext] = useState("");
    const [isDisputeDialogOpen, setIsDisputeDialogOpen] = useState(false);
    const [isDisputesDialogOpen, setIsDisputesDialogOpen] = useState(false);
    const pageLimit = 10;
    const pendingBalance = useHostPendingBalance({ currentPage, pageLimit });
    const earningHistory = useHostEarningHistory({ currentPage, pageLimit });
    const { useDisputeDeduction, useGetMyDisputes } = useHostDeductions();
    const disputeDeduction = useDisputeDeduction();
    const disputes = useGetMyDisputes({ page: 0, size: 10 });

    const isPayoutsTab = historyTab === "payouts";
    const items = isPayoutsTab ? pendingBalance.items : earningHistory.bookingItems;
    const totalCount = isPayoutsTab ? pendingBalance.totalCount : earningHistory.totalCount;
    const isLoading = isPayoutsTab ? pendingBalance.isLoading : earningHistory.isLoading;
    const isError = isPayoutsTab ? pendingBalance.isError : earningHistory.isError;

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

    return (
        <>
            <WalletBalance />
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <DashboardSectionTitle title="Transaction History" />
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
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
                                setCurrentPage(1);
                            }}
                        />
                    </div>
                </div>
                {isLoading ? (
                    <FullPageSpinner />
                ) : isError ? (
                    <p className="text-red-500 p-4 bg-red-50 rounded-lg border border-red-100">
                        Failed to load wallet history. Please try again.
                    </p>
                ) : historyTab === "payouts" ? (
                    <>
                        <PendingBalanceBookingsTable items={items} />
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
                    <>
                        <EarningHistoryTable items={items} actions={renderDisputeAction} />
                        {totalCount > 0 && (
                            <Pagination
                                currentPage={currentPage}
                                totalCount={totalCount}
                                pageLimit={pageLimit}
                                onPageChange={setCurrentPage}
                            />
                        )}
                    </>
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
                                            <span className="w-fit rounded-full bg-grey-100 px-3 py-1 text-xs font-semibold text-grey-700">
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
                            <EmptyDisputesState />
                        )}
                    </div>
                }
            />
        </>
    );
}

function EmptyDisputesState() {
    return (
        <div className="rounded-2xl bg-white border border-grey-200 p-6 text-center text-sm text-grey-600">
            No disputes yet.
        </div>
    );
}
