import { hostPendingBalanceTableHeadItems } from "@/utils/data";
import type { HostPendingBalanceBooking } from "@/types";
import TableHead from "@/components/Table/TableHead";
import EmptyState from "@/components/EmptyState";
import PendingBalanceBookingRow from "@/components/Wallet/PendingBalanceBookingsTable/PendingBalanceBookingRow";

type Props = { items: HostPendingBalanceBooking[] };

export default function PendingBalanceBookingsTable({ items }: Props) {
  return items.length > 0 ? (
    <div className="overflow-auto bg-grey-50 lg:bg-white rounded-xl lg:rounded-none p-4 lg:p-0">
      <table className="block lg:table w-full min-w-full lg:divide-y divide-grey-200 lg:border-t border-grey-200 bg-white md:mt-7">
        <TableHead tableHeadItems={hostPendingBalanceTableHeadItems} />
        <tbody className="block lg:table-row-group lg:divide-y divide-grey-200">
          {items.map((item) => (
            <PendingBalanceBookingRow
              key={item.bookingId}
              item={item}
            />
          ))}
        </tbody>
      </table>
    </div>
  ) : (
    <EmptyState
      title="No bookings"
      message="No payout bookings in this view yet"
      image="/icons/empty_trnx_state.png"
    />
  );
}
