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
    <tr className="block lg:table-row bg-white border-2 border-grey-200 lg:border-none hover:border-grey-300 lg:hover:bg-grey-50 rounded-xl lg:rounded-none mb-4 lg:mb-0 p-4 lg:p-0 shadow-sm lg:shadow-none transition-all">
      <TableCell
        title="Paid by"
        content={item.paidBy?.fullName ?? "-"}
        className="text-grey-900 !font-semibold"
      />
      <TableCell title="Email" content={item.paidBy?.email ?? "-"} className="text-grey-900" />
      <TableCell title="Amount" content={amountDisplay} className="text-grey-900 tabular-nums" />
      <TableCell title="Date paid" content={paidAt} className="text-grey-900" />
      <td className="px-4 py-3 lg:px-6 lg:py-[26px] block lg:table-cell w-full lg:w-fit text-sm text-grey-700">
        <div className="flex items-center justify-between gap-5 lg:block">
          <span className="font-semibold text-grey-500 lg:hidden w-1/2 break-words text-left">
            Actions
          </span>
          <Popup
            trigger={
              <button
                type="button"
                className="block border border-grey-200 bg-white text-black rounded-lg p-2 w-fit ml-auto lg:mx-auto"
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
        </div>
      </td>
    </tr>
  );
}
