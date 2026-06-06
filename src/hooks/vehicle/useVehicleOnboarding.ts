"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { VehicleInformation, VehicleInformationResponse } from "@/types";
import { updateVehicleInformation } from "@/lib/features/vehicleOnboardingSlice";
import {useHttp} from "@/hooks/useHttp";
import {
  getOnboardingVehicleId,
  setOnboardingVehicleId,
} from "@/utils/vehicleOnboardingSession";
import { normalizeVehicleOnboardingData } from "@/utils/vehicleOnboardingPrefill";

export default function useVehicleOnboarding() {
  const dispatch = useAppDispatch();
  const routeParams = useSearchParams();
  const routeVehicleId = routeParams.get("id");
  const sessionVehicleId = getOnboardingVehicleId();
  const vehicleId = routeVehicleId ?? sessionVehicleId ?? null;

  const http = useHttp();

  const { user } = useAppSelector((state) => state.user);

  useEffect(() => {
    if (routeVehicleId) {
      setOnboardingVehicleId(routeVehicleId);
    }
  }, [routeVehicleId]);

  const { data, isError, isLoading, isSuccess } = useQuery({
    queryKey: ["getVehicleById", vehicleId],
    queryFn: () =>
      http.get<VehicleInformationResponse>(`/vehicles/${vehicleId}`),
    enabled: !!user?.data.userId && !!vehicleId,
    retry: false,
  });
  useEffect(() => {
    if (data?.data) {
      const normalized = normalizeVehicleOnboardingData(data.data);
      if (normalized) {
        dispatch(updateVehicleInformation(normalized));
      }
    }
  }, [data, dispatch]);
  return {
    data,
    isError,
    isLoading,
  };
}
