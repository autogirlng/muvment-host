"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { handleErrors } from "@/utils/functions";
import {
    AdditionalVehicleInformationValues,
    ErrorResponse,
    VehicleInformationResponse,
    VehicleOnboardingStepsHookProps,
} from "@/types";
import { updateVehicleInformation } from "@/lib/features/vehicleOnboardingSlice";
import { useRouter } from "next/navigation";
import { useHttp } from "@/hooks/useHttp";
import { useMemo } from "react";
import {
    mergeVehicleOnboardingState,
    normalizeVehicleOnboardingData,
} from "@/utils/vehicleOnboardingPrefill";
import { getOnboardingVehicleId } from "@/utils/vehicleOnboardingSession";
import { invalidateListingsCache } from "@/utils/invalidateListingsCache";

export default function useAdditionalInformationForm({
    setCurrentStep,
}: VehicleOnboardingStepsHookProps) {
    const http = useHttp();
    const router = useRouter();
    const queryClient = useQueryClient();
    const dispatch = useAppDispatch();

    const { vehicle } = useAppSelector((state) => state.vehicleOnboarding);

    const initialValues: AdditionalVehicleInformationValues = useMemo(
        () => ({
            licensePlateNumber: vehicle?.licensePlateNumber || "",
            stateOfRegistration: vehicle?.stateOfRegistration || "",
            description: vehicle?.description || "",
            featureIds: vehicle?.features?.map((f) => f.id) || [],
            vehicleColorId: vehicle?.vehicleColorId || "",
            numberOfSeats: vehicle?.numberOfSeats || 0,
        }),
        [vehicle]
    );

    const persistStep2 = async (values: AdditionalVehicleInformationValues) => {
        const vehicleId = getOnboardingVehicleId();
        const response = await http.patch<VehicleInformationResponse>(
            `/vehicles/details?id=${vehicleId}`,
            {
                ...values,
                numberOfSeats: values.numberOfSeats,
            }
        );
        const refreshed = await http.get<VehicleInformationResponse>(`/vehicles/${vehicleId}`);
        return refreshed?.data ?? response?.data ?? null;
    };

    const handleStep2Success = (data: ReturnType<typeof normalizeVehicleOnboardingData>) => {
        if (!data) return;
        dispatch(
            updateVehicleInformation(mergeVehicleOnboardingState(vehicle, data))
        );
        invalidateListingsCache(queryClient, getOnboardingVehicleId());
    };

    const saveStep2 = useMutation({
        mutationFn: persistStep2,
        onError: (error: AxiosError<ErrorResponse>) =>
            handleErrors(error, "Vehicle Onboarding Step 2"),
    });

    const submitStep2 = useMutation({
        mutationFn: persistStep2,
        onError: (error: AxiosError<ErrorResponse>) =>
            handleErrors(error, "Vehicle Onboarding Step 2"),
    });

    const saveDraft = (values: AdditionalVehicleInformationValues) => {
        saveStep2.mutate(values, {
            onSuccess: (data) => {
                handleStep2Success(normalizeVehicleOnboardingData(data));
                router.push("/listings");
            },
        });
    };

    const submit = (values: AdditionalVehicleInformationValues) => {
        submitStep2.mutate(values, {
            onSuccess: (data) => {
                handleStep2Success(normalizeVehicleOnboardingData(data));
                setCurrentStep((step) => step + 1);
            },
        });
    };

    return {
        submitStep2: { ...submitStep2, mutate: submit, isPending: submitStep2.isPending },
        saveStep2: { ...saveStep2, mutate: saveDraft, isPending: saveStep2.isPending },
        vehicle,
        initialValues,
    };
}
