"use client";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAppSelector } from "@/lib/hooks";
import { useHttp } from "@/hooks/useHttp";
import { BookingSegments } from "@/types";
import { getBookingOverviewBaseFilters } from "@/utils/data";

export default function useBookingsOverview({
  filters = {},
}: {
  filters?: Record<string, string[]>;
}) {
  const http = useHttp();
  const { user } = useAppSelector((state) => state.user);

  const { data, isError, isLoading } = useQuery({
    queryKey: ["getBookingsOverview", user?.data.userId, filters],
    queryFn: async () =>
      http.get<BookingSegments>(
        `/v1/bookings/my-vehicles/segments`
      ),
    enabled: !!user?.data.userId,
    retry: false,
  });

  const vehicleOptions = useMemo(() => {
    const segments = data?.data?.content ?? [];
    const uniqueVehicles = new Map<string, string>();
    segments.forEach(({ vehicleName, vehicleId }) => {
      if (vehicleName && vehicleId && !uniqueVehicles.has(vehicleId)) {
        uniqueVehicles.set(vehicleId, vehicleName);
      }
    });
    return Array.from(uniqueVehicles, ([value, option]) => ({ option, value }));
  }, [data?.data?.content]);

  const bookingOverviewFilters = useMemo(() => {
    const filtersList = getBookingOverviewBaseFilters();
    if (vehicleOptions.length > 0) {
      filtersList.push({ title: "vehicle", options: vehicleOptions });
    }
    return filtersList;
  }, [vehicleOptions]);

  return {
    bookings: data?.data,
    isError,
    isLoading,
    bookingOverviewFilters,
  };
}
