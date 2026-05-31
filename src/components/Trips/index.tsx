"use client";

import { ChangeEvent, useState } from "react";
import { format } from "date-fns";
import { FullPageSpinner, Pagination, SearchInput, FilterBy } from "@/ui";
import EmptyState from "@/components/EmptyState";
import TableHead from "@/components/Table/TableHead";
import TableCell from "@/components/Table/TableCell";
import TripReceipt from "@/components/Trips/TripReceipt";
import TripsHero from "@/components/Trips/TripsHero";
import { tripTableHeadItems } from "@/utils/data";
import { useMou } from "@/hooks/mou/useMou";
import { HostTripsParams } from "@/types";

const tripFilters = [
    {
        title: "tripStatus",
        options: [
            { option: "Upcoming", value: "UPCOMING" },
            { option: "In Progress", value: "IN_PROGRESS" },
            { option: "Coming to an End", value: "COMING_TO_AN_END" },
            { option: "Completed", value: "COMPLETED" },
            { option: "Delayed", value: "DELAYED" },
            { option: "Extended", value: "EXTENDED" },
            { option: "Cancelled", value: "CANCELLED" },
        ],
    },
];

export default function Trips() {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [filters, setFilters] = useState<Record<string, string[]>>({});
    const [search, setSearch] = useState<string>("");
    const pageLimit = 10;

    const { useGetHostTrips } = useMou();

    const queryParams: HostTripsParams = {
        page: currentPage - 1,
        size: pageLimit,
    };

    if (filters.tripStatus?.length) {
        queryParams.tripStatus = filters.tripStatus[0] as HostTripsParams["tripStatus"];
    }

    const handleFilterChange = (selectedFilters: Record<string, string[]>) => {
        setFilters(selectedFilters);
        setCurrentPage(1);
    };


    const { data, isError, isLoading } = useGetHostTrips(queryParams);

    const trips = data?.data?.content ?? [];
    const totalCount = data?.data?.totalElements ?? 0;

    const formatDate = (dt: string) => {
        try {
            return format(new Date(dt), "MMM dd, yyyy");
        } catch {
            return "N/A";
        }
    };

    return (
        <div className="space-y-5 sm:space-y-6 lg:space-y-8">
            <TripsHero />
            <div className="flex items-center justify-between gap-3">
                <SearchInput
                    placeholder="Search with Trip ID"
                    name="tripsSearch"
                    value={search}
                    onChange={(event: ChangeEvent<HTMLInputElement>) =>
                        setSearch(event.target.value)
                    }
                    className="w-full max-w-[310px]"
                    icon
                />
                <FilterBy
                    categories={tripFilters}
                    onChange={handleFilterChange}
                    singleSelect={true}
                />
            </div>

            {isLoading ? (
                <FullPageSpinner />
            ) : isError ? (
                <p className="text-red-500 p-4 bg-red-50 rounded-lg border border-red-100">
                    Failed to load trips. Please try again.
                </p>
            ) : trips.length === 0 ? (
                <EmptyState
                    title="No Trips Found"
                    message="Your trips will appear here."
                    image="/icons/empty_booking_state.png"
                />
            ) : (
                <div className="overflow-auto bg-grey-50 lg:bg-white rounded-xl lg:rounded-none p-4 lg:p-0">
                    <table className="block lg:table w-full min-w-full lg:divide-y divide-grey-200 lg:border-t border-grey-200 bg-white md:mt-7">
                        <TableHead tableHeadItems={tripTableHeadItems} />
                        <tbody className="block lg:table-row-group lg:divide-y divide-grey-200">
                            {trips.map((trip) => (
                                <tr
                                    key={trip.id}
                                    className="block lg:table-row bg-white border-2 border-grey-200 lg:border-none hover:border-grey-300 lg:hover:bg-grey-50 rounded-xl lg:rounded-none mb-4 lg:mb-0 p-4 lg:p-0 shadow-sm lg:shadow-none transition-all"
                                >
                                    <TableCell title="Trip ID" content={trip.bookingId || trip.id} />
                                    <TableCell title="Vehicle" content={trip.vehicleName || trip.vehicleIdentifier} />
                                    <TableCell
                                        title="Driver"
                                        content={trip.driverName || "—"}
                                        className="!text-grey-900 !font-medium"
                                    />
                                    <TableCell title="Start Date" content={trip.startDateTime ? formatDate(trip.startDateTime) : "N/A"} />
                                    <TableCell title="End Date" content={trip.endDateTime ? formatDate(trip.endDateTime) : "N/A"} />
                                    <TableCell title="Booking Status" content={trip.bookingStatus} isBadge type="booking" />
                                    <TableCell title="Trip Status" content={trip.tripStatus} isBadge type="booking" />
                                    {/* <TableCell content={`NGN ${(trip.totalPrice ?? 0).toLocaleString()}`} /> */}
                                    {/* <td className="px-4 py-3">
                                        <button
                                            onClick={() => setSelectedTrip(trip)}
                                            className="flex items-center gap-1.5 text-xs font-medium text-primary-500 hover:text-primary-700 transition-colors"
                                            title="Print Receipt"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z"/>
                                            </svg>
                                            Receipt
                                        </button>
                                    </td> */}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {totalCount > 0 && (
                <Pagination
                    currentPage={currentPage}
                    totalCount={totalCount}
                    pageLimit={pageLimit}
                    onPageChange={(page) => setCurrentPage(page)}
                />
            )}

            {/* <BlurredDialog
                open={!!selectedTrip}
                onOpenChange={(open) => { if (!open) setSelectedTrip(null); }}
                title="Trip Receipt"
                width="max-w-[520px]"
                content={
                    selectedTrip ? <TripReceipt trip={selectedTrip} /> : null
                }
            /> */}
        </div>
    );
}
