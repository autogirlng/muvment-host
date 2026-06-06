"use client";

import cn from "classnames";
import { useHostPerformanceBookings, HostBookingsSummary } from "@/hooks/bookings/useHostPerformanceBookings";

type StatCardProps = {
  title: string;
  value?: string | number;
  primary?: boolean;
  isLoading?: boolean;
};

function StatCard({ title, value = "-", primary, isLoading }: StatCardProps) {
  return (
    <div
      className={cn(
        "flex min-h-[110px] flex-col justify-between rounded-2xl px-4 py-4 sm:min-h-[120px] sm:px-5 sm:py-5",
        primary
          ? "bg-primary-500 text-white"
          : "border border-grey-200 bg-white text-grey-500",
      )}
    >
      <p className={cn("text-xs sm:text-sm", primary ? "text-white/90" : "text-grey-500")}>
        {title}
      </p>
      <p
        className={cn(
          "text-2xl font-bold leading-none sm:text-[28px] lg:text-[32px]",
          primary ? "text-white" : "text-grey-900",
        )}
      >
        {isLoading ? "…" : value}
      </p>
    </div>
  );
}

function formatStat(summary: HostBookingsSummary | undefined, key: keyof HostBookingsSummary) {
  const n = summary?.[key];
  return n != null ? String(n) : "-";
}

/** Stats from `GET /host-performance/bookings` → `data.summary` (when backend provides it). */
export default function BookingPageStats() {
  const { useGetHostBookings } = useHostPerformanceBookings();
  const { data, isLoading } = useGetHostBookings({ page: 0, size: 1 });
  const summary = data?.data?.summary;

  return (
    <div className="grid grid-cols-1 gap-3 xs:grid-cols-2 xl:grid-cols-4 xl:gap-4">
      <StatCard
        primary
        title="Total Bookings"
        value={formatStat(summary, "totalBookings")}
        isLoading={isLoading}
      />
      <StatCard
        title="Successful booking"
        value={formatStat(summary, "successfulBookings")}
        isLoading={isLoading}
      />
      <StatCard
        title="Pending booking"
        value={formatStat(summary, "pendingBookings")}
        isLoading={isLoading}
      />
      <StatCard
        title="Abandoned"
        value={formatStat(summary, "abandonedBookings")}
        isLoading={isLoading}
      />
    </div>
  );
}
