import React, { ChangeEvent, useCallback, useEffect, useState } from "react";
import { AppTabs, SearchInput, FilterBy } from "@/ui";
import UpcomingBookings from "@/components/Bookings/UpcomingBookings";
import BookingHistory from "@/components/Bookings/BookingHistory";
import { bookingFilters } from "@/utils/data";
import { debounce } from "@/utils/functions";



export default function Bookings() {
    const [search, setSearch] = useState<string>("");
    const [debouncedSearch, setDebouncedSearch] = useState<string>("");
    const [filters, setFilters] = useState<Record<string, string[]>>({});

    const handleFilterChange = (selectedFilters: Record<string, string[]>) =>
        setFilters(selectedFilters);

    const handleSearch = (value: string) => setSearch(value);

    const debouncedBookingSearch = useCallback(
        debounce((query) => {
            setDebouncedSearch(query);
        }, 500),
        []
    );

    useEffect(() => {
        debouncedBookingSearch(search);
    }, [search, debouncedBookingSearch]);

    const tabs = [
        // {
        //     name: "Upcoming",
        //     value: "tab1",
        //     content: <UpcomingBookings />,
        // },
        {
            name: "History",
            value: "tab1",
            content: <BookingHistory search={debouncedSearch} filters={filters} />,
        },
    ];

    return (
        <div className="space-y-8 pt-[50px]">
            <div className="flex items-center justify-between gap-3">
                <SearchInput
                    placeholder="Search with Booking ID, or Guest name"
                    name="bookingsSearch"
                    value={search}
                    onChange={(event: ChangeEvent<HTMLInputElement>) =>
                        handleSearch(event.target.value)
                    }
                    className="w-full max-w-[310px]"
                    icon
                />
                <FilterBy categories={bookingFilters} onChange={handleFilterChange} />
            </div>
            <AppTabs
                label="bookings tab"
                tabs={tabs}
                tabClass="flex-none"
                contentClass="bg-transparent !mt-10 !p-0"
            />
        </div>
    );
}
