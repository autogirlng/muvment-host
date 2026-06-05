"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import { handleErrors } from "@/utils/functions";
import { ErrorResponse, VehicleInformation } from "@/types";
import { useHttp } from "@/hooks/useHttp";
import { getListingsDraftUrl } from "@/utils/listingsNavigation";

function isDraftOnlySubmitError(error: AxiosError<ErrorResponse>): boolean {
  const body = error.response?.data;
  const message = String(body?.data ?? "").toLowerCase();
  return message.includes("draft") || message.includes("only vehicles");
}

export default function useVehicleSummary() {
  const http = useHttp();
  const router = useRouter();

  const [agreeToTerms, setAgreeToTerms] = useState<boolean>(false);
  const [vehicleId, setVehicleId] = useState<string>("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [submittedVehicleName, setSubmittedVehicleName] = useState("vehicle");

  useEffect(() => {
    const id = sessionStorage.getItem("vehicleId") ?? "";
    setVehicleId(id);
  }, []);

  const submitVehicleOnboarding = useMutation({
    mutationFn: () =>
      http.post<VehicleInformation>(`/vehicles/submit-review?id=${vehicleId}`),

    onSuccess: (data) => {
      const vehicleName =
        (data as VehicleInformation)?.name ??
        sessionStorage.getItem("submittedVehicleName") ??
        "vehicle";

      sessionStorage.setItem("submittedVehicleId", vehicleId);
      sessionStorage.setItem("submittedVehicleName", vehicleName);
      setSubmittedVehicleName(vehicleName);
      setShowSuccessModal(true);
    },

    onError: (error: AxiosError<ErrorResponse>) => {
      if (isDraftOnlySubmitError(error)) {
        toast.error(
          "This vehicle must be in draft before submitting. View your drafts to continue editing."
        );
        router.push(getListingsDraftUrl());
        return;
      }

      handleErrors(error, "Vehicle Onboarding Submitted for Review");
    },
  });

  return {
    submitVehicleOnboarding,
    agreeToTerms,
    setAgreeToTerms,
    showSuccessModal,
    setShowSuccessModal,
    submittedVehicleName,
  };
}
