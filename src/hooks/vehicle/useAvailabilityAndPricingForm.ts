"use client";

import { useState, useEffect, useMemo } from "react";

import { useMutation, useQuery } from "@tanstack/react-query";

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

  setCurrentStep: (step: number) => void;

}) {

  const http = useHttp();

  const dispatch = useAppDispatch();



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

      outskirtFee: vehicle?.outskirtFee ?? 0,

      extremeFee: vehicle?.extremeFee ?? 0,

    }),

    [vehicle]

  );



  const [vehicleId, setVehicleId] = useState<string>("");

  useEffect(() => {
    setVehicleId(getOnboardingVehicleId());
  }, []);

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

      outskirtFee: Number(values.outskirtFee),

      extremeFee: Number(values.extremeFee),

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
    const payload = mapValuesToApiPayload(values);

    await http.patch<VehicleInformation>(
      `/vehicles/configuration?id=${vehicleId}`,
      payload
    );

    if (vehicleId) {
      await syncVehicleDriverAssignment(values, vehicleId);
      const refreshed = await http.get<VehicleInformationResponse>(
        `/vehicles/${vehicleId}`
      );
      return refreshed?.data ?? null;
    }

    return null;
  };

  const saveStep4 = useMutation({

    mutationFn: persistStep4,

    onSuccess: (data) => {
      if (data) {
        dispatch(
          updateVehicleInformation(
            mergeVehicleOnboardingState(vehicle, data as VehicleInformation)
          )
        );
      }
    },



    onError: (error: AxiosError<ErrorResponse>) =>

      handleErrors(error, "Vehicle Onboarding Step 4"),

  });



  const submitStep4 = useMutation({

    mutationFn: persistStep4,

    onSuccess: (data) => {
      if (data) {
        dispatch(
          updateVehicleInformation(
            mergeVehicleOnboardingState(vehicle, data as VehicleInformation)
          )
        );
      }

      if (!isEditingExisting) {
        setCurrentStep(currentStep + 1);
      }
    },



    onError: (error: AxiosError<ErrorResponse>) =>

      handleErrors(error, "Vehicle Onboarding Step 4"),

  });



  return {

    submitStep4,

    saveStep4,

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


