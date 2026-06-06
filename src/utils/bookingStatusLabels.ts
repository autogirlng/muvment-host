/** Host-facing booking status labels (display only — API values unchanged). */
const BOOKING_STATUS_LABELS: Record<string, string> = {
  CONFIRMED: "Confirm payment",
  PENDING_PAYMENT: "Pending booking",
  COMPLETED: "Successful booking",
  CANCELLED_BY_ADMIN: "Cancelled payment",
  CANCELLED_BY_USER: "Cancelled payment",
  CANCELLED_BY_HOST: "Cancelled payment",
  ABANDONED: "Abandoned",
  IN_PROGRESS: "In progress",
  FAILED_AVAILABILITY: "Failed availability",
  NO_SHOW: "No show",
  APPROVED: "Confirm payment",
  ACCEPTED: "Confirm payment",
};

export function getBookingStatusLabel(status?: string | null): string {
  if (!status?.trim()) return "—";
  const key = status.trim().toUpperCase();
  if (BOOKING_STATUS_LABELS[key]) return BOOKING_STATUS_LABELS[key];
  return key
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}
