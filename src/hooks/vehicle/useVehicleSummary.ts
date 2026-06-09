"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import { handleErrors } from "@/utils/functions";
import { ErrorResponse, VehicleInformation, VehicleInformationResponse } from "@/types";
import { useHttp } from "@/hooks/useHttp";
import { getListingsDraftUrl } from "@/utils/listingsNavigation";
import { getOnboardingVehicleId } from "@/utils/vehicleOnboardingSession";
import { invalidateListingsCache } from "@/utils/invalidateListingsCache";

function isDraftOnlySubmitError(error: AxiosError<ErrorResponse>): boolean {
  const body = error.response?.data;
  const message = String(body?.data ?? "").toLowerCase();
  return message.includes("draft") || message.includes("only vehicles");
}

type UseVehicleSummaryOptions = {
  isEditingExisting?: boolean;
  onSubmitSuccess?: (vehicleName: string) => void;
};

export default function useVehicleSummary(options: UseVehicleSummaryOptions = {}) {
  const { isEditingExisting = false, onSubmitSuccess } = options;
  const http = useHttp();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [agreeToTerms, setAgreeToTerms] = useState<boolean>(false);

  const submitVehicleOnboarding = useMutation({
    mutationFn: async () => {
      const id = getOnboardingVehicleId();
      if (!id) {
        throw new Error("Vehicle ID is missing. Please complete onboarding from step 1.");
      }
      if (isEditingExisting) {
        const refreshed = await http.get<VehicleInformationResponse>(`/vehicles/${id}`);
        return refreshed;
      }
      return http.post<VehicleInformationResponse>(`/vehicles/submit-review?id=${id}`);
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

  const submitForReview = useCallback((vehicleName?: string) => {
    submitVehicleOnboarding.mutate(undefined, {
      onSuccess: (response) => {
        const submittedId = getOnboardingVehicleId();
        const name =
          response?.data?.name ??
          vehicleName ??
          sessionStorage.getItem("submittedVehicleName") ??
          "vehicle";

        sessionStorage.setItem("submittedVehicleId", submittedId);
        sessionStorage.setItem("submittedVehicleName", name);
        onSubmitSuccess?.(name);
        invalidateListingsCache(queryClient, submittedId);
      },
    });
  }, [queryClient, onSubmitSuccess]);

  return {
    submitVehicleOnboarding,
    submitForReview,
    agreeToTerms,
    setAgreeToTerms,
  };
}
