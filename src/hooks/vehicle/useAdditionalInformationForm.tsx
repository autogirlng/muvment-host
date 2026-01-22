"use client";

import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { handleErrors } from "@/utils/functions";
import {
    AdditionalVehicleInformationValues,
    ErrorResponse,
    VehicleInformation,
    VehicleInformationResponse,
    VehicleOnboardingStepsHookProps

} from "@/types";
import { updateVehicleInformation } from "@/lib/features/vehicleOnboardingSlice";
import { useRouter } from "next/navigation";
import { useHttp } from "@/hooks/useHttp";
import { useState, useEffect } from "react";

export default function useAdditionalInformationForm({
    currentStep,
    setCurrentStep,
}: VehicleOnboardingStepsHookProps) {
    const http = useHttp();

    const router = useRouter();
    const dispatch = useAppDispatch();
    const [vehicleId, setVehicleId] = useState<string>("")

    useEffect(() => {
        const id = sessionStorage.getItem("vehicleId") ?? ""
        setVehicleId(id)
    }, [])

    const { vehicle } = useAppSelector((state) => state.vehicleOnboarding);

    const initialValues: AdditionalVehicleInformationValues = {
        licensePlateNumber: "",
        stateOfRegistration: "",
        description: "",
        featureIds: [],
        vehicleColorId: "",
        numberOfSeats: 0,
    };


    const saveStep2 = useMutation({
        mutationFn: (values: AdditionalVehicleInformationValues) =>
            http.patch<VehicleInformation>(
                `/v1/vehicles/details/${vehicleId}`,
                {
                    ...values,
                    numberOfSeats: values.numberOfSeats,
                }
            ),

        onSuccess: (data) => {
            console.log("Vehicle Onboarding Step 2 Saved", data);
            dispatch(
                updateVehicleInformation(
                    // @ts-ignore
                    { ...vehicle, ...data }
                )
            );
            router.push("/listings");
        },

        onError: (error: AxiosError<ErrorResponse>) =>
            handleErrors(error, "Vehicle Onboarding Step 2"),
    });

    const submitStep2 = useMutation({
        mutationFn: (values: AdditionalVehicleInformationValues) => {
            console.log(values)
            return http.patch<VehicleInformationResponse>(
                `/v1/vehicles/details?id=${vehicleId}`,
                values
            )
        },


        onSuccess: (data) => {
            console.log("Vehicle Onboarding Step 2 Submitted", data);
            dispatch(
                updateVehicleInformation(
                    // @ts-ignore
                    { ...vehicle, ...data }
                )
            );
            setCurrentStep(currentStep + 1);
        },

        onError: (error: AxiosError<ErrorResponse>) =>
            handleErrors(error, "Vehicle Onboarding Step 2"),
    });

    return {
        submitStep2,
        saveStep2,
        vehicle,
        initialValues,
    };
}
