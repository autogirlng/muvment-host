"use client";

import { useEffect, useState } from "react";
import useNotifications from "@/hooks/useNotifications";
import Notifications from "@/components/Notifications";
import { Pagination, DateRangeCalendar } from "@/ui";
import { CalendarValue } from "@/types";
import classNames from "classnames";

export default function NotificationsPage() {
  const pageLimit = 20;
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [filters, setFilters] = useState<CalendarValue>(null);
  const [value, onChange] = useState<CalendarValue>(null);
  const [calendarValues, setCalendarValues] = useState<CalendarValue>(null);
  const [calendarIsOpen, setCalendarIsOpen] = useState<boolean>(false);

  const {
    notifications,
    isError,
    isLoading,
    totalCount,
    // unreadCount,
  } = useNotifications({ pageLimit, currentPage });

  useEffect(() => {
    setFilters(calendarValues);
    setCurrentPage(1);
    setCalendarIsOpen(false);
  }, [calendarValues]);

  return (
    <main className="py-[56px] space-y-10">
      <div className="flex justify-between items-center gap-3">
        <h2 className="text-h3 3xl:text-4xl text-grey-700 !font-bold">
          Notifications
        </h2>
        <DateRangeCalendar
          title="Select Date Range"
          selectRange={true}
          value={value}
          onChange={onChange}
          setCalendarValues={setCalendarValues}
          isOpen={calendarIsOpen}
          handleIsOpen={(open: boolean) => setCalendarIsOpen(open)}
          buttonClass={classNames(
            "h-12 w-12 flex items-center justify-center rounded-full",
            calendarValues ? "bg-primary-500 text-white" : "bg-grey-90 "
          )}
        />
      </div>
      <Notifications
        notifications={notifications}
        isError={isError}
        isLoading={isLoading}
        isDivider
        startDate={Array.isArray(value) && value[0] ? value[0] : undefined}
        endDate={Array.isArray(value) && value[1] ? value[1] : undefined}
      />
      <Pagination
        currentPage={currentPage}
        totalCount={totalCount}
        pageLimit={pageLimit}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </main>
  );
}
