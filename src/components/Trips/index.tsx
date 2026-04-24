"use client";

import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { FullPageSpinner, Pagination, SearchInput, FilterBy } from "@/ui";
import { debounce } from "@/utils/functions";
import EmptyState from "@/components/EmptyState";
import TripCard from "@/components/Trips/TripCard";
import { useMou } from "@/hooks/mou/useMou";

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

  const { useGetHostTrips } = useMou();
  
  const queryParams: any = {
    page: currentPage - 1,
    size: pageLimit,
  };

  if (filters.tripStatus && filters.tripStatus.length > 0) {
    queryParams.tripStatus = filters.tripStatus[0];
  }

  // NOTE: Assuming useGetHostTrips API can accept a search term if needed.
  // if (debouncedSearch) {
  //   queryParams.search = debouncedSearch;
  // }

  const handleFilterChange = (selectedFilters: Record<string, string[]>) => {
    setFilters(selectedFilters);
    setCurrentPage(1);
  };

  const handleSearch = (value: string) => setSearch(value);

  const debouncedTripSearch = useCallback(
    debounce((query: string) => {
      setDebouncedSearch(query);
      setCurrentPage(1);
    }, 500),
    []
  );

  useEffect(() => {
    debouncedTripSearch(search);
  }, [search, debouncedTripSearch]);

  const { data, isError, isLoading } = useGetHostTrips(queryParams);

  const trips = data?.data?.content ?? [];
  const totalCount = data?.data?.totalElements ?? 0;

  return (
    <div className="space-y-8 pt-[20px] md:pt-[50px]">
      <div className="flex items-center justify-between gap-3">
        <SearchInput
          placeholder="Search with Trip ID"
          name="tripsSearch"
          value={search}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            handleSearch(event.target.value)
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
        <p className="text-red-500 p-4 bg-red-50 rounded-lg border border-red-100">Failed to load trips. Please try again.</p>
      ) : (
        <>
          {trips.length > 0 ? (
            <div className="space-y-4">
              {trips.map((trip) => (
                <TripCard key={trip.id} content={trip} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No Trips Found"
              message="Your trips will appear here."
              image="/icons/empty_booking_state.png"
            />
          )}
        </>
      )}

      {totalCount > 0 && (
        <Pagination
          currentPage={currentPage}
          totalCount={totalCount}
          pageLimit={pageLimit}
          onPageChange={(page) => setCurrentPage(page)}
        />
      )}
    </div>
  );
}
