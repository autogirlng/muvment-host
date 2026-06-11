"use client";

import { useQuery } from "@tanstack/react-query";
import { useHttp } from "@/hooks/useHttp";
import { useAppSelector } from "@/lib/hooks";
import type { SingleBookingInformation } from "@/types";

/**
 * The pending-balance / earning-history payout row (`HostPayoutRowDto`) does not
 * include a trip completion date, so we derive it from the booking's segments.
 * Trip completion is the latest segment `endDateTime` for the booking.
 *
 * Returns the completion date (ISO string) for a single booking, or undefined
 * when unknown / still loading.
 */
export default function useTripCompletionDate(bookingId?: string, enabled = true) {
  const http = useHttp();
  const { user } = useAppSelector((state) => state.user);

  const { data, isLoading } = useQuery({
    queryKey: ["bookingTripCompletion", bookingId],
    queryFn: () =>
      http.getSilent<SingleBookingInformation>(`/bookings/${bookingId}`),
    enabled: !!user?.data.userId && !!bookingId && enabled,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  const segments = data?.data?.segments ?? [];
  const completionDate = segments.reduce<string | null>((latest, segment) => {
    const end = segment?.endDateTime;
    if (!end || Number.isNaN(new Date(end).getTime())) return latest;
    if (!latest || new Date(end).getTime() > new Date(latest).getTime()) {
      return end;
    }
    return latest;
  }, null);

  return {
    completionDate: completionDate ?? undefined,
    isLoading,
  };
}
