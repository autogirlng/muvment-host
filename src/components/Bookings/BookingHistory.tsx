import { useEffect, useState } from "react";
import { FullPageSpinner, Pagination } from "@/ui";
import BookingAnalyticsTable from "@/components/Bookings/BookingAnalyticsTable";
import useBookings from "@/hooks/bookings/useBookings";
import { BookingHistoryProps } from "./props";

export default function BookingHistory({ search, filters }: BookingHistoryProps) {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const pageLimit = 10;

    const { bookings, totalCount, isError, isLoading } = useBookings({
        currentPage,
        pageLimit,
        search,
        filters,
    });

    useEffect(() => {
        setCurrentPage(1);
    }, [search, filters]);

    return (
        <div className="space-y-4">
            {isLoading ? (
                <FullPageSpinner />
            ) : isError ? (
                <p>something went wrong</p>
            ) : (
                <BookingAnalyticsTable
                    items={bookings}
                    emptyStateTitle="No Bookings"
                    emptyStateMessage="Your Bookings Will Appear Here"
                />
            )}

            <Pagination
                currentPage={currentPage}
                totalCount={totalCount}
                pageLimit={pageLimit}
                onPageChange={(page) => setCurrentPage(page)}
            />
        </div>
    );
}
