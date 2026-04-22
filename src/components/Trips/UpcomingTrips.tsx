"use client";

import { useState } from "react";
import { FullPageSpinner, Pagination } from "@/ui";
import EmptyState from "@/components/EmptyState";
import TableHead from "@/components/Table/TableHead";
import TableCell from "@/components/Table/TableCell";
import { upcomingTripTableHeadItems } from "@/utils/data";
import { useHostPerformance } from "@/hooks/performance/useHostPerformance";

export default function UpcomingTrips() {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const pageLimit = 10;

    const { useGetHostUpcomingTrip } = useHostPerformance();
    const { data, isError, isLoading } = useGetHostUpcomingTrip({
        page: currentPage - 1,
        size: pageLimit,
    });

    const trips = data?.data?.content ?? [];
    const totalCount = data?.data?.totalElements ?? 0;

    return (
        <div className="space-y-4">
            {isLoading ? (
                <FullPageSpinner />
            ) : isError ? (
                <p>Something went wrong</p>
            ) : trips.length === 0 ? (
                <EmptyState
                    title="No Upcoming Trips"
                    message="Your upcoming trips will appear here"
                    image="/icons/empty_booking_state.png"
                />
            ) : (
                <div className="overflow-auto">
                    <table className="w-full min-w-full divide-y divide-grey-200 border-t border-grey-200 bg-white md:mt-7">
                        <TableHead tableHeadItems={upcomingTripTableHeadItems} />
                        <tbody className="divide-y divide-grey-200">
                            {trips.map((trip) => (
                                <tr key={trip.id}>
                                    <TableCell
                                        content={trip.vehicleName || trip.vehicleIdentifier}
                                        className="!text-grey-900 !font-medium"
                                    />
                                    <TableCell content={trip.customerName} />
                                    <TableCell content={trip.pickupLocation || trip.city} />
                                    <TableCell content={trip.duration} />
                                    <TableCell content={trip.bookingStatus} isBadge type="booking" />
                                    <TableCell content={trip.tripStatus} />
                                    <TableCell content={`NGN ${trip.totalPrice?.toLocaleString()}`} />
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
