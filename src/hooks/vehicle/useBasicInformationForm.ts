"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
    VEHICLE_MAKE_PLACEHOLDER,
    VEHICLE_SELECT_PLACEHOLDER,
} from "@/utils/constants";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
    debounce,
    handleErrors,
    parseVehicleCoordinate,
} from "@/utils/functions";
import {
    BasicVehicleInformationValues,
    ErrorResponse,
    VehicleInformationResponse,
    VehicleInfoState,
    VehicleMakeTypeResponse,
    VehicleModelResponse,
    VehicleOnboardingStepsHookProps,
    ModelOption,
} from "@/types";
import { updateVehicleInformation } from "@/lib/features/vehicleOnboardingSlice";
import { useHttp } from "@/hooks/useHttp";
import {
    mergeVehicleOnboardingState,
    normalizeVehicleOnboardingData,
} from "@/utils/vehicleOnboardingPrefill";
import {
    getOnboardingVehicleId,
    setOnboardingVehicleId,
} from "@/utils/vehicleOnboardingSession";
import { invalidateListingsCache } from "@/utils/invalidateListingsCache";

export default function useBasicInformationForm({ setCurrentStep }: VehicleOnboardingStepsHookProps) {
    const http = useHttp();
    const router = useRouter();
    const queryClient = useQueryClient();
    const searchParams = useSearchParams();
    const dispatch = useAppDispatch();

    const { vehicle } = useAppSelector((state) => state.vehicleOnboarding);
    const routeVehicleId = searchParams.get("id");

    useEffect(() => {
        if (routeVehicleId) {
            setOnboardingVehicleId(routeVehicleId);
        }
    }, [routeVehicleId]);

    const [searchAddressQuery, setSearchAddressQuery] = useState("");
    const [vehicleOptions, setVehicleOptions] = useState<VehicleInfoState>({
        vehicleTypes: [],
        vehicleMakes: [],
        vehicleModels: [],
    });
    const [optionsLoaded, setOptionsLoaded] = useState(false);

    const fetchVehicleOptions = async () => {
        const [vehicleTypesRes, vehicleMakesRes, vehicleModelRes] = await Promise.all([
            http.get<VehicleMakeTypeResponse>("/public/vehicle-types"),
            http.get<VehicleMakeTypeResponse>("/public/vehicle-makes"),
            http.get<VehicleModelResponse>("/public/vehicle-models"),
        ]);

        const vehicleTypes =
            vehicleTypesRes?.data.map((type) => ({
                option: type.name,
                value: type.id,
            })) ?? [];

        const vehicleMakes =
            vehicleMakesRes?.data.map((make) => ({
                option: make.name,
                value: make.id,
            })) ?? [];

        const vehicleModels: ModelOption[] =
            vehicleModelRes?.data.map((model) => ({
                option: model.name,
                value: model.id,
                makeId: model.makeId,
            })) ?? [];

        setVehicleOptions({
            vehicleTypes,
            vehicleMakes,
            vehicleModels,
        });
        setOptionsLoaded(true);
    };

    useEffect(() => {
        setOptionsLoaded(false);
        fetchVehicleOptions();
    }, []);

    const [googlePlaces, setGooglePlaces] = useState<
        {
            formattedAddress: string;
            location: { latitude: number; longitude: number };
        }[]
    >([]);

    const [searchAddressError, setSearchAddressError] = useState("");
    const [searchAddressLoading, setSearchAddressLoading] = useState(false);
    const [showAddressList, setShowAddressList] = useState(false);

    const normalizedVehicle = useMemo(
        () => normalizeVehicleOnboardingData(vehicle),
        [vehicle]
    );

    useEffect(() => {
        if (normalizedVehicle?.address?.trim()) {
            setSearchAddressQuery(normalizedVehicle.address);
        }
    }, [normalizedVehicle?.address]);

    const vehicleTypesWithCurrent = useMemo(() => {
        const types = [...vehicleOptions.vehicleTypes];
        const typeId = normalizedVehicle?.vehicleTypeId;
        const typeName =
            (vehicle as { vehicleType?: { name?: string }; vehicleTypeName?: string })
                ?.vehicleType?.name ??
            (vehicle as { vehicleTypeName?: string })?.vehicleTypeName;
        if (typeId && typeName && !types.some((t) => t.value === typeId)) {
            types.unshift({ value: typeId, option: typeName });
        }
        return types;
    }, [vehicleOptions.vehicleTypes, normalizedVehicle?.vehicleTypeId, vehicle]);

    const vehicleMakesWithCurrent = useMemo(() => {
        const makes = [...vehicleOptions.vehicleMakes];
        const makeId = normalizedVehicle?.vehicleMakeId;
        const makeName = (vehicle as { vehicleMake?: { name?: string } })?.vehicleMake?.name;
        if (makeId && makeName && !makes.some((m) => m.value === makeId)) {
            makes.unshift({ value: makeId, option: makeName });
        }
        return makes;
    }, [vehicleOptions.vehicleMakes, normalizedVehicle?.vehicleMakeId, vehicle]);

    const vehicleModelsWithCurrent = useMemo(() => {
        const models = [...vehicleOptions.vehicleModels];
        const modelId = normalizedVehicle?.vehicleModelId;
        const modelName = (vehicle as { vehicleModel?: { name?: string } })?.vehicleModel?.name;
        if (modelId && modelName && !models.some((m) => m.value === modelId)) {
            models.unshift({
                value: modelId,
                option: modelName,
                makeId: normalizedVehicle?.vehicleMakeId ?? "",
            });
        }
        return models;
    }, [
        vehicleOptions.vehicleModels,
        normalizedVehicle?.vehicleModelId,
        normalizedVehicle?.vehicleMakeId,
        vehicle,
    ]);

    const initialValues: BasicVehicleInformationValues = useMemo(
        () => ({
            name: normalizedVehicle?.name || "",
            city: normalizedVehicle?.city || "",
            address: normalizedVehicle?.address || "",
            latitude: parseVehicleCoordinate(normalizedVehicle?.latitude),
            longitude: parseVehicleCoordinate(normalizedVehicle?.longitude),
            vehicleMakeId: normalizedVehicle?.vehicleMakeId || VEHICLE_MAKE_PLACEHOLDER,
            vehicleModelId: normalizedVehicle?.vehicleModelId || VEHICLE_SELECT_PLACEHOLDER,
            vehicleTypeId: normalizedVehicle?.vehicleTypeId || VEHICLE_SELECT_PLACEHOLDER,
            yearOfRelease: normalizedVehicle?.yearOfRelease || 0,
            hasInsurance:
                normalizedVehicle?.hasInsurance === undefined ||
                normalizedVehicle?.hasInsurance === null
                    ? VEHICLE_SELECT_PLACEHOLDER
                    : normalizedVehicle?.hasInsurance
                      ? "yes"
                      : "no",
            hasTracker:
                normalizedVehicle?.hasTracker === undefined ||
                normalizedVehicle?.hasTracker === null
                    ? VEHICLE_SELECT_PLACEHOLDER
                    : normalizedVehicle?.hasTracker
                      ? "yes"
                      : "no",
            isVehicleUpgraded:
                normalizedVehicle?.isVehicleUpgraded === undefined ||
                normalizedVehicle?.isVehicleUpgraded === null
                    ? VEHICLE_SELECT_PLACEHOLDER
                    : normalizedVehicle?.isVehicleUpgraded
                      ? "yes"
                      : "no",
            yearOfUpgrade: (normalizedVehicle as { yearOfUpgrade?: number })?.yearOfUpgrade || undefined,
        }),
        [normalizedVehicle]
    );

    const fetchPlaces = async (query: string) => {
        setSearchAddressLoading(true);
        setSearchAddressError("");

        try {
            const response = await axios.post(
                `https://places.googleapis.com/v1/places:searchText`,
                { textQuery: query },
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
        debounce((query: string) => {
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
        latitude: parseVehicleCoordinate(values.latitude),
        longitude: parseVehicleCoordinate(values.longitude),
        vehicleMakeId: stripPlaceholder(values.vehicleMakeId, VEHICLE_MAKE_PLACEHOLDER),
        vehicleModelId: stripPlaceholder(values.vehicleModelId, VEHICLE_SELECT_PLACEHOLDER),
        vehicleTypeId: stripPlaceholder(values.vehicleTypeId, VEHICLE_SELECT_PLACEHOLDER),
        hasTracker: values.hasTracker === "yes",
        hasInsurance: values.hasInsurance === "yes",
        isVehicleUpgraded: values.isVehicleUpgraded === "yes",
    });

    const persistStep1 = (values: BasicVehicleInformationValues) => {
        const vehicleId = getOnboardingVehicleId();
        return vehicleId
            ? http.patch<VehicleInformationResponse>(`/vehicles?id=${vehicleId}`, buildPayload(values))
            : http.post<VehicleInformationResponse>("/vehicles", buildPayload(values));
    };

    const handleStep1Success = (data: VehicleInformationResponse) => {
        const id = data?.data?.id;
        if (id) setOnboardingVehicleId(id);
        const normalized = normalizeVehicleOnboardingData(data?.data);
        if (normalized) {
            dispatch(
                updateVehicleInformation(
                    mergeVehicleOnboardingState(vehicle, normalized)
                )
            );
        }
        invalidateListingsCache(queryClient, id);
    };

    const saveStep1 = useMutation({
        mutationFn: persistStep1,
        onError: (error: AxiosError<ErrorResponse>) =>
            handleErrors(error, "Vehicle Onboarding Step 1"),
    });

    const submitStep1 = useMutation({
        mutationFn: persistStep1,
        onError: (error: AxiosError<ErrorResponse>) =>
            handleErrors(error, "Vehicle Onboarding Step 1"),
    });

    const saveDraft = (values: BasicVehicleInformationValues) => {
        saveStep1.mutate(values, {
            onSuccess: (data) => {
                handleStep1Success(data);
                router.push("/listings");
            },
        });
    };

    const submit = (values: BasicVehicleInformationValues) => {
        submitStep1.mutate(values, {
            onSuccess: (data) => {
                handleStep1Success(data);
                setCurrentStep((step) => step + 1);
            },
        });
    };

    const isVehicleSynced = !routeVehicleId || vehicle?.id === routeVehicleId;

    const isFormReady =
        optionsLoaded &&
        (!routeVehicleId || (isVehicleSynced && !!normalizedVehicle));

    return {
        submitStep1: { ...submitStep1, mutate: submit, isPending: submitStep1.isPending },
        saveStep1: { ...saveStep1, mutate: saveDraft, isPending: saveStep1.isPending },
        vehicle,
        routeVehicleId,
        isFormReady,
        initialValues,
        searchAddressQuery,
        googlePlaces,
        searchAddressError,
        searchAddressLoading,
        setSearchAddressQuery,
        showAddressList,
        setShowAddressList,
        vehicleOptions: {
            vehicleTypes: vehicleTypesWithCurrent,
            vehicleMakes: vehicleMakesWithCurrent,
            vehicleModels: vehicleModelsWithCurrent,
        },
    };
}
