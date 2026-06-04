"use client";

import { useState } from "react";
import cn from "classnames";
import DashboardSectionTitle from "@/components/DashBoard/SectionTitle";
import EmptyState from "@/components/EmptyState";
import useVehicleUpcomingBooking from "@/hooks/listings/useVehicleBooking";
import { Spinner, Icons } from "@/ui";
import { formatNgnAmount } from "@/utils/formatters";
import { VehicleBookingsContent } from "@/types";
import { ListingDetailsUpcomingBookingsProps } from "./props";
import { format } from "date-fns";
import BookingReviewModal from "@/components/Listings/BookingReviewModal";

interface Props extends ListingDetailsUpcomingBookingsProps {
  /** When true renders inline (for mobile). Default: sidebar for desktop. */
  mobile?: boolean;
}

export default function ListingDetailsUpcomingBookings({ vehicleId, mobile = false }: Props) {
  const { vehicleBookings, isError, isLoading } = useVehicleUpcomingBooking(vehicleId);

  const inner = (
    <div className="space-y-3">
      <DashboardSectionTitle icon={Icons.ic_ticket} title="Bookings" />
      {isLoading ? (
        <div className="flex justify-center py-6"><Spinner /></div>
      ) : isError ? (
        <p className="text-sm text-error-500 bg-error-50 rounded-xl px-4 py-3">
          Could not load bookings.
        </p>
      ) : vehicleBookings?.length > 0 ? (
        <div className="space-y-2">
          {vehicleBookings.map((booking, index) => (
            <BookingCard key={booking.segmentId ?? index} booking={booking} isFirst={index === 0} />
          ))}
        </div>
      ) : (
        <EmptyState
          image="/icons/empty_booking_state.png"
          title="No upcoming bookings"
          imageSize="w-[90px] 2xl:w-[165px]"
        />
      )}
    </div>
  );

  if (mobile) {
    return (
      <div className="rounded-2xl border border-grey-200 bg-white p-5">
        {inner}
      </div>
    );
  }

  return (
    <div className="w-full bg-grey-50 px-4 py-[86px]">
      {inner}
    </div>
  );
}

/* ─── Booking card with expandable details ─── */
function BookingCard({ booking, isFirst }: { booking: VehicleBookingsContent; isFirst: boolean }) {
  const [expanded, setExpanded] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);

  const typeName = booking.bookingTypeName ?? booking.bookingType ?? "—";
  const statusColor =
    booking.bookingStatus === "CONFIRMED"
      ? "text-success-600 bg-success-50"
      : booking.bookingStatus === "CANCELLED_BY_ADMIN" ||
        booking.bookingStatus === "CANCELLED_BY_USER" ||
        (booking.bookingStatus as string) === "CANCELLED"
      ? "text-error-500 bg-error-50"
      : "text-warning-700 bg-warning-75";

  let formattedDate = "—";
  try {
    formattedDate = format(new Date(booking.createdAt), "dd MMM yyyy");
  } catch {}

  return (
    <div
      className={cn(
        "rounded-2xl bg-white border transition-all",
        isFirst ? "border-primary-500" : "border-grey-200"
      )}
    >
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left"
      >
        <div className="flex flex-col gap-0.5 min-w-0">
          {isFirst && (
            <span className="text-xs font-semibold text-primary-500 uppercase tracking-wide">Up Next</span>
          )}
          <span className="text-sm font-bold text-grey-800 truncate">
            {booking.invoiceNumber}
          </span>
          <span className="text-xs text-grey-500">{booking.customerName}</span>
          <span className="text-[11px] text-grey-400 mt-0.5">{formattedDate}</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className={cn("rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase", statusColor)}>
            {booking.bookingStatus?.replace(/_/g, " ")}
          </span>
          <svg
            width="14" height="14" viewBox="0 0 14 14" fill="none"
            className={cn("text-grey-400 transition-transform", expanded && "rotate-180")}
          >
            <path d="M2 5l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </button>

      {expanded && (
        <div className="border-t border-grey-100 px-4 pb-4 pt-3 space-y-2">
          {[
            { label: "Booking Type",  value: typeName },
            { label: "Duration",      value: booking.duration },
            { label: "City",          value: booking.city },
            { label: "Price",         value: `₦ ${formatNgnAmount(booking.price)}` },
            { label: "Booked",        value: formattedDate },
            booking.bookingCategory
              ? { label: "Category", value: booking.bookingCategory }
              : null,
          ]
            .filter(Boolean)
            .map((row) => (
              <div key={row!.label} className="flex items-center justify-between gap-3">
                <span className="text-xs text-grey-400">{row!.label}</span>
                <span className="text-xs font-semibold text-grey-700 text-right">{row!.value}</span>
              </div>
            ))}

          {/* View Review action */}
          <button
            type="button"
            onClick={() => setReviewOpen(true)}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg border border-primary-100 bg-primary-50 px-3 py-2 text-xs font-semibold text-primary-600 transition-colors hover:bg-primary-75"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
              <path d="M12 2l2.9 6.3 6.9.6-5.2 4.6 1.6 6.8L12 17.3 5.8 20.3l1.6-6.8L2.2 8.9l6.9-.6L12 2z"
                stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
            </svg>
            View Review
          </button>
        </div>
      )}

      <BookingReviewModal
        bookingId={booking.bookingId}
        customerName={booking.customerName}
        open={reviewOpen}
        onOpenChange={setReviewOpen}
      />
    </div>
  );
}
