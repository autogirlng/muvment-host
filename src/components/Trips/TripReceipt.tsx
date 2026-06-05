import { format } from "date-fns";
import { HostTripItem } from "@/types";
import { getBookingDisplayId } from "@/utils/displayIds";

interface TripReceiptProps {
    trip: HostTripItem;
}

function formatDate(dt: string) {
    try {
        return format(new Date(dt), "MMM dd, yyyy HH:mm");
    } catch {
        return "N/A";
    }
}

export function printTripReceipt(trip: HostTripItem) {
    const win = window.open("", "_blank", "width=700,height=900");
    if (!win) return;

    win.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Trip Receipt - ${getBookingDisplayId(trip)}</title>
            <style>
                * { box-sizing: border-box; margin: 0; padding: 0; }
                body { font-family: Arial, sans-serif; padding: 48px; color: #1a1a1a; max-width: 600px; margin: 0 auto; }
                .brand { font-size: 22px; font-weight: 800; letter-spacing: -0.5px; }
                .receipt-title { font-size: 13px; color: #666; margin-top: 4px; text-transform: uppercase; letter-spacing: 1px; }
                .divider { border: none; border-top: 1px solid #e5e7eb; margin: 24px 0; }
                .section-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #999; margin-bottom: 12px; }
                .row { display: flex; justify-content: space-between; align-items: flex-start; padding: 6px 0; }
                .row .label { font-size: 13px; color: #666; }
                .row .value { font-size: 13px; font-weight: 600; text-align: right; max-width: 60%; }
                .total-row { display: flex; justify-content: space-between; padding: 10px 0; }
                .total-label { font-size: 16px; font-weight: 700; }
                .total-value { font-size: 18px; font-weight: 800; color: #111; }
                .badge { display: inline-block; padding: 2px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; background: #f3f4f6; color: #374151; }
                .footer { text-align: center; font-size: 11px; color: #aaa; margin-top: 40px; }
                @media print { body { padding: 24px; } }
            </style>
        </head>
        <body>
            <div class="brand">Muvment</div>
            <div class="receipt-title">Trip Receipt</div>

            <hr class="divider" />

            <div class="section-label">Booking Info</div>
            <div class="row"><span class="label">Invoice</span><span class="value">${getBookingDisplayId(trip)}</span></div>
            <div class="row"><span class="label">Vehicle</span><span class="value">${trip.vehicleName || trip.vehicleIdentifier || "—"}</span></div>
            <div class="row"><span class="label">Customer</span><span class="value">${trip.driverName || "—"}</span></div>
            <div class="row"><span class="label">Phone</span><span class="value">${trip.driverPhoneNumber || "—"}</span></div>
            <div class="row"><span class="label">Booking Type</span><span class="value">${trip.bookingTypeName || "—"}</span></div>
            <div class="row"><span class="label">Purpose</span><span class="value">${trip.bookingCategory || "—"}</span></div>

            <hr class="divider" />

            <div class="section-label">Trip Details</div>
            <div class="row"><span class="label">Start Date</span><span class="value">${trip.startDateTime ? formatDate(trip.startDateTime) : "N/A"}</span></div>
            <div class="row"><span class="label">End Date</span><span class="value">${trip.endDateTime ? formatDate(trip.endDateTime) : "N/A"}</span></div>
            <div class="row"><span class="label">Pickup Location</span><span class="value">${trip.pickupLocation || trip.city || "—"}</span></div>
            <div class="row"><span class="label">Duration</span><span class="value">${trip.bookedHours ? trip.bookedHours + " hrs" : "—"}</span></div>
            <div class="row"><span class="label">Trip Status</span><span class="value"><span class="badge">${trip.tripStatus || "—"}</span></span></div>
            <div class="row"><span class="label">Booking Status</span><span class="value"><span class="badge">${trip.bookingStatus || "—"}</span></span></div>

            <hr class="divider" />

            <div class="total-row">
                <span class="total-label">Total</span>
                <span class="total-value">NGN ${(trip.totalPrice ?? 0).toLocaleString()}</span>
            </div>

            <hr class="divider" />

            <div class="footer">
                Printed on ${format(new Date(), "MMM dd, yyyy HH:mm")} &nbsp;·&nbsp; Muvment Host Platform
            </div>

            <script>window.onload = function() { window.print(); }</script>
        </body>
        </html>
    `);
    win.document.close();
}

export default function TripReceipt({ trip }: TripReceiptProps) {
    return (
        <div className="space-y-5 text-sm text-grey-700">
            <div className="space-y-1">
                <p className="text-xs font-bold uppercase tracking-widest text-grey-400">Booking Info</p>
                <div className="divide-y divide-grey-100">
                    <Row label="Invoice" value={getBookingDisplayId(trip)} />
                    <Row label="Vehicle" value={trip.vehicleName || trip.vehicleIdentifier} />
                    <Row label="Customer" value={trip.driverName} />
                    <Row label="Phone" value={trip.driverPhoneNumber} />
                    <Row label="Booking Type" value={trip.bookingTypeName} />
                    <Row label="Purpose" value={trip.bookingCategory} />
                </div>
            </div>

            <div className="space-y-1">
                <p className="text-xs font-bold uppercase tracking-widest text-grey-400">Trip Details</p>
                <div className="divide-y divide-grey-100">
                    <Row label="Start Date" value={trip.startDateTime ? formatDate(trip.startDateTime) : "N/A"} />
                    <Row label="End Date" value={trip.endDateTime ? formatDate(trip.endDateTime) : "N/A"} />
                    <Row label="Pickup" value={trip.pickupLocation || trip.city} />
                    <Row label="Duration" value={trip.bookedHours ? `${trip.bookedHours} hrs` : "—"} />
                    <Row label="Trip Status" value={trip.tripStatus} />
                    <Row label="Booking Status" value={trip.bookingStatus} />
                </div>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-grey-200">
                <span className="font-bold text-base text-grey-900">Total</span>
                <span className="font-bold text-lg text-grey-900">
                    NGN {(trip.totalPrice ?? 0).toLocaleString()}
                </span>
            </div>

            <button
                onClick={() => printTripReceipt(trip)}
                className="w-full py-3 rounded-xl bg-primary-500 text-white font-semibold text-sm hover:bg-primary-600 transition-colors"
            >
                Print Receipt
            </button>
        </div>
    );
}

function Row({ label, value }: { label: string; value?: string | number | null }) {
    return (
        <div className="flex justify-between items-center py-2">
            <span className="text-grey-500 text-xs">{label}</span>
            <span className="font-medium text-grey-800 text-xs text-right max-w-[55%]">{value || "—"}</span>
        </div>
    );
}
