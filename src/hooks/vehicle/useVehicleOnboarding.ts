"use client";

import { useEffect, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { VehicleInformationResponse } from "@/types";
import { updateVehicleInformation, clearVehicleOnboarding } from "@/lib/features/vehicleOnboardingSlice";
import { useHttp } from "@/hooks/useHttp";
import {
  getOnboardingVehicleId,
  setOnboardingVehicleId,
} from "@/utils/vehicleOnboardingSession";
import { normalizeVehicleOnboardingData } from "@/utils/vehicleOnboardingPrefill";

export default function useVehicleOnboarding() {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const routeParams = useSearchParams();
  const routeVehicleId = routeParams.get("id");
  const sessionVehicleId = getOnboardingVehicleId();
  const vehicleId = routeVehicleId ?? sessionVehicleId ?? null;

  const http = useHttp();
  const { user } = useAppSelector((state) => state.user);
  const { vehicle } = useAppSelector((state) => state.vehicleOnboarding);

  useEffect(() => {
    if (!routeVehicleId) return;

    setOnboardingVehicleId(routeVehicleId);

    if (vehicle?.id && vehicle.id !== routeVehicleId) {
      dispatch(clearVehicleOnboarding());
      setOnboardingVehicleId(routeVehicleId);
    }
  }, [routeVehicleId, vehicle?.id, dispatch]);

  const { data, isError, isLoading, isFetching } = useQuery({
    queryKey: ["getVehicleById", vehicleId],
    queryFn: () =>
      http.get<VehicleInformationResponse>(`/vehicles/${vehicleId}`),
    enabled: !!user?.data.userId && !!vehicleId,
    retry: false,
    staleTime: 0,
    refetchOnMount: "always",
  });

  useEffect(() => {
    if (!data?.data) return;
    const normalized = normalizeVehicleOnboardingData(data.data);
    if (normalized) {
      dispatch(updateVehicleInformation(normalized));
    }
  }, [data, dispatch]);

  const isVehicleReady = useMemo(() => {
    if (!vehicleId) return true;
    return vehicle?.id === vehicleId;
  }, [vehicleId, vehicle?.id]);

  const invalidateVehicle = () => {
    if (vehicleId) {
      queryClient.invalidateQueries({ queryKey: ["getVehicleById", vehicleId] });
    }
  };

  return {
    data,
    isError,
    isLoading: isLoading || isFetching || !isVehicleReady,
    routeVehicleId,
    invalidateVehicle,
  };
}
