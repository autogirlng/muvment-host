import cn from "classnames";

type StatCardProps = {
  title: string;
  value?: string;
  primary?: boolean;
};

function StatCard({ title, value = "-", primary }: StatCardProps) {
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
        {value}
      </p>
    </div>
  );
}

/** Visual-only stat cards — no API calls (matches mockup layout). */
export default function BookingStatsPlaceholder() {
  return (
    <div className="grid grid-cols-1 gap-3 xs:grid-cols-2 xl:grid-cols-4 xl:gap-4">
      <StatCard primary title="Total Bookings" />
      <StatCard title="Pending Approvals" />
      <StatCard title="Rejected Bookings" />
      <StatCard title="Approved Requests" />
    </div>
  );
}
