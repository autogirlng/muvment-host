"use client";

import { useQuery } from "@tanstack/react-query";
import { useAppSelector } from "@/lib/hooks";
import { BookingStatistics } from "@/types";
import { useHttp } from "@/hooks/useHttp";

export default function useBookingStats() {
  const http = useHttp();
  const { user } = useAppSelector((state) => state.user);

  const { data, isError, error, isLoading, isSuccess } = useQuery({
    queryKey: ["getBookingStats", user?.data.userId],
    queryFn: async () =>
      http.get<BookingStatistics>("/api/statistics/hostBookings"),
    enabled: !!user?.data.userId,
    retry: false,
  });

  return {
    isError,
    error,
    isLoading,
    isSuccess,

    bookingStats: data,
  };
}
