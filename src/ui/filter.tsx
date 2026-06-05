import React, { useState, useEffect, useMemo } from "react";
import cn from "classnames";
import { format } from "date-fns";
import * as Popover from "@radix-ui/react-popover";
import * as Collapsible from "@radix-ui/react-collapsible";
import * as Checkbox from "@radix-ui/react-checkbox";
import { Icons, DateFilter } from "@/ui";
import { FilterByProps } from "./props";

const FilterBy: React.FC<FilterByProps> = ({
    categories,
    onChange,
    hideOnMobile,
    dateEnabled = false,
    singleSelect = false,
}) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const [selectedFilters, setSelectedFilters] = useState<
        Record<string, string[]>
    >({});
    const [openSections, setOpenSections] = useState<Record<string, boolean>>(
        categories.reduce(
            (acc, category, index) => ({ ...acc, [category.title]: index === 0 }),
            {}
        )
    );

    const [dateRange, setDateRange] = useState<{
        startDate: Date | null;
        endDate: Date | null;
    }>({
        startDate: null,
        endDate: null,
    });

    const activeFilterCount = useMemo(() => {
        const checkboxCount = Object.values(selectedFilters).reduce(
            (sum, arr) => sum + (arr?.length ?? 0),
            0
        );
        const dateCount =
            dateRange.startDate && dateRange.endDate ? 1 : 0;
        return checkboxCount + dateCount;
    }, [selectedFilters, dateRange]);

    const handleDateRangeChange = (
        startDate: Date | null,
        endDate: Date | null
    ) => {
        setDateRange({ startDate, endDate });
    };

    const toggleSection = (title: string) => {
        setOpenSections((prev) => ({ ...prev, [title]: !prev[title] }));
    };

    const handleCheckboxChange = (categoryTitle: string, optionValue: string) => {
        if (!singleSelect) {
            setSelectedFilters((prevFilters) => {
                const filters = { ...prevFilters };
                if (filters[categoryTitle]?.includes(optionValue)) {
                    filters[categoryTitle] = filters[categoryTitle].filter(
                        (item) => item !== optionValue
                    );
                } else {
                    filters[categoryTitle] = [
                        ...(filters[categoryTitle] || []),
                        optionValue,
                    ];
                }
                return filters;
            });
        } else {
            setSelectedFilters((prevFilters) => {
                const filters = { ...prevFilters };
                if (filters[categoryTitle]?.[0] === optionValue) {
                    filters[categoryTitle] = [];
                } else {
                    filters[categoryTitle] = [optionValue];
                }
                return filters;
            });
        }
    };

    useEffect(() => {
        onChange(selectedFilters, dateRange);
    }, [selectedFilters, dateRange, onChange]);

    const addSpaceBeforeUppercase = (str: string): string => {
        return str?.replace(/([a-z])([A-Z])/g, "$1 $2");
    };

    const handleClearAll = () => {
        setSelectedFilters({});
        setDateRange({ startDate: null, endDate: null });
    };

    return (
        <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
            <div className="relative inline-flex">
            <Popover.Trigger asChild>
                <button
                    type="button"
                    className={cn(
                        "inline-flex cursor-pointer items-center gap-2 rounded-xl border bg-white px-4 py-2.5 text-sm font-medium shadow-sm outline-none transition-all",
                        activeFilterCount > 0
                            ? "border-primary-300 text-primary-700 ring-2 ring-primary-50"
                            : "border-grey-200 text-grey-700 hover:border-primary-300 hover:shadow-md focus-visible:ring-2 focus-visible:ring-primary-100"
                    )}
                    aria-label="Filter"
                >
                    <span className="text-grey-600">{Icons.ic_filter}</span>
                    <span
                        className={cn(
                            "text-grey-700",
                            hideOnMobile && "hidden sm:inline"
                        )}
                    >
                        Filter
                    </span>
                    {activeFilterCount > 0 && (
                        <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary-500 px-1.5 text-[10px] font-bold text-white">
                            {activeFilterCount}
                        </span>
                    )}
                    <span
                        className={cn(
                            "text-grey-400 transition-transform duration-200",
                            isOpen && "rotate-180",
                            hideOnMobile && "hidden sm:inline"
                        )}
                    >
                        {Icons.ic_chevron_down}
                    </span>
                </button>
            </Popover.Trigger>
            </div>
            <Popover.Portal>
                <Popover.Content
                    className="z-[200] flex max-h-[min(70dvh,calc(100dvh-5rem))] w-[min(360px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-grey-200 bg-white p-0 shadow-[0_8px_30px_rgba(16,25,40,0.12)]"
                    side="bottom"
                    align="end"
                    sideOffset={6}
                    alignOffset={0}
                    collisionPadding={16}
                    avoidCollisions
                    sticky="partial"
                    onOpenAutoFocus={(e) => e.preventDefault()}
                >
                    <div className="shrink-0 border-b border-grey-100 px-5 py-4">
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-semibold text-grey-800">
                                Filter by
                            </p>
                            <button
                                type="button"
                                onClick={handleClearAll}
                                className="inline-flex items-center gap-1.5 text-xs font-medium text-primary-500 outline-none transition-colors hover:text-primary-600 hover:underline"
                            >
                                Clear all
                                <span className="!h-4 !w-4">{Icons.ic_cancel_circle}</span>
                            </button>
                        </div>
                    </div>

                    <div className="table-filter-scroll min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-4">
                        <div className="space-y-4">
                            {categories.map((category) => (
                                <Collapsible.Root
                                    key={category.title}
                                    open={openSections[category.title]}
                                    onOpenChange={() => toggleSection(category.title)}
                                >
                                    <button
                                        type="button"
                                        className="flex w-full items-center justify-between rounded-lg py-1 text-left text-sm font-medium text-grey-800 outline-none hover:text-grey-900"
                                        onClick={() => toggleSection(category.title)}
                                    >
                                        <span className="capitalize">
                                            {addSpaceBeforeUppercase(category.title)}
                                        </span>
                                        <span className="text-grey-400">
                                            {openSections[category.title]
                                                ? Icons.ic_chevron_up
                                                : Icons.ic_chevron_down}
                                        </span>
                                    </button>
                                    <Collapsible.Content className="mt-2 space-y-2.5 pl-0.5">
                                        {category.options.map((option) => {
                                            const checked = selectedFilters[
                                                category.title
                                            ]?.includes(option.value);
                                            return (
                                                <label
                                                    key={option.value}
                                                    htmlFor={`filter-${category.title}-${option.value}`}
                                                    className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-1.5 transition-colors hover:bg-grey-50"
                                                >
                                                    <Checkbox.Root
                                                        id={`filter-${category.title}-${option.value}`}
                                                        className={cn(
                                                            "flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors",
                                                            checked
                                                                ? "border-primary-400 bg-primary-500"
                                                                : "border-grey-300 bg-white hover:border-primary-300"
                                                        )}
                                                        checked={checked}
                                                        onCheckedChange={() =>
                                                            handleCheckboxChange(
                                                                category.title,
                                                                option.value
                                                            )
                                                        }
                                                    >
                                                        <Checkbox.Indicator className="flex items-center justify-center text-white">
                                                            {Icons.ic_check}
                                                        </Checkbox.Indicator>
                                                    </Checkbox.Root>
                                                    <span className="text-sm text-grey-700">
                                                        {option.option}
                                                    </span>
                                                </label>
                                            );
                                        })}
                                    </Collapsible.Content>
                                </Collapsible.Root>
                            ))}

                            {dateEnabled && (
                                <div className="border-t border-grey-100 pt-4">
                                    <DateFilter
                                        onDateRangeChange={handleDateRangeChange}
                                        initialStartDate={dateRange.startDate}
                                        initialEndDate={dateRange.endDate}
                                    />
                                    {dateRange.startDate && dateRange.endDate && (
                                        <div className="mt-3 flex items-center justify-between rounded-lg bg-primary-50 px-3 py-2.5 text-xs">
                                            <p className="font-medium text-primary-600">
                                                {format(dateRange.startDate, "MMM do yyyy")} –{" "}
                                                {format(dateRange.endDate, "MMM do yyyy")}
                                            </p>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setDateRange({
                                                        startDate: null,
                                                        endDate: null,
                                                    })
                                                }
                                                className="text-primary-500 outline-none hover:text-primary-700"
                                                aria-label="Clear date range"
                                            >
                                                <span className="*:!h-4 *:!w-4">
                                                    {Icons.ic_close_circle}
                                                </span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </Popover.Content>
            </Popover.Portal>
        </Popover.Root>
    );
};

export { FilterBy };
