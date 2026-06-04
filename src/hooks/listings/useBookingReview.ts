"use client";

import { useQuery } from "@tanstack/react-query";
import { useAppSelector } from "@/lib/hooks";
import { useHttp } from "@/hooks/useHttp";

export interface BookingRatingReview {
  id: string;
  rating: number;
  review: string;
  recommend: string;
  isAnonymous: boolean;
  anonymousFullName?: string;
  anonymousEmail?: string;
  source?: string;
  status?: string;
  createdAt?: string;
  moderatedAt?: string;
}

/**
 * GET /v1/rating-review/booking/{bookingId} (public)
 * Returns the rating/review left for a specific booking.
 */
export default function useBookingReview(bookingId: string | null) {
  const http = useHttp();
  const { user } = useAppSelector((state) => state.user);

  const { data, isError, isLoading, isFetching } = useQuery({
    queryKey: ["bookingReview", user?.data?.userId, bookingId],
    queryFn: () =>
      http.get<BookingRatingReview>(`/rating-review/booking/${bookingId}`),
    enabled: !!bookingId,
    retry: false,
  });

  return {
    review: data ?? null,
    isError,
    isLoading: isLoading || isFetching,
  };
}
