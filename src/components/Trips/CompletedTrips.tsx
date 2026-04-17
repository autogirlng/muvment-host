"use client";

import { useState } from "react";
import { format } from "date-fns";
import { FullPageSpinner, Pagination } from "@/ui";
import EmptyState from "@/components/EmptyState";
import TableHead from "@/components/Table/TableHead";
import TableCell from "@/components/Table/TableCell";
import { completedTripTableHeadItems } from "@/utils/data";
import { useHostPerformance } from "@/hooks/performance/useHostPerformance";

export default function CompletedTrips() {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const pageLimit = 10;

    const { useGetCompletedTrip } = useHostPerformance();
    const { data, isError, isLoading } = useGetCompletedTrip({
        page: currentPage - 1,
        size: pageLimit,
    });

    const trips = data?.data ?? [];
    const totalCount = trips.length;

    return (
        <div className="space-y-4">
            {isLoading ? (
                <FullPageSpinner />
            ) : isError ? (
                <p>Something went wrong</p>
            ) : trips.length === 0 ? (
                <EmptyState
                    title="No Completed Trips"
                    message="Your completed trips will appear here"
                    image="/icons/empty_booking_state.png"
                />
            ) : (
                <div className="overflow-auto">
                    <table className="w-full min-w-full divide-y divide-grey-200 border-t border-grey-200 bg-white md:mt-7">
                        <TableHead tableHeadItems={completedTripTableHeadItems} />
                        <tbody className="divide-y divide-grey-200">
                            {trips.map((trip, index) => (
                                <tr key={index}>
                                    <TableCell
                                        content={trip.vehicleId}
                                        className="!text-grey-900 !font-medium"
                                    />
                                    <TableCell
                                        content={
                                            trip.dates.length > 0
                                                ? trip.dates
                                                      .map(
                                                          (d) =>
                                                              `${format(new Date(d.startDate), "MMM dd")} - ${format(new Date(d.endDate), "MMM dd, yyyy")}`
                                                      )
                                                      .join(", ")
                                                : "N/A"
                                        }
                                    />
                                    <TableCell content={`NGN ${trip.totalFare?.toLocaleString()}`} />
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
