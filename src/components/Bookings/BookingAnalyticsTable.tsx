import { bookingAnalyticsTableHeadItems } from "@/utils/data";
import { BookingSegmentContent } from "@/types";
import TableHead from "@/components/Table/TableHead";
import EmptyState from "@/components/EmptyState";
import BookingDesktopRow from "@/components/Bookings/BookingDesktopRow";
import BookingMobileRow from "@/components/Bookings/BookingMobileRow";

export default function BookingAnalyticsTable({
  items,
  emptyStateMessage,
  emptyStateTitle,
}: {
  items: BookingSegmentContent[];
  emptyStateMessage: string;
  emptyStateTitle?: string;
}) {
  return items.length > 0 ? (
    <div className="overflow-auto rounded-2xl border border-grey-200 bg-white">
      <table className="hidden w-full min-w-full divide-y divide-grey-200 lg:table">
        <TableHead tableHeadItems={bookingAnalyticsTableHeadItems} />
        <tbody className="divide-y divide-grey-200 bg-white">
          {items?.map((item, index) => (
            <BookingDesktopRow key={index} items={item} />
          ))}
        </tbody>
      </table>
      <div className="divide-y divide-grey-200 lg:hidden">
        {items?.map((item, index) => (
          <div key={index} className="px-4 py-4">
            <BookingMobileRow items={item} />
          </div>
        ))}
      </div>
    </div>
  ) : (
    <EmptyState
      title={emptyStateTitle || "No Data Yet"}
      message={emptyStateMessage}
      image="/images/dashboard/bookings-empty-state.png"
      containerClassName="rounded-2xl bg-grey-75 py-12 sm:py-16 lg:py-20"
      imageSize="w-[120px] sm:w-[150px] lg:w-[182px]"
    />
  );
}
