import { format } from "date-fns";
import type { HostPendingBalanceBooking } from "@/types";
import { formatNgnAmount } from "@/utils/formatters";

/**
 * Generates a printable payout receipt from the booking row data and opens the
 * browser print dialog (lets the user save as PDF).
 *
 * NOTE: When the dedicated backend endpoint for payout receipts ships, swap this
 * for a server-generated PDF download.
 */
export function downloadPayoutReceipt(item: HostPendingBalanceBooking) {
  if (typeof window === "undefined") return;

  let bookingDate = "-";
  try {
    if (item.bookingDate && !Number.isNaN(new Date(item.bookingDate).getTime())) {
      bookingDate = format(new Date(item.bookingDate), "MMM d, yyyy 'at' hh:mma");
    }
  } catch {}

  const status = (item.hostPaymentStatus ?? "-").replace(/_/g, " ");
  const amount = `NGN ${formatNgnAmount(Number(item.toPayToHost) || 0)}`;
  const generatedAt = format(new Date(), "MMM d, yyyy 'at' hh:mma");

  const rows: [string, string][] = [
    ["Invoice Number", item.invoiceNumber || "-"],
    ["Vehicle", item.vehicleName || "-"],
    ["Booking Date", bookingDate],
    ["Amount", amount],
    ["Payout Status", status],
  ];

  const html = `
    <html>
      <head>
        <title>Payout Receipt - ${item.invoiceNumber ?? ""}</title>
        <meta charset="utf-8" />
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { font-family: -apple-system, Segoe UI, Roboto, sans-serif; color: #1D2739; padding: 48px; }
          .wrap { max-width: 520px; margin: 0 auto; }
          .brand { font-size: 24px; font-weight: 800; color: #0673FF; letter-spacing: -0.5px; }
          .sub { color: #667185; font-size: 13px; margin-top: 4px; }
          .card { border: 1px solid #E4E7EC; border-radius: 16px; padding: 24px; margin-top: 28px; }
          .title { font-size: 13px; text-transform: uppercase; letter-spacing: 1.5px; color: #98A2B3; font-weight: 700; margin-bottom: 16px; }
          .row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #F0F2F5; font-size: 14px; }
          .row:last-child { border-bottom: 0; }
          .label { color: #667185; }
          .value { font-weight: 600; text-align: right; }
          .footer { margin-top: 24px; font-size: 11px; color: #98A2B3; text-align: center; }
        </style>
      </head>
      <body>
        <div class="wrap">
          <div class="brand">muvment</div>
          <div class="sub">Payout Receipt</div>
          <div class="card">
            <div class="title">Payout Summary</div>
            ${rows
              .map(
                ([label, value]) =>
                  `<div class="row"><span class="label">${label}</span><span class="value">${value}</span></div>`
              )
              .join("")}
          </div>
          <div class="footer">Generated on ${generatedAt}</div>
        </div>
        <script>
          window.onload = function () { window.print(); };
        </script>
      </body>
    </html>
  `;

  const printWindow = window.open("", "_blank", "width=640,height=720");
  if (!printWindow) return;
  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}
