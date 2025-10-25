"use client";

import { useQuery } from "@tanstack/react-query";
import { useAppSelector } from "@/lib/hooks";
import { VehicleUpcomingBookingType } from "@/types";
import { useHttp } from "@/hooks/useHttp";


export default function useVehicleUpcomingBooking(id: string) {
  const http = useHttp();

  const { user } = useAppSelector((state) => state.user);

  const { data, isError, error, isLoading } = useQuery({
    queryKey: ["getUpcomingBookings", user?.data.userId],

    queryFn: () =>
      http.get<VehicleUpcomingBookingType>(
        `/api/bookings/upcoming/${id}?page=1&limit=10`
      ),
    enabled: !!user?.data.userId && !!id,
    retry: false,
  });

  return {
    upcomingBookings: data?.data ?? [],
    isError,
    error,
    isLoading,
  };
}
