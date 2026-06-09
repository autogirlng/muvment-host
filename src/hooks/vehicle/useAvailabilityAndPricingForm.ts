"use client";

import { useState, useEffect, useMemo, type Dispatch, type SetStateAction } from "react";
import { useSearchParams } from "next/navigation";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { AxiosError } from "axios";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";

import { handleErrors } from "@/utils/functions";

import {

  AvailabilityAndPricingValues,

  ErrorResponse,

  VehicleInformation,
  VehicleInformationResponse,

  AllDrivers,

  DriverContent,

  AssignNewDriver,

} from "@/types";

import { updateVehicleInformation } from "@/lib/features/vehicleOnboardingSlice";

import { useHttp } from "@/hooks/useHttp";

import { VEHICLE_SELECT_PLACEHOLDER } from "@/utils/constants";
import {
  buildAvailabilityDriverFields,
  getVehicleOutOfBoundsAreaIds,
  mergeVehicleOnboardingState,
  vehicleHasOutskirtConfig,
} from "@/utils/vehicleOnboardingPrefill";
import { getOnboardingVehicleId } from "@/utils/vehicleOnboardingSession";
import { isEditingExistingVehicle } from "@/utils/vehicleOnboardingMode";
import { invalidateListingsCache } from "@/utils/invalidateListingsCache";



function hostExplicitlyChoseDriver(values: AvailabilityAndPricingValues): boolean {

  if (values.willProvideDriver !== "yes") return false;

  if (values.driverMode === "existing") {

    return (

      values.driverId !== VEHICLE_SELECT_PLACEHOLDER && values.driverId.trim().length > 0

    );

  }

  if (values.driverMode === "new") {

    return (

      values.newDriverFirstName.trim().length > 0 &&

      values.newDriverLastName.trim().length > 0 &&

      values.newDriverPhoneNumber.trim().length > 0 &&

      values.newDriverLicenseNumber.trim().length > 0 &&

      values.newDriverLicenseExpiryDate.trim().length > 0

    );

  }

  return false;

}



