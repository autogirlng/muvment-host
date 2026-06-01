import { format } from "date-fns";
import type { ReactNode } from "react";
import type { HostBookingDeduction, HostPendingBalanceBooking } from "@/types";
import { Icons, Popup } from "@/ui";
import TableCell from "@/components/Table/TableCell";
import { formatNgnAmount } from "@/utils/formatters";

export default function PendingBalanceBookingRow({
  item,
  actions,
}: {
  item: HostPendingBalanceBooking;
  actions?: (deduction: HostBookingDeduction) => ReactNode;
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
  const deductions = item.deductions ?? [];
  const deductionSummary =
    deductions.length > 0
      ? deductions
          .map(
            (deduction) =>
              `${deduction.type.replace(/_/g, " ").toLowerCase()}: ₦${formatNgnAmount(
                Number(deduction.amount) || 0
              )}`
          )
          .join(", ")
      : "None";

  return (
    <tr className="block lg:table-row bg-white border-2 border-grey-200 lg:border-none hover:border-grey-300 lg:hover:bg-grey-50 rounded-xl lg:rounded-none mb-4 lg:mb-0 p-4 lg:p-0 shadow-sm lg:shadow-none transition-all">
      <TableCell
        title="Invoice"
        content={item.invoiceNumber ?? "-"}
        className="text-grey-900 !font-semibold"
      />
      <TableCell title="Vehicle" content={item.vehicleName ?? "-"} className="text-grey-900" />
      <TableCell title="Booking date" content={dateDisplay} className="text-grey-900" />
      {/* <TableCell
        content={`₦${formatNgnAmount(Number(item.basePrice) || 0)}`}
        className="text-grey-900 tabular-nums"
      /> */}
      <TableCell title="Deductions" content={deductionSummary} className="capitalize text-grey-900" />
      <TableCell
        title="Pending payments"
        content={`₦${formatNgnAmount(Number(item.toPayToHost) || 0)}`}
        className="text-grey-900 !font-semibold tabular-nums"
      />
      <TableCell title="Payment status" content={status} className="capitalize text-grey-900" />
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
                <p className="!text-xs 3xl:!text-base !font-semibold">Booking</p>
                <ul className="space-y-2 *:py-2 text-xs text-grey-600">
                  <li>ID: {item.bookingId}</li>
                  {item.geofenceSurcharge != null && (
                    <li>Geofence surcharge: ₦{formatNgnAmount(item.geofenceSurcharge)}</li>
                  )}
                  {item.adminDeduction != null && item.adminDeduction !== 0 && (
                    <li>Admin deduction: ₦{formatNgnAmount(item.adminDeduction)}</li>
                  )}
                  <li>
                    <p className="font-semibold text-grey-700">Deductions</p>
                    {deductions.length > 0 ? (
                      <ul className="mt-2 space-y-2">
                        {deductions.map((deduction) => (
                          <li key={deduction.id} className="space-y-2">
                            <div>
                              {deduction.type.replace(/_/g, " ").toLowerCase()}: ₦
                              {formatNgnAmount(Number(deduction.amount) || 0)}
                            </div>
                            {actions?.(deduction)}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span>None</span>
                    )}
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
