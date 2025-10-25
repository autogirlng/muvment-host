"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { handleErrors } from "@/utils/functions";
import {
  AvailabilityAndPricing,
  AvailabilityAndPricingValues,
  ErrorResponse,
  VehicleInformation,
} from "@/types";
import { updateVehicleInformation } from "@/lib/features/vehicleOnboardingSlice";
import { useHttp } from "@/hooks/useHttp";
import { stripNonNumeric } from "@/utils/formatters";

export default function useAvailabilityAndPricingForm({
  currentStep,
  setCurrentStep,
}: {
  currentStep: number;
  setCurrentStep: (step: number) => void;
}) {
  const http = useHttp();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { vehicle } = useAppSelector((state) => state.vehicleOnboarding);
  const [showOuskirts, setShowOuskirts] = useState<boolean>(
    Array.isArray(vehicle?.outskirtsLocation) &&
      vehicle.outskirtsLocation.length > 0
  );

  const [showDiscounts, setShowDiscounts] = useState<boolean>(
    Array.isArray(vehicle?.outskirtsLocation) &&
      vehicle.outskirtsLocation.length > 0
  );

  const initialValues: AvailabilityAndPricingValues = {
   

  maxTripDurationUnit: "DAYS",
  maxTripDurationValue: 1,
  advanceNoticeUnit: "DAYS",
  advanceNoticeValue: 1,
  willProvideDriver: "",
  willProvideFuel: "",
  supportedBookingTypeIds: [],
  outOfBoundsAreaIds: [],
  outskirtFee: 0,
  extremeFee: 0,

  };
 const [vehicleId, setVehicleId] = useState<string>("")
    useEffect(()=>{
    const id = sessionStorage.getItem("vehicleId") ?? ""
    setVehicleId(id)
    }, [])
  const mapValuesToApiPayload = (values: AvailabilityAndPricingValues) => {
    return {
        ...values,
          advanceNoticeValue:Number(values.advanceNoticeValue),
          extremeFee:Number(values.extremeFee), 
          outskirtFee:Number(values.outskirtFee), 
          maxTripDurationValue:Number(values.maxTripDurationValue), 
          pricing:[], 
          discounts:[], 
          extraHourlyRate:0,
          willProvideDriver:values.willProvideDriver === "yes",
          willProvideFuel:values.willProvideFuel === "yes"
    }
  };

  const saveStep4 = useMutation({
    mutationFn: (values: any) =>
      http.patch<VehicleInformation>(
        `/v1/vehicles/configuration?id=${vehicleId}`,
        values
      ),

    onSuccess: (data) => {
      console.log("Vehicle Onboarding Step 4 Saved", data);
      dispatch(
        updateVehicleInformation({ ...vehicle, ...data } as VehicleInformation)
      );
      // router.push("/listings");
    },

    onError: (error: AxiosError<ErrorResponse>) =>
      handleErrors(error, "Vehicle Onboarding Step 4"),
  });
  const submitStep4 = useMutation({
    mutationFn: (values: any) => {
      console.log(     {
          ...values, 
        })
      return  http.patch<VehicleInformation>(
        `/v1/vehicles/configuration?id=${vehicleId}`,
        {
          ...values, 
        }
      )
    },
    onSuccess: (data) => {
      console.log("Vehicle Onboarding Step 4 Submitted", data);
      dispatch(
        updateVehicleInformation(
          // @ts-ignore
          { ...vehicle, ...data }
        )
      );
      setCurrentStep(currentStep + 1);
    },

    onError: (error: AxiosError<ErrorResponse>) =>
      handleErrors(error, "Vehicle Onboarding Step 4"),
  });

  return {
    submitStep4,
    saveStep4,
    vehicle,
    mapValuesToApiPayload,
    initialValues,
    showOuskirts,
    setShowOuskirts,
    showDiscounts,
    setShowDiscounts,
  };
}
