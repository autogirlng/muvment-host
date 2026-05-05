import BookingAnalyticsTable from "@/components/Bookings/BookingAnalyticsTable";
import { FullPageSpinner, Pagination } from "@/ui";
import { useState } from "react";
import useUpcomingBookings from "@/hooks/bookings/useUpcomingBookings";
import EmptyState from "@/components/EmptyState";

export default function UpcomingBookings() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageLimit = 10;

  const { upcomingBookings, totalCount, isError, isLoading } =
    useUpcomingBookings({
      currentPage,
      pageLimit,
    });

  return (
    <div>
      {isLoading ? (
        <FullPageSpinner />
      ) : isError ? (
        <p>something went wrong</p>
      ) : upcomingBookings.length === 0 ? (
        <EmptyState
            title="No Upcoming Bookings"
            message="Your upcoming bookings will appear here"
            image="/icons/empty_booking_state.png"
        />
      ) : (
        // <BookingAnalyticsTable
        //   items={upcomingBookings || []}
        //   emptyStateTitle="No Upcoming Bookings"
        //   emptyStateMessage="Your Upcoming Bookings Will Appear Here"
        // />
        <></>
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
