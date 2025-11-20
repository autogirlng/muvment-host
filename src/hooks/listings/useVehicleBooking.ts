"use client";

import { useQuery } from "@tanstack/react-query";
import { useAppSelector } from "@/lib/hooks";
import { VehicleBookings} from "@/types";
import { useHttp } from "@/hooks/useHttp";


export default function useVehicleBookings(id: string) {
  const http = useHttp();

  const { user } = useAppSelector((state) => state.user);

  const { data, isError, error, isLoading } = useQuery({
    queryKey: ["getVehicleBookings", user?.data.userId],

    queryFn: () =>
      http.get<VehicleBookings>(
        `/v1/bookings/${id}/bookings`
      ),
    enabled: !!user?.data.userId && !!id,
    retry: false,
  });

  return {
   vehicleBookings: data?.data.content ?? [],
    isError,
    error,
    isLoading,
  };
}
