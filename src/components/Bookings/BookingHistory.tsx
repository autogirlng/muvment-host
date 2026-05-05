import { useEffect, useState } from "react";
import { format } from "date-fns";
import { FullPageSpinner, Pagination } from "@/ui";
import EmptyState from "@/components/EmptyState";
import TableHead from "@/components/Table/TableHead";
import TableCell from "@/components/Table/TableCell";
import { bookingHistoryTableHeadItems } from "@/utils/data";
import { useHostPerformance } from "@/hooks/performance/useHostPerformance";

interface BookingHistoryProps {
    search?: string;
    filters?: Record<string, string[]>;
    startDate?: string;
    endDate?: string;
}

export default function BookingHistory({ search, filters, startDate, endDate }: BookingHistoryProps) {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const pageLimit = 10;

    const { useGetHostBookingHistory } = useHostPerformance();
    const { data, isError, isLoading } = useGetHostBookingHistory({
        page: currentPage - 1,
        size: pageLimit,
        bookingId: search || undefined,
        bookingStatus: filters?.bookingStatus?.[0] || undefined,
        vehicleTypeName: filters?.vehicleTypeName?.[0] || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
    });


    const bookings = data?.data?.content ?? [];
    const totalCount = data?.data?.totalElements ?? 0;

    useEffect(() => {
        setCurrentPage(1);
    }, [search, filters, startDate, endDate]);

    return (
        <div className="space-y-4">
            {isLoading ? (
                <FullPageSpinner />
            ) : isError ? (
                <p>Something went wrong</p>
            ) : bookings.length === 0 ? (
                <EmptyState
                    title="No Booking History"
                    message="Your booking history will appear here"
                    image="/icons/empty_booking_state.png"
                />
            ) : (
                <div className="overflow-auto">
                    <table className="w-full min-w-full divide-y divide-grey-200 border-t border-grey-200 bg-white md:mt-7">
                        <TableHead tableHeadItems={bookingHistoryTableHeadItems} />
                        <tbody className="divide-y divide-grey-200">
                            {bookings.map((booking) => (
                                <tr key={booking.bookingId}>
                                    <TableCell content={booking.bookingRef || booking.bookingId} />
                                    <TableCell
                                        content={booking.guestFullName || `${booking.user?.firstName ?? ""} ${booking.user?.lastName ?? ""}`.trim()}
                                        className="!text-grey-900 !font-medium"
                                    />
                                    <TableCell content={booking.vehicleId} />
                                    <TableCell content={booking.status} isBadge type="booking" />
                                    <TableCell content={`NGN ${booking.totalPrice?.toLocaleString()}`} />
                                    <TableCell
                                        content={
                                            booking.bookedAt
                                                ? format(new Date(booking.bookedAt), "MMM dd, yyyy")
                                                : "N/A"
                                        }
                                    />
                                    <TableCell content={booking.purposeOfRide || "—"} />
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
