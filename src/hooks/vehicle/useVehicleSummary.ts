"use client";
import {  useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { handleErrors } from "@/utils/functions";
import {
  ErrorResponse,
  VehicleInformation,
} from "@/types";
import { useHttp } from "@/hooks/useHttp";


export default function useVehicleSummary() {
  const http = useHttp();

  const router = useRouter();

  const [agreeToTerms, setAgreeToTerms] = useState<boolean>(false);
  const [vehicleId, setVehicleId] = useState<string>("")
  
useEffect(()=>{
    const id = sessionStorage.getItem("vehicleId") ?? ""
    setVehicleId(id)
}, [])
  const submitVehicleOnboarding = useMutation({
    mutationFn: () =>
      http.post<VehicleInformation>(
        `/v1/vehicles/submit-review?id=${vehicleId}`),

    onSuccess: (data) => {
      console.log("Vehicle Onboarding Submitted for Review Successful", data);
      router.push(`/vehicle-onboarding/success/${vehicleId}`);
    },

    onError: (error: AxiosError<ErrorResponse>) =>
      handleErrors(error, "Vehicle Onboarding Submitted for Review"),
  });

  return {
    submitVehicleOnboarding,
    agreeToTerms,
    setAgreeToTerms,
  };
}
