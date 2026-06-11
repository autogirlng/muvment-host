"use client";

import { useQuery } from "@tanstack/react-query";
import { useAppSelector } from "@/lib/hooks";
import { BookingStatus, VehicleBookings } from "@/types";
import { useHttp } from "@/hooks/useHttp";

/**
 * Booking statuses that mean a trip is still open (not yet fulfilled). A vehicle
 * with any booking in one of these states must not be deleted — the booking has
 * to be fulfilled (completed) or cancelled first.
 */
const ACTIVE_BOOKING_STATUSES: BookingStatus[] = [
  BookingStatus.PENDING_PAYMENT,
  BookingStatus.CONFIRMED,
  BookingStatus.IN_PROGRESS,
];

/**
 * Checks whether a vehicle has any active (unfulfilled) booking. Used to block
 * deletion until outstanding bookings are completed or cancelled.
 */
export default function useVehicleHasActiveBooking(
  vehicleId?: string,
  enabled = true
) {
  const http = useHttp();
  const { user } = useAppSelector((state) => state.user);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["vehicleActiveBookings", vehicleId],
    queryFn: () =>
      http.get<VehicleBookings>(`/bookings/${vehicleId}/bookings?page=0&size=100`),
    enabled: !!user?.data.userId && !!vehicleId && enabled,
    retry: false,
  });

  const bookings = data?.data.content ?? [];
  const hasActiveBooking = bookings.some((booking) =>
    ACTIVE_BOOKING_STATUSES.includes(booking.bookingStatus)
  );

  return {
    hasActiveBooking,
    isCheckingBookings: isLoading,
    isError,
  };
}
