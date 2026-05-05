import { format } from "date-fns";
import type { HostPendingBalanceBooking } from "@/types";
import { Icons, Popup } from "@/ui";
import TableCell from "@/components/Table/TableCell";
import { formatNgnAmount } from "@/utils/formatters";

export default function PendingBalanceBookingRow({
  item,
}: {
  item: HostPendingBalanceBooking;
}) {
  const dateDisplay =
    item.bookingDate &&
    !Number.isNaN(new Date(item.bookingDate).getTime())
      ? `${format(new Date(item.bookingDate), "MMM d, yyyy")} · ${format(new Date(item.bookingDate), "hh:mma")}`
      : "-";

  const status =
    typeof item.hostPaymentStatus === "string"
      ? item.hostPaymentStatus.replace(/_/g, " ").toLowerCase()
      : "-";

  return (
    <tr>
      <TableCell
        content={item.invoiceNumber ?? "-"}
        className="text-grey-900 !font-semibold"
      />
      <TableCell content={item.vehicleName ?? "-"} className="text-grey-900" />
      <TableCell content={dateDisplay} className="text-grey-900" />
      <TableCell
        content={`₦${formatNgnAmount(Number(item.basePrice) || 0)}`}
        className="text-grey-900 tabular-nums"
      />
      <TableCell
        content={`₦${formatNgnAmount(Number(item.toPayToHost) || 0)}`}
        className="text-grey-900 !font-semibold tabular-nums"
      />
      <TableCell content={status} className="capitalize text-grey-900" />
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
              <p className="!text-xs 3xl:!text-base !font-semibold">Booking</p>
              <ul className="space-y-2 *:py-2 text-xs text-grey-600">
                <li>ID: {item.bookingId}</li>
                {item.geofenceSurcharge != null && (
                  <li>Geofence surcharge: ₦{formatNgnAmount(item.geofenceSurcharge)}</li>
                )}
                {item.adminDeduction != null && item.adminDeduction !== 0 && (
                  <li>Admin deduction: ₦{formatNgnAmount(item.adminDeduction)}</li>
                )}
              </ul>
            </>
          }
        />
      </td>
    </tr>
  );
}
