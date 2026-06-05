"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { handleErrors } from "@/utils/functions";
import {
  ErrorResponse,
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
  resolvePhotosForPatch,
} from "@/utils/vehicleOnboardingPrefill";
import { getOnboardingVehicleId } from "@/utils/vehicleOnboardingSession";

export default function useVehiclePhotosForm({
  currentStep,
  setCurrentStep,
}: VehicleOnboardingStepsHookProps) {
  const http = useHttp();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [vehicleId, setVehicleId] = useState<string>("");

  useEffect(() => {
    setVehicleId(getOnboardingVehicleId());
  }, []);

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
    const photos = await resolvePhotosForPatch(values, vehicle?.photos ?? []);
    return http.patch(`/vehicles/photos?vehicleId=${vehicleId}`, { photos });
  };

  const saveStep3 = useMutation({
    mutationFn: patchPhotos,
    onSuccess: (data) => {
      dispatch(
        // @ts-ignore
        updateVehicleInformation({ ...vehicle, VehicleImage: data })
      );
      router.push("/listings");
    },
    onError: (error: AxiosError<ErrorResponse>) =>
      handleErrors(error, "Vehicle Onboarding Step 3"),
  });

  const submitStep3 = useMutation({
    mutationFn: patchPhotos,
    onSuccess: (data) => {
      dispatch(
        // @ts-ignore
        updateVehicleInformation({ ...vehicle, VehicleImage: data })
      );
      setCurrentStep(currentStep + 1);
    },
    onError: (error: AxiosError<ErrorResponse>) =>
      handleErrors(error, "Vehicle Onboarding Step 3"),
  });

  return {
    initialValues,
    photoViews,
    setPhotoViews,
    submitStep3,
    saveStep3,
    vehicle,
  };
}
