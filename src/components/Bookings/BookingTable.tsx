import { bookingOverviewTableHeadItems } from "@/utils/data";
import { BookingInformation, BookingSegmentContent } from "@/types";
import TableHead from "@/components/Table/TableHead"
import EmptyState from "@/components/EmptyState";
import BookingRow from "@/components/Bookings/BookingRow";

export default function BookingTable({
  items,
  emptyStateMessage,
}: {
  items: BookingSegmentContent[];
  emptyStateMessage: string;
}) {
  return items.length > 0 ? (
    <div className="overflow-auto bg-grey-50 lg:bg-white rounded-xl lg:rounded-none p-4 lg:p-0">
      <table className="block lg:table w-full min-w-full lg:divide-y divide-grey-200 lg:border-t border-grey-200 md:mt-7">
        <TableHead tableHeadItems={bookingOverviewTableHeadItems} />
        <tbody className="block lg:table-row-group lg:divide-y divide-grey-200 ">
          {items?.map((item, index) => <BookingRow key={index} items={item} />)}
        </tbody>
      </table>
    </div>
  ) : (
    <EmptyState
      title="No Data Yet"
      message={emptyStateMessage}
      image="/images/dashboard/bookings-empty-state.png"
      containerClassName="rounded-2xl bg-grey-75 py-12 sm:py-16 lg:py-20"
      imageSize="w-[120px] sm:w-[150px] lg:w-[182px]"
    />
  );
}
