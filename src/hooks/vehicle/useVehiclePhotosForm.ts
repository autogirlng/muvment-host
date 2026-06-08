"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { handleErrors } from "@/utils/functions";
import {
  ErrorResponse,
  VehicleInformationResponse,
  VehiclePhotos,
  VehiclePhotosFormValues,
  VehicleOnboardingStepsHookProps,
} from "@/types";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { updateVehicleInformation } from "@/lib/features/vehicleOnboardingSlice";
import { useHttp } from "@/hooks/useHttp";
import {
  buildPhotoViewsFromValues,
  buildVehiclePhotosInitialValues,
  mergeVehicleOnboardingState,
  normalizeVehicleOnboardingData,
  resolvePhotosForPatch,
} from "@/utils/vehicleOnboardingPrefill";
import { getOnboardingVehicleId } from "@/utils/vehicleOnboardingSession";
import { invalidateListingsCache } from "@/utils/invalidateListingsCache";

export default function useVehiclePhotosForm({
  setCurrentStep,
}: VehicleOnboardingStepsHookProps) {
  const http = useHttp();
  const router = useRouter();
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  const { vehicle } = useAppSelector((state) => state.vehicleOnboarding);

  const initialValues: VehiclePhotos = useMemo(
    () => buildVehiclePhotosInitialValues(vehicle),
    [vehicle]
  );

  const [photoViews, setPhotoViews] = useState(() =>
    buildPhotoViewsFromValues(initialValues)
  );

  useEffect(() => {
    setPhotoViews(buildPhotoViewsFromValues(initialValues));
  }, [initialValues]);

  const patchPhotos = async (values: VehiclePhotosFormValues) => {
    const vehicleId = getOnboardingVehicleId();
    const photos = await resolvePhotosForPatch(values, vehicle?.photos ?? []);
    await http.patch(`/vehicles/photos?vehicleId=${vehicleId}`, { photos });
    const refreshed = await http.get<VehicleInformationResponse>(`/vehicles/${vehicleId}`);
    return refreshed?.data ?? null;
  };

  const handleStep3Success = (data: ReturnType<typeof normalizeVehicleOnboardingData>) => {
    if (!data) return;
    dispatch(
      updateVehicleInformation(mergeVehicleOnboardingState(vehicle, data))
    );
    invalidateListingsCache(queryClient, getOnboardingVehicleId());
  };

  const saveStep3 = useMutation({
    mutationFn: patchPhotos,
    onError: (error: AxiosError<ErrorResponse>) =>
      handleErrors(error, "Vehicle Onboarding Step 3"),
  });

  const submitStep3 = useMutation({
    mutationFn: patchPhotos,
    onError: (error: AxiosError<ErrorResponse>) =>
      handleErrors(error, "Vehicle Onboarding Step 3"),
  });

  const saveDraft = (values: VehiclePhotosFormValues) => {
    saveStep3.mutate(values, {
      onSuccess: (data) => {
        handleStep3Success(normalizeVehicleOnboardingData(data));
        router.push("/listings");
      },
    });
  };

  const submit = (values: VehiclePhotosFormValues) => {
    submitStep3.mutate(values, {
      onSuccess: (data) => {
        handleStep3Success(normalizeVehicleOnboardingData(data));
        setCurrentStep((step) => step + 1);
      },
    });
  };

  return {
    initialValues,
    photoViews,
    setPhotoViews,
    submitStep3: { ...submitStep3, mutate: submit, isPending: submitStep3.isPending },
    saveStep3: { ...saveStep3, mutate: saveDraft, isPending: saveStep3.isPending },
    vehicle,
  };
}
