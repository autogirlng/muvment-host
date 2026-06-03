import { format } from "date-fns";
import type { HostEarningItem } from "@/types";
import { Popup, MoreButton } from "@/ui";
import { TableCell, TableRow } from "@/components/Table";
import { formatNgnAmount } from "@/utils/formatters";
import { tableCellBaseClass, tableCellValueClass, tableMobileTitleClass } from "@/components/Table/tableStyles";

export default function HostEarningRow({ item }: { item: HostEarningItem }) {
  const paidAt =
    item.paidAt &&
    !Number.isNaN(new Date(item.paidAt).getTime())
      ? `${format(new Date(item.paidAt), "MMM d, yyyy")} · ${format(new Date(item.paidAt), "hh:mma")}`
      : "-";

  const amountDisplay = `₦${formatNgnAmount(Number(item.amountPaid) || 0)}`;

  return (
    <TableRow>
      <TableCell
        title="Paid by"
        content={item.paidBy?.fullName ?? "-"}
        className="!font-semibold text-grey-900"
      />
      <TableCell title="Email" content={item.paidBy?.email ?? "-"} className="text-grey-900" />
      <TableCell title="Amount" content={amountDisplay} className="tabular-nums text-grey-900" />
      <TableCell title="Date paid" content={paidAt} className="text-grey-900" />
      <td className={tableCellBaseClass}>
        <span className={tableMobileTitleClass}>Actions</span>
        <div className={tableCellValueClass}>
          <Popup
            trigger={<MoreButton className="!mx-0 lg:mx-auto" />}
            content={
              <>
                <p className="!text-xs !font-semibold 3xl:!text-base">Actions</p>
                <ul className="space-y-2 *:py-2">
                  <li className="!text-xs text-grey-600 3xl:!text-base">
                    Receipt unavailable for this payout type
                  </li>
                </ul>
              </>
            }
          />
        </div>
      </td>
    </TableRow>
  );
}
