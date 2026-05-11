"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { VehicleInformation, VehicleInformationResponse } from "@/types";
import { updateVehicleInformation } from "@/lib/features/vehicleOnboardingSlice";
import {useHttp} from "@/hooks/useHttp";

export default function useVehicleOnboarding() {
  const dispatch = useAppDispatch();
  const routeParams = useSearchParams();
  const vehicleId = routeParams.get("id");

  const http = useHttp();

  const { user } = useAppSelector((state) => state.user);

  useEffect(() => {
    if (vehicleId) {
      sessionStorage.setItem("vehicleId", vehicleId);
    }
  }, [vehicleId]);

  const { data, isError, isLoading, isSuccess } = useQuery({
    queryKey: ["getVehicleById", vehicleId],
    queryFn: () =>
      http.get<VehicleInformationResponse>(`/vehicles/${vehicleId}`),
    enabled: !!user?.data.userId && !!vehicleId,
    retry: false,
  });
  useEffect(() => {
    if (isSuccess && data?.data) {
      dispatch(updateVehicleInformation(data.data as unknown as VehicleInformation));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess]);
  return {
    data,
    isError,
    isLoading,
  };
}
