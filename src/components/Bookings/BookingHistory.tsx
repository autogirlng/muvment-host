import { useEffect, useState } from "react";
import { format } from "date-fns";
import { FullPageSpinner, Pagination } from "@/ui";
import EmptyState from "@/components/EmptyState";
import { Table, TableBody, TableHead, TableCell, TableRow } from "@/components/Table";
import { bookingHistoryTableHeadItems } from "@/utils/data";
import { useHostPerformanceBookings } from "@/hooks/bookings/useHostPerformanceBookings";

interface BookingHistoryProps {
  search?: string;
  filters?: Record<string, string[]>;
  startDate?: string;
  endDate?: string;
}

export default function BookingHistory({
  search,
  filters,
  startDate,
  endDate,
}: BookingHistoryProps) {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageLimit = 10;

  const { useGetHostBookings } = useHostPerformanceBookings();
  const { data, isError, isLoading } = useGetHostBookings({
    page: currentPage - 1,
    size: pageLimit,
    bookingStatus: filters?.bookingStatus?.[0] || undefined,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
    invoiceNumber: search?.trim() || undefined,
  });

  const bookings = data?.data?.content?.content ?? [];
  const totalCount = data?.data?.content?.totalElements ?? 0;

  useEffect(() => {
    setCurrentPage(1);
  }, [search, filters, startDate, endDate]);

  return (
    <div className="space-y-6">
      {isLoading ? (
        <FullPageSpinner className="!min-h-[200px]" />
      ) : isError ? (
        <p className="text-sm text-grey-600">Something went wrong</p>
      ) : bookings.length === 0 ? (
        <EmptyState
          title="No Bookings"
          message="Your bookings will appear here"
          image="/images/dashboard/bookings-empty-state.png"
          containerClassName="rounded-2xl bg-grey-75 py-12 sm:py-16 lg:py-20"
          imageSize="w-[120px] sm:w-[150px] lg:w-[182px]"
        />
      ) : (
        <Table stickyHeader>
          <TableHead tableHeadItems={bookingHistoryTableHeadItems} sticky />
          <TableBody>
            {bookings.map((booking) => (
              <TableRow key={booking.bookingId}>
                <TableCell
                  title="Invoice Number"
                  content={booking.invoiceNumber || booking.bookingId || "—"}
                />
                <TableCell title="Vehicle" content={booking.vehicleName} />
                <TableCell
                  title="Status"
                  content={booking.status}
                  isBadge
                  type="booking"
                />
                <TableCell
                  title="Booked At"
                  content={
                    booking.bookedAt
                      ? format(new Date(booking.bookedAt), "MMM dd, yyyy")
                      : "N/A"
                  }
                />
                <TableCell title="Purpose" content={booking.purposeOfRide || "—"} />
              </TableRow>
            ))}
          </TableBody>
        </Table>
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
