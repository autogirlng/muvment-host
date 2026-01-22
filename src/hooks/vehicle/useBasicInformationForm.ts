"use client";

import { useCallback, useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { debounce, handleErrors } from "@/utils/functions";
import {
    BasicVehicleInformationValues,
    ErrorResponse,
    VehicleInformation,
    VehicleInformationResponse, 
    VehicleInfoState, 
    VehicleMakeTypeResponse, 
    VehicleModelResponse, 
    VehicleOnboardingStepsHookProps
} from "@/types";
import { updateVehicleInformation } from "@/lib/features/vehicleOnboardingSlice";
import { useHttp } from "@/hooks/useHttp";



export default function useBasicInformationForm({currentStep,setCurrentStep}:VehicleOnboardingStepsHookProps) {
    const http = useHttp();
    const router = useRouter();

    const dispatch = useAppDispatch();

    const { vehicle } = useAppSelector((state) => state.vehicleOnboarding);
    const [searchAddressQuery, setSearchAddressQuery] = useState("");
    const [vehicleOptions, setVehicleOptions] = useState<VehicleInfoState>({
        vehicleTypes: [],
        vehicleMakes: [],
        vehicleModels: []
    })
    const fetchVehicleOptions = async () => {
            const [vehicleTypesRes, vehicleMakesRes, vehicleModelRes] = await Promise.all([
                http.get<VehicleMakeTypeResponse>("/v1/public/vehicle-types"),
                http.get<VehicleMakeTypeResponse>("/v1/public/vehicle-makes"),
                http.get<VehicleModelResponse>("/v1/public/vehicle-models")
            ]);

            const vehicleTypes = vehicleTypesRes?.data.map((type) => ({
                option: type.name,
                value: type.id
            })) ?? []
    
            const vehicleMakes = vehicleMakesRes?.data.map((make) => ({
                option: make.name,
                value: make.id
            })) ?? []
    
            const vehicleModels = vehicleModelRes?.data.map((model) => ({
                option: model.name,
                value: model.id
            })) ?? []
            setVehicleOptions({
                vehicleTypes,
                vehicleMakes,
                vehicleModels
            })
    
    
        }
        useEffect(() => {
            fetchVehicleOptions()
        }, [])

    const [googlePlaces, setGooglePlaces] = useState<
        { formattedAddress: string,
         location:{latitude:number, longitude:number}
         }[]
    >([]);

    const [searchAddressError, setSearchAddressError] = useState("");
    const [searchAddressLoading, setSearchAddressLoading] = useState(false);
    const [showAddressList, setShowAddressList] = useState(false);

    const initialValues: BasicVehicleInformationValues = {
        name: vehicle?.name || "",
        city: vehicle?.city || "",
        address: vehicle?.address || "",
        latitude:0, 
        longitude:0, 
        vehicleMakeId:"", 
        vehicleModelId:"", 
        vehicleTypeId:"", 
        yearOfRelease: vehicle?.yearOfRelease || 0,
        hasInsurance:
        vehicle?.hasInsurance === undefined || vehicle?.hasInsurance === null
                ? ""
                : vehicle?.hasInsurance
                    ? "yes"
                    : "no",
        hasTracker:
            vehicle?.hasTracker === undefined || vehicle?.hasTracker === null
                ? ""
                : vehicle?.hasTracker
                    ? "yes"
                    : "no",
        isVehicleUpgraded:
            vehicle?.isVehicleUpgraded === undefined || vehicle?.isVehicleUpgraded === null
                ? ""
                : vehicle?.isVehicleUpgraded
                    ? "yes"
                    : "no",
    };

    const fetchPlaces = async (query: string) => {
        setSearchAddressLoading(true);
        setSearchAddressError("");

        try {
            const response = await axios.post(
                `https://places.googleapis.com/v1/places:searchText`,
                {
                    textQuery: query,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "X-Goog-Api-Key": process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY,
                        "X-Goog-FieldMask":
                            "places.displayName,places.formattedAddress,places.priceLevel,places.location",
                    },
                }
            );
           
            setGooglePlaces(response.data.places || []);
        } catch (err) {
            console.error(err);
            setSearchAddressError("Error fetching places. Please try again later.");
            setGooglePlaces([]);
        } finally {
            setSearchAddressLoading(false);
            setShowAddressList(true);
        }
    };

    const debouncedFetchPlaces = useCallback(
        debounce((query) => {
            fetchPlaces(query);
        }, 1500),
        []
    );

    useEffect(() => {
        if (searchAddressQuery.length >= 1) {
            debouncedFetchPlaces(searchAddressQuery);
        }
    }, [searchAddressQuery, debouncedFetchPlaces]);

    const saveStep1 = useMutation({
        mutationFn: (values: BasicVehicleInformationValues) =>
            http.post<VehicleInformation>("/v1/vehicles", {
                ...values,
                hasTracker: values.hasTracker === "yes",
                hasInsurance: values.hasInsurance === "yes",
                isVehicleUpgraded:values.isVehicleUpgraded === "yes"
                // ...(vehicle?.id && { id: vehicle.id }),
            }),

        onSuccess: (data) => {
            console.log("Vehicle Onboarding Step 1 Saved", data);
            dispatch(
                // @ts-ignore
                updateVehicleInformation({ ...vehicle, ...data })
            );
            // router.push("/listings");
        },

        onError: (error: AxiosError<ErrorResponse>) =>
            handleErrors(error, "Vehicle Onboarding Step 1"),
    });

    const submitStep1 = useMutation({
        mutationFn: (values: BasicVehicleInformationValues) =>
            http.post<VehicleInformationResponse>("/v1/vehicles", {
                ...values,
               hasTracker: values.hasTracker === "yes",
                hasInsurance: values.hasInsurance === "yes",
                isVehicleUpgraded:values.isVehicleUpgraded === "yes"
                // ...(vehicle?.id && { id: vehicle.id }),
            }),

        onSuccess: (data) => {
            console.log("Vehicle Onboarding Step 1 Submitted", data);
            // dispatch(
            //     // @ts-ignore
            //     updateVehicleInformation({ ...vehicle, ...data })
            // );
            
            sessionStorage.setItem("vehicleId", `${data?.data.id}` )
            setCurrentStep(currentStep + 1);
        },

        onError: (error: AxiosError<ErrorResponse>) =>
            handleErrors(error, "Vehicle Onboarding Step 1"),
    });

    return {
        submitStep1,
        saveStep1,
        vehicle,
        initialValues,
        searchAddressQuery,
        googlePlaces,
        searchAddressError,
        searchAddressLoading,
        setSearchAddressQuery,
        showAddressList,
        setShowAddressList,
        vehicleOptions
    };
}
