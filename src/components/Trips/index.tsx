"use client";

import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { debounce } from "@/utils/functions";
import { format } from "date-fns";
import { FullPageSpinner, Pagination, SearchInput, FilterBy } from "@/ui";
import EmptyState from "@/components/EmptyState";
import { Table, TableBody, TableHead, TableCell, TableRow } from "@/components/Table";
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
    const [debouncedSearch, setDebouncedSearch] = useState<string>("");
    const pageLimit = 10;

    const debouncedTripSearch = useCallback(
        debounce((query: string) => {
            setDebouncedSearch(query);
        }, 500),
        [],
    );

    useEffect(() => {
        debouncedTripSearch(search);
    }, [search, debouncedTripSearch]);

    useEffect(() => {
        setCurrentPage(1);
    }, [debouncedSearch, filters]);

    const { useGetHostTrips } = useMou();

    const queryParams: HostTripsParams = {
        page: currentPage - 1,
        size: pageLimit,
    };

    if (filters.tripStatus?.length) {
        queryParams.tripStatus = filters.tripStatus[0] as HostTripsParams["tripStatus"];
    }
    if (debouncedSearch.trim()) {
        queryParams.invoiceNumber = debouncedSearch.trim();
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
                    placeholder="Search with Invoice Number"
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
                <Table className="md:mt-7">
                    <TableHead tableHeadItems={tripTableHeadItems} />
                    <TableBody>
                        {trips.map((trip) => (
                            <TableRow key={trip.id}>
                                <TableCell
                                    title="Invoice Number"
                                    content={trip.invoiceNumber || trip.bookingId || trip.id || "—"}
                                />
                                <TableCell title="Vehicle" content={trip.vehicleName || trip.vehicleIdentifier} />
                                <TableCell
                                    title="Driver"
                                    content={trip.driverName || "—"}
                                    className="!font-medium !text-grey-900"
                                />
                                <TableCell title="Start Date" content={trip.startDateTime ? formatDate(trip.startDateTime) : "N/A"} />
                                <TableCell title="End Date" content={trip.endDateTime ? formatDate(trip.endDateTime) : "N/A"} />
                                <TableCell title="Booking Status" content={trip.bookingStatus} isBadge type="booking" />
                                <TableCell title="Trip Status" content={trip.tripStatus} isBadge type="booking" />
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
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
