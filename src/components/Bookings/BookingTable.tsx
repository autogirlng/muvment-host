import { bookingOverviewTableHeadItems } from "@/utils/data";
import { BookingSegmentContent } from "@/types";
import { Table, TableBody, TableHead } from "@/components/Table";
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
    <Table className="md:mt-7" stickyHeader>
      <TableHead tableHeadItems={bookingOverviewTableHeadItems} sticky />
      <TableBody>
        {items?.map((item, index) => (
          <BookingRow key={index} items={item} />
        ))}
      </TableBody>
    </Table>
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
