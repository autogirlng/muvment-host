"use client";
import { useEffect, useMemo, useRef, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAppSelector } from "@/lib/hooks";
import { useHttp } from "@/hooks/useHttp";
import { BookingInformation } from "@/types";
import { handleFilterQuery } from "@/utils/functions";
import { bookingOverviewFilters } from "@/utils/data";

type BookingsDataType = {
  data: BookingInformation[];
  totalCount: number;
};

export default function useBookingsOverview({
  filters = {},
  month,
  year,
}: {
  filters?: Record<string, string[]>;
  month?: number;
  year?: string;
}) {
  const http = useHttp();
  const { user } = useAppSelector((state) => state.user);
  const isVehicleFilterAdded = useRef(false);

  const { data, isError, isLoading, isSuccess } = useQuery({
    queryKey: ["getBookingsOverview", user?.data.userId, filters, month, year],
    queryFn: async () =>
      http.get<BookingsDataType>(
        `/api/bookings/host/${user?.data.userId}?page=1&limit=10&${handleFilterQuery({ filters, month, year })}`
      ),
    enabled: !!user?.data.userId,
    retry: false,
  });

  const vehicleOptions = useMemo(() => {
    if (!data?.data) return [];

    const uniqueVehicles = new Map<string, string>();
    data.data.forEach(({ vehicle }) => {
      const { listingName, id: vehicleId } = vehicle;
      if (listingName && vehicleId && !uniqueVehicles.has(vehicleId)) {
        uniqueVehicles.set(vehicleId, listingName);
      }
    });

    return Array.from(uniqueVehicles, ([value, option]) => ({ option, value }));
  }, [data?.data]);

  const addVehicleFilter = useCallback(() => {
    if (
      isSuccess &&
      vehicleOptions.length > 0 &&
      !isVehicleFilterAdded.current
    ) {
      bookingOverviewFilters.push({
        title: "vehicle",
        options: vehicleOptions,
      });
      isVehicleFilterAdded.current = true;
    }
  }, [isSuccess, vehicleOptions]);

  useEffect(() => {
    addVehicleFilter();
  }, [addVehicleFilter]);

  return {
    bookings: data?.data || [],
    isError,
    isLoading,
    bookingOverviewFilters,
  };
}
