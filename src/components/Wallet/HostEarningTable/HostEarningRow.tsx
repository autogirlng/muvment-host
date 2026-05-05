import { format } from "date-fns";
import type { HostEarningItem } from "@/types";
import { Icons, Popup } from "@/ui";
import TableCell from "@/components/Table/TableCell";
import { formatNgnAmount } from "@/utils/formatters";

export default function HostEarningRow({ item }: { item: HostEarningItem }) {
  const paidAt =
    item.paidAt &&
    !Number.isNaN(new Date(item.paidAt).getTime())
      ? `${format(new Date(item.paidAt), "MMM d, yyyy")} · ${format(new Date(item.paidAt), "hh:mma")}`
      : "-";

  const amountDisplay = `₦${formatNgnAmount(Number(item.amountPaid) || 0)}`;

  return (
    <tr>
      <TableCell
        content={item.paidBy?.fullName ?? "-"}
        className="text-grey-900 !font-semibold"
      />
      <TableCell content={item.paidBy?.email ?? "-"} className="text-grey-900" />
      <TableCell content={amountDisplay} className="text-grey-900 tabular-nums" />
      <TableCell content={paidAt} className="text-grey-900" />
      <td>
        <Popup
          trigger={
            <button
              type="button"
              className="block border border-grey-200 bg-white text-black rounded-lg p-2 w-fit mx-auto"
            >
              {Icons.ic_more}
            </button>
          }
          content={
            <>
              <p className="!text-xs 3xl:!text-base !font-semibold">Actions</p>
              <ul className="space-y-2 *:py-2">
                <li className="!text-xs 3xl:!text-base text-grey-600">
                  Receipt unavailable for this payout type
                </li>
              </ul>
            </>
          }
        />
      </td>
    </tr>
  );
}
