"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
    VEHICLE_MAKE_PLACEHOLDER,
    VEHICLE_SELECT_PLACEHOLDER,
} from "@/utils/constants";
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
    VehicleOnboardingStepsHookProps,
    ModelOption,
} from "@/types";
import { updateVehicleInformation } from "@/lib/features/vehicleOnboardingSlice";
import { useHttp } from "@/hooks/useHttp";
import { normalizeVehicleOnboardingData } from "@/utils/vehicleOnboardingPrefill";



export default function useBasicInformationForm({currentStep,setCurrentStep}:VehicleOnboardingStepsHookProps) {
    const http = useHttp();
    const router = useRouter();

    const dispatch = useAppDispatch();

    const { vehicle } = useAppSelector((state) => state.vehicleOnboarding);
    const [vehicleId, setVehicleId] = useState<string>("");
    const [searchAddressQuery, setSearchAddressQuery] = useState("");

    useEffect(() => {
        const id = sessionStorage.getItem("vehicleId") ?? "";
        setVehicleId(id);
    }, []);
    const [vehicleOptions, setVehicleOptions] = useState<VehicleInfoState>({
        vehicleTypes: [],
        vehicleMakes: [],
        vehicleModels: []
    })
    const fetchVehicleOptions = async () => {
            const [vehicleTypesRes, vehicleMakesRes, vehicleModelRes] = await Promise.all([
                http.get<VehicleMakeTypeResponse>("/public/vehicle-types"),
                http.get<VehicleMakeTypeResponse>("/public/vehicle-makes"),
                http.get<VehicleModelResponse>("/public/vehicle-models")
            ]);

            const vehicleTypes = vehicleTypesRes?.data.map((type) => ({
                option: type.name,
                value: type.id
            })) ?? []
    
            const vehicleMakes = vehicleMakesRes?.data.map((make) => ({
                option: make.name,
                value: make.id
            })) ?? []
    
            const vehicleModels: ModelOption[] = vehicleModelRes?.data.map((model) => ({
                option: model.name,
                value: model.id,
                makeId: model.makeId,
            })) ?? []
            setVehicleOptions({
                vehicleTypes,
                vehicleMakes,
                vehicleModels,
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

    const normalizedVehicle = useMemo(
        () => normalizeVehicleOnboardingData(vehicle),
        [vehicle]
    );

    const initialValues: BasicVehicleInformationValues = useMemo(
        () => ({
            name: normalizedVehicle?.name || "",
            city: normalizedVehicle?.city || "",
            address: normalizedVehicle?.address || "",
            latitude: normalizedVehicle?.latitude || 0,
            longitude: normalizedVehicle?.longitude || 0,
            vehicleMakeId: normalizedVehicle?.vehicleMakeId || VEHICLE_MAKE_PLACEHOLDER,
            vehicleModelId: normalizedVehicle?.vehicleModelId || VEHICLE_SELECT_PLACEHOLDER,
            vehicleTypeId: normalizedVehicle?.vehicleTypeId || VEHICLE_SELECT_PLACEHOLDER,
            yearOfRelease: normalizedVehicle?.yearOfRelease || 0,
            hasInsurance:
                normalizedVehicle?.hasInsurance === undefined || normalizedVehicle?.hasInsurance === null
                    ? VEHICLE_SELECT_PLACEHOLDER
                    : normalizedVehicle?.hasInsurance
                        ? "yes"
                        : "no",
            hasTracker:
                normalizedVehicle?.hasTracker === undefined || normalizedVehicle?.hasTracker === null
                    ? VEHICLE_SELECT_PLACEHOLDER
                    : normalizedVehicle?.hasTracker
                        ? "yes"
                        : "no",
            isVehicleUpgraded:
                normalizedVehicle?.isVehicleUpgraded === undefined || normalizedVehicle?.isVehicleUpgraded === null
                    ? VEHICLE_SELECT_PLACEHOLDER
                    : normalizedVehicle?.isVehicleUpgraded
                        ? "yes"
                        : "no",
            yearOfUpgrade: (normalizedVehicle as any)?.yearOfUpgrade || undefined,
        }),
        [normalizedVehicle]
    );

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
        } catch {
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

    const stripPlaceholder = (value: string, placeholder: string) =>
        value === placeholder ? "" : value;

    const buildPayload = (values: BasicVehicleInformationValues) => ({
        ...values,
        vehicleMakeId: stripPlaceholder(values.vehicleMakeId, VEHICLE_MAKE_PLACEHOLDER),
        vehicleModelId: stripPlaceholder(values.vehicleModelId, VEHICLE_SELECT_PLACEHOLDER),
        vehicleTypeId: stripPlaceholder(values.vehicleTypeId, VEHICLE_SELECT_PLACEHOLDER),
        hasTracker: values.hasTracker === "yes",
        hasInsurance: values.hasInsurance === "yes",
        isVehicleUpgraded: values.isVehicleUpgraded === "yes",
    });

    const saveStep1 = useMutation({
        mutationFn: (values: BasicVehicleInformationValues) =>
            vehicleId
                ? http.patch<VehicleInformationResponse>(`/vehicles?id=${vehicleId}`, buildPayload(values))
                : http.post<VehicleInformationResponse>("/vehicles", buildPayload(values)),

        onSuccess: (data) => {
            const id = data?.data?.id;
            if (id) sessionStorage.setItem("vehicleId", id);
            const normalized = normalizeVehicleOnboardingData(data?.data);
            if (normalized) dispatch(updateVehicleInformation(normalized));
            router.push("/listings");
        },

        onError: (error: AxiosError<ErrorResponse>) =>
            handleErrors(error, "Vehicle Onboarding Step 1"),
    });

    const submitStep1 = useMutation({
        mutationFn: (values: BasicVehicleInformationValues) =>
            vehicleId
                ? http.patch<VehicleInformationResponse>(`/vehicles?id=${vehicleId}`, buildPayload(values))
                : http.post<VehicleInformationResponse>("/vehicles", buildPayload(values)),

        onSuccess: (data) => {
            const id = data?.data?.id;
            if (id) sessionStorage.setItem("vehicleId", id);
            const normalized = normalizeVehicleOnboardingData(data?.data);
            if (normalized) dispatch(updateVehicleInformation(normalized));
            setCurrentStep((step) => step + 1);
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
