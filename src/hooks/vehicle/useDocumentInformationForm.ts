"use client";
import { useMemo, useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { handleErrors } from "@/utils/functions";
import {
    DocumentVehicleInformationFormValues,
    DocumentVehicleInformationValues,
    ErrorResponse,
    VehicleInformationResponse,
} from "@/types";
import { updateVehicleInformation } from "@/lib/features/vehicleOnboardingSlice";
import { useHttp } from "@/hooks/useHttp";
import {
    buildDocumentInitialValues,
    mergeVehicleOnboardingState,
    normalizeVehicleOnboardingData,
    resolveDocumentsForPatch,
} from "@/utils/vehicleOnboardingPrefill";
import { getOnboardingVehicleId } from "@/utils/vehicleOnboardingSession";
import { CloudinaryDocumentUpload } from "@/types/upload";
import { invalidateListingsCache } from "@/utils/invalidateListingsCache";

export default function useDocumentInformationForm({
    setCurrentStep,
}: {
    currentStep: number;
    setCurrentStep: Dispatch<SetStateAction<number>>;
}) {
    const http = useHttp();
    const queryClient = useQueryClient();
    const dispatch = useAppDispatch();
    const { vehicle } = useAppSelector((state) => state.vehicleOnboarding);

    const initialValues: DocumentVehicleInformationValues = useMemo(
        () => buildDocumentInitialValues(vehicle),
        [vehicle]
    );

    const existingDocuments = (vehicle?.documents ?? []) as CloudinaryDocumentUpload[];

    const patchDocuments = async (values: DocumentVehicleInformationFormValues) => {
        const vehicleId = getOnboardingVehicleId();
        const documents = await resolveDocumentsForPatch(values, existingDocuments);
        await http.patch(`/vehicles/documents?vehicleId=${vehicleId}`, { documents });
        const refreshed = await http.get<VehicleInformationResponse>(`/vehicles/${vehicleId}`);
        return refreshed?.data ?? null;
    };

    const handleStep4Success = (data: ReturnType<typeof normalizeVehicleOnboardingData>) => {
        if (!data) return;
        dispatch(
            updateVehicleInformation(mergeVehicleOnboardingState(vehicle, data))
        );
        invalidateListingsCache(queryClient, getOnboardingVehicleId());
    };

    const saveStep5 = useMutation({
        mutationFn: patchDocuments,
        onError: (error: AxiosError<ErrorResponse>) =>
            handleErrors(error, "Vehicle Onboarding Step 4 Save"),
    });

    const submitStep5 = useMutation({
        mutationFn: patchDocuments,
        onError: (error: AxiosError<ErrorResponse>) =>
            handleErrors(error, "Vehicle Onboarding Step 4 Submit"),
    });

    const saveDraft = (values: DocumentVehicleInformationFormValues) => {
        saveStep5.mutate(values, {
            onSuccess: (data) => {
                handleStep4Success(normalizeVehicleOnboardingData(data));
            },
        });
    };

    const submit = (values: DocumentVehicleInformationFormValues) => {
        submitStep5.mutate(values, {
            onSuccess: (data) => {
                handleStep4Success(normalizeVehicleOnboardingData(data));
                setCurrentStep((step) => step + 1);
            },
        });
    };

    return {
        submitStep5: { ...submitStep5, mutate: submit, mutateAsync: submitStep5.mutateAsync, isPending: submitStep5.isPending },
        saveStep5: { ...saveStep5, mutate: saveDraft, mutateAsync: saveStep5.mutateAsync, isPending: saveStep5.isPending },
        vehicle,
        initialValues,
        existingDocuments,
    };
}
