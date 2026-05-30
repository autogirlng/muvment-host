import { useEffect, useState } from "react";
import { format } from "date-fns";
import { FullPageSpinner, Pagination } from "@/ui";
import EmptyState from "@/components/EmptyState";
import TableHead from "@/components/Table/TableHead";
import TableCell from "@/components/Table/TableCell";
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
  });

  const bookings = data?.data?.content ?? [];
  const totalCount = data?.data?.totalElements ?? 0;

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
        <div className="overflow-auto rounded-2xl border border-grey-200 bg-white">
          <table className="block w-full min-w-full lg:table lg:divide-y lg:divide-grey-200">
            <TableHead tableHeadItems={bookingHistoryTableHeadItems} />
            <tbody className="block lg:table-row-group lg:divide-y lg:divide-grey-200">
              {bookings.map((booking) => (
                <tr
                  key={booking.bookingId}
                  className="mb-4 block rounded-xl border-2 border-grey-200 bg-white p-4 shadow-sm transition-all hover:border-grey-300 lg:mb-0 lg:table-row lg:rounded-none lg:border-0 lg:p-0 lg:shadow-none lg:hover:bg-grey-50"
                >
                  <TableCell title="Booking ID" content={booking.bookingId} />
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