export default function useAvailabilityAndPricingForm({

  currentStep,

  setCurrentStep,

}: {

  currentStep: number;

  setCurrentStep: Dispatch<SetStateAction<number>>;

}) {

  const http = useHttp();
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();



  const { vehicle } = useAppSelector((state) => state.vehicleOnboarding);

  const { user } = useAppSelector((state) => state.user);

  const [showOuskirts, setShowOuskirts] = useState<boolean>(() =>
    vehicleHasOutskirtConfig(vehicle)
  );

  const [showDiscounts, setShowDiscounts] = useState<boolean>(false);

  useEffect(() => {
    if (vehicleHasOutskirtConfig(vehicle)) {
      setShowOuskirts(true);
    }
  }, [vehicle]);

  const initialValues: AvailabilityAndPricingValues = useMemo(

    () => ({

      maxTripDurationUnit: vehicle?.maxTripDurationUnit || "DAYS",

      maxTripDurationValue: vehicle?.maxTripDurationValue ?? 1,

      advanceNoticeUnit: vehicle?.advanceNoticeUnit || "DAYS",

      advanceNoticeValue: vehicle?.advanceNoticeValue ?? 1,

      willProvideDriver:

        vehicle?.willProvideDriver === undefined || vehicle?.willProvideDriver === null

          ? VEHICLE_SELECT_PLACEHOLDER

          : vehicle?.willProvideDriver

            ? "yes"

            : "no",

      willProvideFuel:

        vehicle?.willProvideFuel === undefined || vehicle?.willProvideFuel === null

          ? VEHICLE_SELECT_PLACEHOLDER

          : vehicle?.willProvideFuel

            ? "yes"

            : "no",

      ...buildAvailabilityDriverFields(vehicle),

      supportedBookingTypeIds: vehicle?.supportedBookingTypes?.map((t) => t.id) || [],

      outOfBoundsAreaIds: getVehicleOutOfBoundsAreaIds(vehicle),

      outskirtFee: 0,

      extremeFee: 0,

    }),

    [vehicle]

  );



  const routeVehicleId = searchParams.get("id") ?? "";
  const vehicleId = routeVehicleId || getOnboardingVehicleId();
  const isEditingExisting = isEditingExistingVehicle(vehicleId, vehicle);



  const driversQuery = useQuery({

    queryKey: ["myDrivers", user?.data.userId, "onboarding"],

    queryFn: () =>

      http.get<AllDrivers>(`/drivers/my-drivers?page=0&size=100`),

    enabled: !!user?.data.userId,

    retry: false,

  });



  const drivers: DriverContent[] = driversQuery.data?.data?.content ?? [];



  const mapValuesToApiPayload = (values: AvailabilityAndPricingValues) => {

    return {

      maxTripDurationUnit: values.maxTripDurationUnit,

      maxTripDurationValue: Number(values.maxTripDurationValue),

      advanceNoticeUnit: values.advanceNoticeUnit,

      advanceNoticeValue: Number(values.advanceNoticeValue),

      supportedBookingTypeIds: values.supportedBookingTypeIds,

      outOfBoundsAreaIds: values.outOfBoundsAreaIds,

      pricing: [],

      discounts: [],

      extraHourlyRate: 0,

      willProvideDriver: values.willProvideDriver === "yes",

      willProvideFuel: values.willProvideFuel === "yes",

    };

  };



  const unassignVehicleDriver = async (targetVehicleId: string) => {

    try {

      await http.delete(`/hosts/vehicle/${targetVehicleId}/assign-driver`);

    } catch {

      // No driver was assigned — safe to ignore.

    }

  };



  const resolveDriverId = async (

    values: AvailabilityAndPricingValues

  ): Promise<string | null> => {

    if (!hostExplicitlyChoseDriver(values)) return null;



    if (values.driverMode === "existing") {

      return values.driverId;

    }



    if (values.driverMode === "new") {

      const payload: AssignNewDriver = {

        firstName: values.newDriverFirstName,

        lastName: values.newDriverLastName,

        phoneNumber: values.newDriverPhoneNumber,

        licenseNumber: values.newDriverLicenseNumber,

        licenseExpiryDate: values.newDriverLicenseExpiryDate,

      };

      const created = await http.post<{ data: { id: string } }>(`/drivers`, payload);

      return created?.data?.id ?? null;

    }



    return null;

  };



  const syncVehicleDriverAssignment = async (

    values: AvailabilityAndPricingValues,

    targetVehicleId: string

  ) => {

    if (values.willProvideDriver !== "yes") {

      await unassignVehicleDriver(targetVehicleId);

      return;

    }



    const driverId = await resolveDriverId(values);

    if (driverId) {

      await http.patch(`/hosts/vehicle/${targetVehicleId}/assign-driver`, { driverId });

      return;

    }



    // Host said yes but did not complete driver selection — clear any auto-assignment.

    await unassignVehicleDriver(targetVehicleId);

  };



  const persistStep4 = async (values: AvailabilityAndPricingValues) => {
    const targetVehicleId = getOnboardingVehicleId();
    const payload = mapValuesToApiPayload(values);

    await http.patch<VehicleInformation>(
      `/vehicles/configuration?id=${targetVehicleId}`,
      payload
    );

    if (targetVehicleId) {
      await syncVehicleDriverAssignment(values, targetVehicleId);
      const refreshed = await http.get<VehicleInformationResponse>(
        `/vehicles/${targetVehicleId}`
      );
      return refreshed?.data ?? null;
    }

    return null;
  };

  const handleStep4Success = (data: VehicleInformation | null) => {
    if (data) {
      dispatch(
        updateVehicleInformation(
          mergeVehicleOnboardingState(vehicle, data as VehicleInformation)
        )
      );
    }
    invalidateListingsCache(queryClient, getOnboardingVehicleId());
  };

  const saveStep4 = useMutation({
    mutationFn: persistStep4,
    onError: (error: AxiosError<ErrorResponse>) =>
      handleErrors(error, "Vehicle Onboarding Step 4"),
  });

  const submitStep4 = useMutation({
    mutationFn: persistStep4,
    onError: (error: AxiosError<ErrorResponse>) =>
      handleErrors(error, "Vehicle Onboarding Step 4"),
  });

  const saveDraft = (
    values: AvailabilityAndPricingValues,
    options?: { onSuccess?: () => void; onSettled?: () => void }
  ) => {
    saveStep4.mutate(values, {
      onSuccess: (data) => {
        handleStep4Success(data as VehicleInformation);
        options?.onSuccess?.();
      },
      onSettled: () => {
        options?.onSettled?.();
      },
    });
  };

  const submit = (
    values: AvailabilityAndPricingValues,
    options?: { onSuccess?: () => void; onSettled?: () => void }
  ) => {
    submitStep4.mutate(values, {
      onSuccess: (data) => {
        handleStep4Success(data as VehicleInformation);
        setCurrentStep((step) => step + 1);
        options?.onSuccess?.();
      },
      onSettled: () => {
        options?.onSettled?.();
      },
    });
  };

  return {
    submitStep4: {
      ...submitStep4,
      mutate: submit,
      isPending: submitStep4.isPending,
    },
    saveStep4: {
      ...saveStep4,
      mutate: saveDraft,
      isPending: saveStep4.isPending,
    },

    vehicle,

    mapValuesToApiPayload,

    initialValues,

    showOuskirts,

    setShowOuskirts,

    showDiscounts,

    setShowDiscounts,

    drivers,

    driversLoading: driversQuery.isLoading,

    isEditingExisting,

  };

}


