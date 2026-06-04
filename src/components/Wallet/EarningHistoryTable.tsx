import type { ReactNode } from "react";
import EmptyState from "@/components/EmptyState";
import PendingBalanceBookingRow from "@/components/Wallet/PendingBalanceBookingsTable/PendingBalanceBookingRow";
import { Table, TableBody, TableHead } from "@/components/Table";
import type { HostBookingDeduction, HostPendingBalanceBooking } from "@/types";
import { hostPendingBalanceTableHeadItems } from "@/utils/data";

type Props = {
  items: HostPendingBalanceBooking[];
  actions?: (deduction: HostBookingDeduction) => ReactNode;
};

export default function EarningHistoryTable({ items, actions }: Props) {
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
      title="No earnings"
      message="No earning history in this view yet"
      image="/icons/empty_trnx_state.png"
    />
  );
}
