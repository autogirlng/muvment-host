import { useState } from "react";
import { format } from "date-fns";
import type { ReactNode } from "react";
import type { HostBookingDeduction, HostPendingBalanceBooking } from "@/types";
import { Popup, MoreButton } from "@/ui";
import { TableCell, TableRow } from "@/components/Table";
import {
  tableCellBaseClass,
  tableCellValueClass,
  tableMobileTitleClass,
} from "@/components/Table/tableStyles";
import { formatNgnAmount } from "@/utils/formatters";
import { downloadPayoutReceipt } from "@/utils/functions/downloadPayoutReceipt";
import PayoutDetailsModal, {
  canDownloadPayoutReceipt,
} from "@/components/Wallet/PayoutDetailsModal";

export default function PendingBalanceBookingRow({
  item,
  actions,
}: {
  item: HostPendingBalanceBooking;
  actions?: (deduction: HostBookingDeduction) => ReactNode;
}) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const dateDisplay =
    item.bookingDate && !Number.isNaN(new Date(item.bookingDate).getTime())
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

  const showReceiptDownload = canDownloadPayoutReceipt(item.hostPaymentStatus);

  const openPayoutDetails = () => {
    setMenuOpen(false);
    setDetailsOpen(true);
  };

  const handleDownloadReceipt = () => {
    setMenuOpen(false);
    downloadPayoutReceipt(item);
  };

  return (
    <>
      <TableRow>
        <TableCell
          title="Invoice"
          content={item.invoiceNumber ?? "-"}
          className="text-grey-900 !font-semibold"
        />
        <TableCell title="Vehicle" content={item.vehicleName ?? "-"} className="text-grey-900" />
        <TableCell title="Booking date" content={dateDisplay} className="text-grey-900" />
        <TableCell title="Deductions" content={deductionSummary} className="capitalize text-grey-900" />
        <TableCell
          title="Amount"
          content={`₦${formatNgnAmount(Number(item.toPayToHost) || 0)}`}
          className="text-grey-900 !font-semibold tabular-nums"
        />
        <TableCell title="Payment status" content={status} className="capitalize text-grey-900" />
        <td className={tableCellBaseClass}>
          <span className={tableMobileTitleClass}>Actions</span>
          <div className={tableCellValueClass}>
            <Popup
              align="end"
              open
              isOpen={menuOpen}
              handleIsOpen={setMenuOpen}
              className="!w-[min(240px,calc(100vw-2rem))] !p-2"
              trigger={<MoreButton className="!mx-0 ml-auto lg:mx-auto" />}
              content={
                <ul className="space-y-0.5">
                  <li>
                    <button
                      type="button"
                      onClick={openPayoutDetails}
                      className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2.5 text-left text-xs font-medium text-grey-800 transition-colors hover:bg-grey-50"
                    >
                      <svg width="15" height="15" viewBox="0 0 16 16" fill="none" className="shrink-0 text-primary-500">
                        <path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z" stroke="currentColor" strokeWidth="1.3" />
                        <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.3" />
                      </svg>
                      View Payout Details
                    </button>
                  </li>
                  {showReceiptDownload && (
                    <li>
                      <button
                        type="button"
                        onClick={handleDownloadReceipt}
                        className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2.5 text-left text-xs font-medium text-grey-800 transition-colors hover:bg-grey-50"
                      >
                        <svg width="15" height="15" viewBox="0 0 16 16" fill="none" className="shrink-0 text-primary-500">
                          <path d="M8 1v9m0 0L5 7m3 3l3-3M2 13h12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Download Payout Receipt
                      </button>
                    </li>
                  )}
                </ul>
              }
            />
          </div>
        </td>
      </TableRow>

      <PayoutDetailsModal
        item={item}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        actions={actions}
      />
    </>
  );
}
