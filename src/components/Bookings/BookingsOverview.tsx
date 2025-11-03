import React, { useEffect, useState } from "react";
import { Icons, SelectInput, FilterBy, FullPageSpinner } from "@/ui";

import Table from "@/components/Bookings/BookingTable";
import { monthsFilter } from "@/utils/data";
import useBookingsOverview from "@/hooks/bookings/useBookingsOverview";
import SectionTitle from "@/components/DashBoard/SectionTitle";
import cn from "classnames";
import { useAppSelector } from "@/lib/hooks";

type Props = {};

export default function BookingsOverview({ }: Props) {
    const { user } = useAppSelector((state) => state.user);

    const [filters, setFilters] = useState<Record<string, string[]>>({});
    const [selectedMonth, setSelectedMonth] = React.useState<number>();
    const [selectedYear, setSelectedYear] = React.useState<string>();

    const { bookings, isError, isLoading, bookingOverviewFilters } =
        useBookingsOverview({
            month: selectedMonth,
            year: selectedYear,
            filters,
        });

    const handleFilterChange = (selectedFilters: Record<string, string[]>) => {
        setFilters(selectedFilters);
    };
    console.log(bookings)

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between gap-3">
                <SectionTitle icon={Icons.ic_ticket} title="Bookings" />
                <div className="block md:hidden">
                    <FilterBy
                        categories={bookingOverviewFilters}
                        onChange={handleFilterChange}
                    />
                </div>
            </div>
            {/* {user?.withdrawalAccountVerified && user?.phoneVerified && (
                <div className="flex justify-between gap-2">
                    <div className="flex gap-2 flex-wrap justify-between items-center w-full">
                        <div className="hidden md:flex flex-wrap gap-2">
                            <div className="divide-x divide-grey-300 border border-grey-300 rounded-lg w-fit h-fit flex">
                                {monthsFilter.map((month, index) => (
                                    <button
                                        className={cn(
                                            "py-1.5 3xl:py-2 px-3 3xl:px-7 text-grey-600 text-xs 3xl:text-sm hover:bg-primary-75",
                                            index === (selectedMonth || 0) - 1 &&
                                            "bg-primary-500 text-white"
                                        )}
                                        key={index}
                                        onClick={() => setSelectedMonth(index + 1)}
                                    >
                                        {month}
                                    </button>
                                ))}
                            </div>
                            <div className="w-[82px]">
                                <SelectInput
                                    defaultValue={"2024"}
                                    variant="outlined"
                                    id="year"
                                    className="border border-grey-300 rounded-lg !text-xs 3xl:!text-sm font-medium !text-grey-600 !py-2 !px-3 !h-8 3xl:!h-[2.3rem]"
                                    options={[
                                        { value: "2024", option: "2024" },
                                        { value: "2023", option: "2023" },
                                        { value: "2022", option: "2022" },
                                        { value: "2021", option: "2021" },
                                    ]}
                                    onChange={(value) => setSelectedYear(value)}
                                />
                            </div>
                        </div>

                        <div className="hidden md:block">
                            <FilterBy
                                categories={bookingOverviewFilters}
                                onChange={handleFilterChange}
                            />
                        </div>
                    </div>
                </div>
            )} */}
            {isLoading ? (
                <FullPageSpinner className="!min-h-[200px]" />
            ) : isError ? (
                <p>something went wrong</p>
            ) : (
                <Table
                    items={bookings?.content ?? []}
                    emptyStateMessage="Your Bookings Will Appear Here"
                />
            )}
        </div>
    );
}
