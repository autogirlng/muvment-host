"use client";
import { useState } from "react";
import { transactionFilters } from "@/utils/data";
import { FullPageSpinner, FilterBy, Pagination } from "@/ui";
import EmptyState from "@/components/EmptyState";
import useTransactions from "@/hooks/wallet/useTransactions";
import DashboardSectionTitle from "@/components/DashBoard/SectionTitle";
import WalletBalance from "@/components/Wallet/WalletBalance";
import TransactionTable from "@/components/Wallet/TransactionTable";

export default function WalletPage() {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [filters, setFilters] = useState<Record<string, string[]>>({});
    const pageLimit = 10;

    const { transactions, totalCount, isError, isLoading } = useTransactions({
        currentPage,
        pageLimit,
        filters,
    });

    const handleFilterChange = (selectedFilters: Record<string, string[]>) => {
        setFilters(selectedFilters);
        setCurrentPage(1);
    };

    return (
        <main className="py-11 space-y-11">
            <WalletBalance />
            <div className="space-y-6">
                <div className="flex items-center justify-between gap-">
                    <DashboardSectionTitle title="Transaction History" />
                    <FilterBy
                        categories={transactionFilters}
                        onChange={handleFilterChange}
                    />
                </div>
                {isLoading ? (
                    <FullPageSpinner />
                ) : isError ? (
                    <p>something went wrong</p>
                ) : transactions.length === 0 ? (
                    <EmptyState
                        title="No Transaction History"
                        image="/icons/empty_trnx_state.png"
                        imageSize="w-[182px] 3xl:w-[265px]"
                    />
                ) : (
                    <TransactionTable items={transactions} />
                )}
                <Pagination
                    className="pagination-bar"
                    currentPage={currentPage}
                    totalCount={totalCount}
                    pageLimit={pageLimit}
                    onPageChange={(page) => setCurrentPage(page)}
                />
            </div>
        </main>
    );
}
