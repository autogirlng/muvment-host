type BookingReference = {
  invoiceNumber?: string | null;
  bookingId?: string | null;
  id?: string | null;
};

/** Prefer invoice number for host-facing display; fall back only when missing. */
export function getBookingDisplayId(booking?: BookingReference | null): string {
  if (!booking) return "—";
  const invoice = booking.invoiceNumber?.trim();
  if (invoice) return invoice;
  return "—";
}

/** Internal route id — still uses bookingId/uuid, never shown as primary label. */
export function getBookingRouteId(booking?: BookingReference | null): string {
  return booking?.bookingId?.trim() || booking?.id?.trim() || "";
}

export function getTripAgentDisplayName(trip: {
  customerAgent?: { name?: string };
  opsAgent?: { name?: string };
}): string {
  return (
    trip.customerAgent?.name?.trim() ||
    trip.opsAgent?.name?.trim() ||
    "—"
  );
}
