"use client";

import { format } from "date-fns";
import type { ReactNode } from "react";
import type { HostBookingDeduction, HostPendingBalanceBooking } from "@/types";
import { BlurredDialog } from "@/ui/dialog";
import { PaymentBadge } from "@/ui";
import { formatNgnAmount } from "@/utils/formatters";

function paymentBadgeStatus(raw: string): "successful" | "paid" | "pending" | "failed" | "cancelled" {
  const s = (raw ?? "").toLowerCase();
  if (s.includes("paid")) return "paid";
  if (s.includes("success")) return "successful";
  if (s.includes("fail")) return "failed";
  if (s.includes("cancel")) return "cancelled";
  return "pending";
}

function DetailRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-grey-100 py-3 last:border-0">
      <span className="text-sm text-grey-500">{label}</span>
      <span className="text-sm font-semibold text-grey-800 text-right">{value}</span>
    </div>
  );
}

export default function PayoutDetailsModal({
  item,
  open,
  onOpenChange,
  actions,
}: {
  item: HostPendingBalanceBooking;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  actions?: (deduction: HostBookingDeduction) => ReactNode;
}) {
  const isPaid = paymentBadgeStatus(item.hostPaymentStatus) === "paid"
    || paymentBadgeStatus(item.hostPaymentStatus) === "successful";

  let bookingDate = "-";
  try {
    if (item.bookingDate && !Number.isNaN(new Date(item.bookingDate).getTime())) {
      bookingDate = format(new Date(item.bookingDate), "MMM d, yyyy · hh:mma");
    }
  } catch {}

  const deductions = item.deductions ?? [];

  return (
    <BlurredDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Payout Details"
      description="Breakdown of this booking payout"
      width="max-w-[480px]"
      content={
        <div className="space-y-5">
          <div className="rounded-2xl border border-grey-200 bg-white p-5">
            <DetailRow label="Invoice Number" value={item.invoiceNumber || "-"} />
            <DetailRow label="Vehicle" value={item.vehicleName || "-"} />
            <DetailRow label="Booking Date" value={bookingDate} />
            <DetailRow
              label={isPaid ? "Amount Paid" : "Amount To Be Paid"}
              value={`₦ ${formatNgnAmount(Number(item.toPayToHost) || 0)}`}
            />
            <DetailRow
              label="Payout Status"
              value={<PaymentBadge status={paymentBadgeStatus(item.hostPaymentStatus)} />}
            />
          </div>

          {/* Deductions (if any) — keep dispute action available */}
          {deductions.length > 0 && (
            <div className="rounded-2xl border border-grey-200 bg-white p-5 space-y-3">
              <p className="text-xs font-bold uppercase tracking-widest text-grey-400">
                Deductions
              </p>
              <ul className="space-y-3">
                {deductions.map((deduction) => (
                  <li key={deduction.id} className="space-y-2">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm capitalize text-grey-600">
                        {deduction.type.replace(/_/g, " ").toLowerCase()}
                      </span>
                      <span className="text-sm font-semibold text-error-800">
                        − ₦{formatNgnAmount(Number(deduction.amount) || 0)}
                      </span>
                    </div>
                    {actions?.(deduction)}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      }
    />
  );
}

export { paymentBadgeStatus };
