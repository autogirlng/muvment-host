import { VEHICLE_MAKE_PLACEHOLDER, VEHICLE_SELECT_PLACEHOLDER } from "@/utils/constants";
import type { VehicleInformation } from "@/types";

const PLACEHOLDER_VALUES = new Set([
  VEHICLE_MAKE_PLACEHOLDER,
  VEHICLE_SELECT_PLACEHOLDER,
  "",
]);

function hasValue(value: unknown): boolean {
  if (value === undefined || value === null) return false;
  if (typeof value === "string") {
    return !PLACEHOLDER_VALUES.has(value.trim());
  }
  if (typeof value === "number") return value > 0;
  if (typeof value === "boolean") return true;
  if (Array.isArray(value)) return value.length > 0;
  return true;
}

/** Whether a saved onboarding step has enough data to jump back to it (draft resume). */
export function isOnboardingStepComplete(
  vehicle: VehicleInformation | null | undefined,
  stepIndex: number
): boolean {
  if (!vehicle) return stepIndex === 0;

  switch (stepIndex) {
    case 0:
      return (
        hasValue(vehicle.name) &&
        hasValue(vehicle.vehicleMakeId) &&
        hasValue(vehicle.vehicleModelId) &&
        hasValue(vehicle.vehicleTypeId) &&
        hasValue(vehicle.yearOfRelease) &&
        hasValue(vehicle.city) &&
        hasValue(vehicle.address)
      );
    case 1:
      return (
        hasValue(vehicle.licensePlateNumber) &&
        hasValue(vehicle.stateOfRegistration) &&
        hasValue(vehicle.vehicleColorId) &&
        hasValue(vehicle.numberOfSeats) &&
        hasValue(vehicle.description)
      );
    case 2:
      return (vehicle.photos?.length ?? 0) >= 1;
    case 3:
      return (vehicle.documents?.length ?? 0) >= 1;
    case 4:
      return (
        (vehicle.supportedBookingTypes?.length ?? 0) >= 1 &&
        vehicle.willProvideDriver !== undefined &&
        vehicle.willProvideDriver !== null &&
        vehicle.willProvideFuel !== undefined &&
        vehicle.willProvideFuel !== null
      );
    default:
      return false;
  }
}

/** Highest step index the host may open when resuming a draft. */
export function getMaxReachableOnboardingStep(
  vehicle: VehicleInformation | null | undefined
): number {
  let max = 0;
  for (let i = 0; i < 5; i += 1) {
    if (isOnboardingStepComplete(vehicle, i)) {
      max = i;
    }
  }
  return max;
}

export function canNavigateToOnboardingStep({
  targetStep,
  currentStep,
  vehicle,
  isDraftResume,
  isEditingExisting,
}: {
  targetStep: number;
  currentStep: number;
  vehicle: VehicleInformation | null | undefined;
  isDraftResume: boolean;
  isEditingExisting?: boolean;
}): boolean {
  if (targetStep === currentStep) return false;

  if (isDraftResume || isEditingExisting) {
    return isOnboardingStepComplete(vehicle, targetStep);
  }

  return targetStep < currentStep;
}
