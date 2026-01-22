"use client";

import {  useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { handleErrors } from "@/utils/functions";
import { photoViewOptions } from "@/utils/data";
import { ErrorResponse, VehiclePhotos, VehicleOnboardingStepsHookProps } from "@/types";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { updateVehicleInformation } from "@/lib/features/vehicleOnboardingSlice";
import { useHttp } from "@/hooks/useHttp";
import { uploadToCloudinary } from "@/utils/functions/uploadToCloudinary";


export default function useVehiclePhotosForm({
  currentStep,
  setCurrentStep,
}: VehicleOnboardingStepsHookProps) {
  const http = useHttp();
  const router = useRouter();
  const dispatch = useAppDispatch();
const [vehicleId, setVehicleId] = useState<string>("")
    useEffect(()=>{
    const id = sessionStorage.getItem("vehicleId") ?? ""
    setVehicleId(id)
    }, [])
  const { vehicle } = useAppSelector((state) => state.vehicleOnboarding);

  const appendFormData = (values: VehiclePhotos) => {
    const formData = new FormData();
    photoViewOptions.forEach((item) => {
      formData.append(item.name, values[item.name as keyof VehiclePhotos]);
    });
    return formData;
  };

  const initialValues: VehiclePhotos = {
    frontView: "",
    backView:  "",
    sideView1:  "",
    sideView2:  "",
    interior:  "",
    other:  "",
  };

  const [photoViews, setPhotoViews] = useState(
    photoViewOptions.map((view, index) => ({
      ...view,
      disabled:
        index === 0
          ? false
          : !initialValues[
              photoViewOptions[index - 1].name as keyof VehiclePhotos
            ],
    }))
  );

  useEffect(() => {
    console.log(photoViews);
  }, [photoViews]);

  const saveStep3 = useMutation({
    mutationFn: async (values: FormData) => {
      const vehiclePhotos = await uploadToCloudinary(values, "photos")
      return http.patch(`/v1/vehicles/photos?id=${vehicleId}`, {photos:vehiclePhotos})
    }, 

    onSuccess: (data) => {
      console.log("Vehicle Onboarding Step 3 Saved", data);
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
    mutationFn: async (values: FormData) => {
    const vehiclePhotos = await uploadToCloudinary(values, "photos")
      return http.patch(`/v1/vehicles/photos?id=${vehicleId}`, {photos:vehiclePhotos})
    },

    onSuccess: (data) => {
      console.log("Vehicle Onboarding Step 3 Submitted", data);
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
    appendFormData,
    photoViewOptions,
  };
}
