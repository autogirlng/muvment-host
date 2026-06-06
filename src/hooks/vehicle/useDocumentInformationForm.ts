"use client";
import { useMemo, useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { handleErrors } from "@/utils/functions";
import {
    DocumentVehicleInformationFormValues,
    DocumentVehicleInformationValues,
    ErrorResponse,
} from "@/types";
import { updateVehicleInformation } from "@/lib/features/vehicleOnboardingSlice";
import { useHttp } from "@/hooks/useHttp";
import {
    buildDocumentInitialValues,
    resolveDocumentsForPatch,
} from "@/utils/vehicleOnboardingPrefill";
import { getOnboardingVehicleId } from "@/utils/vehicleOnboardingSession";
import { CloudinaryDocumentUpload } from "@/types/upload";

export default function useDocumentInformationForm({
    currentStep,
    setCurrentStep,
}: {
    currentStep: number;
    setCurrentStep: Dispatch<SetStateAction<number>>;
}) {
    const http = useHttp();
    const dispatch = useAppDispatch();
    const { vehicle } = useAppSelector((state) => state.vehicleOnboarding);
    const [vehicleId, setVehicleId] = useState<string>("");

    useEffect(() => {
        setVehicleId(getOnboardingVehicleId());
    }, []);

    const initialValues: DocumentVehicleInformationValues = useMemo(
        () => buildDocumentInitialValues(vehicle),
        [vehicle]
    );

    const existingDocuments = (vehicle?.documents ?? []) as CloudinaryDocumentUpload[];

    const patchDocuments = async (values: DocumentVehicleInformationFormValues) => {
        const documents = await resolveDocumentsForPatch(values, existingDocuments);
        return http.patch(`/vehicles/documents?vehicleId=${vehicleId}`, { documents });
    };

    const saveStep5 = useMutation({
        mutationFn: patchDocuments,
        onSuccess: (data) => {
            dispatch(
                updateVehicleInformation(
                    // @ts-ignore
                    { ...vehicle, document: data }
                )
            );
        },
        onError: (error: AxiosError<ErrorResponse>) =>
            handleErrors(error, "Vehicle Onboarding Step 5 Save"),
    });

    const submitStep5 = useMutation({
        mutationFn: patchDocuments,
        onSuccess: (data) => {
            dispatch(
                updateVehicleInformation(
                    // @ts-ignore
                    { ...vehicle, document: data }
                )
            );
            setCurrentStep((step) => step + 1);
        },
        onError: (error: AxiosError<ErrorResponse>) =>
            handleErrors(error, "Vehicle Onboarding Step 5 Submit"),
    });

    return {
        submitStep5,
        saveStep5,
        vehicle,
        initialValues,
    };
}
