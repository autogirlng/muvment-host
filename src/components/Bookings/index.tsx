"use client";

import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { format } from "date-fns";
import { SearchInput, FilterBy } from "@/ui";
import BookingHistory from "@/components/Bookings/BookingHistory";
import BookingStatsPlaceholder from "@/components/Bookings/BookingStatsPlaceholder";
import BookingAnalyticsHeader from "@/components/Bookings/BookingAnalyticsHeader";
import { bookingHistoryFilters } from "@/utils/data";
import { debounce } from "@/utils/functions";

export default function Bookings() {
  const [search, setSearch] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const [filters, setFilters] = useState<Record<string, string[]>>({});
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const handleFilterChange = (
    selectedFilters: Record<string, string[]>,
    dateRange?: { startDate: Date | null; endDate: Date | null },
  ) => {
    setFilters(selectedFilters);
    setStartDate(
      dateRange?.startDate ? format(dateRange.startDate, "yyyy-MM-dd") : "",
    );
    setEndDate(
      dateRange?.endDate ? format(dateRange.endDate, "yyyy-MM-dd") : "",
    );
  };

  const debouncedBookingSearch = useCallback(
    debounce((query: string) => {
      setDebouncedSearch(query);
    }, 500),
    [],
  );

  useEffect(() => {
    debouncedBookingSearch(search);
  }, [search, debouncedBookingSearch]);

  return (
    <div className="space-y-5 sm:space-y-6 lg:space-y-8">
      <BookingAnalyticsHeader />
      <BookingStatsPlaceholder />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchInput
          placeholder="Search with Booking ID"
          name="bookingsSearch"
          value={search}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            setSearch(event.target.value)
          }
          className="w-full max-w-none sm:max-w-[420px] lg:max-w-[520px]"
          icon
        />
        <FilterBy
          categories={bookingHistoryFilters}
          onChange={handleFilterChange}
          dateEnabled
        />
      </div>

      <BookingHistory
        search={debouncedSearch}
        filters={filters}
        startDate={startDate}
        endDate={endDate}
      />
    </div>
  );
}
