"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useHttp } from "@/hooks/useHttp";

export interface UnavailabilityPeriod {
  id: string;
  vehicleId: string;
  startDateTime: string;
  endDateTime: string;
  reason: string;
  notes: string;
  createdById: string;
}

export interface AddUnavailabilityPayload {
  startDateTime: string;
  endDateTime: string;
  reason: string;
  notes?: string;
}

interface UnavailabilityResponse {
  status: string;
  message: string;
  errorCode: string;
  data: UnavailabilityPeriod[];
  timestamp: string;
}

export function useVehicleUnavailability(vehicleId: string) {
  const http = useHttp();
  const queryClient = useQueryClient();
  const queryKey = ["vehicle-unavailability", vehicleId];

  const { data, isLoading, isError } = useQuery({
    queryKey,
    queryFn: async (): Promise<UnavailabilityResponse> => {
      const result = await http.get<UnavailabilityResponse>(
        `/vehicles/unavailability/${vehicleId}/unavailability`
      );
      if (!result) throw new Error("Failed to fetch unavailability periods");
      return result;
    },
    enabled: !!vehicleId,
    retry: false,
  });

  const addUnavailability = useMutation({
    mutationFn: (payload: AddUnavailabilityPayload) =>
      http.post(`/vehicles/unavailability/${vehicleId}/unavailability`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const removeUnavailability = useMutation({
    mutationFn: (unavailabilityId: string) =>
      http.delete(`/vehicles/unavailability/unavailability/${unavailabilityId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  return {
    periods: data?.data ?? [],
    isLoading,
    isError,
    addUnavailability,
    removeUnavailability,
  };
}
