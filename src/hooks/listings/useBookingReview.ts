"use client";

import { useQuery } from "@tanstack/react-query";
import { useAppSelector } from "@/lib/hooks";
import { useHttp } from "@/hooks/useHttp";
import { BaseResponse } from "@/types";

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

type BookingRatingReviewResponse = BaseResponse & {
  data?: BookingRatingReview;
};

function unwrapBookingReview(
  response: BookingRatingReview | BookingRatingReviewResponse | null
): BookingRatingReview | null {
  if (!response) return null;
  if (typeof (response as BookingRatingReview).rating === "number") {
    return response as BookingRatingReview;
  }
  return (response as BookingRatingReviewResponse).data ?? null;
}

/**
 * GET /v1/rating-review/booking/{bookingId} (public)
 * Returns the rating/review left for a specific booking.
 */
export default function useBookingReview(bookingId: string | null) {
  const http = useHttp();
  const { user } = useAppSelector((state) => state.user);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["bookingReview", user?.data?.userId, bookingId],
    queryFn: async () => {
      const response = await http.getSilent<
        BookingRatingReview | BookingRatingReviewResponse
      >(`/rating-review/booking/${bookingId}`);
      return unwrapBookingReview(response);
    },
    enabled: !!bookingId,
    retry: false,
  });

  return {
    review: data ?? null,
    isLoading: isLoading || isFetching,
  };
}
