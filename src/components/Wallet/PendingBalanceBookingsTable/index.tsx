import { hostPendingBalanceTableHeadItems } from "@/utils/data";
import type { ReactNode } from "react";
import type { HostBookingDeduction, HostPendingBalanceBooking } from "@/types";
import { Table, TableBody, TableHead } from "@/components/Table";
import EmptyState from "@/components/EmptyState";
import PendingBalanceBookingRow from "@/components/Wallet/PendingBalanceBookingsTable/PendingBalanceBookingRow";

type Props = {
  items: HostPendingBalanceBooking[];
  actions?: (deduction: HostBookingDeduction) => ReactNode;
};

export default function PendingBalanceBookingsTable({ items, actions }: Props) {
  return items.length > 0 ? (
    <Table className="md:mt-7">
      <TableHead tableHeadItems={hostPendingBalanceTableHeadItems} />
      <TableBody>
        {items.map((item) => (
          <PendingBalanceBookingRow
            key={item.bookingId}
            item={item}
            actions={actions}
          />
        ))}
      </TableBody>
    </Table>
  ) : (
    <EmptyState
      title="No bookings"
      message="No payout bookings in this view yet"
      image="/icons/empty_trnx_state.png"
    />
  );
}
