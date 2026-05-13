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

export default function BookingHistory({ search, filters, startDate, endDate }: BookingHistoryProps) {
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
        <div className="space-y-4">
            {isLoading ? (
                <FullPageSpinner />
            ) : isError ? (
                <p>Something went wrong</p>
            ) : bookings.length === 0 ? (
                <EmptyState
                    title="No Bookings"
                    message="Your bookings will appear here"
                    image="/icons/empty_booking_state.png"
                />
            ) : (
                <div className="overflow-auto bg-grey-50 lg:bg-white rounded-xl lg:rounded-none p-4 lg:p-0">
                    <table className="block lg:table w-full min-w-full lg:divide-y divide-grey-200 lg:border-t border-grey-200 bg-transparent lg:bg-white md:mt-7">
                        <TableHead tableHeadItems={bookingHistoryTableHeadItems} />
                        <tbody className="block lg:table-row-group lg:divide-y divide-grey-200">
                            {bookings.map((booking) => (
                                <tr key={booking.bookingId} className="block lg:table-row bg-white border-2 border-grey-200 lg:border-none hover:border-grey-300 lg:hover:bg-grey-50 rounded-xl lg:rounded-none mb-4 lg:mb-0 p-4 lg:p-0 shadow-sm lg:shadow-none transition-all">
                                    <TableCell title="Booking ID" content={booking.bookingId} />
                                    {/* <TableCell
                                        title="Guest Name"
                                        content={booking.guestFullName}
                                        className="!text-grey-900 !font-medium"
                                    /> */}
                                    <TableCell title="Vehicle" content={booking.vehicleName} />
                                    <TableCell title="Status" content={booking.status} isBadge type="booking" />
                                    {/* <TableCell title="Total Price" content={`NGN ${booking.totalPrice?.toLocaleString()}`} /> */}
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
