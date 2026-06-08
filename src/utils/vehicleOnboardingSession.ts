import {
  clearVehicleOnboarding,
  updateVehicleInformation,
} from "@/lib/features/vehicleOnboardingSlice";
import { getClientStore } from "@/lib/storeHolder";
import { VehicleInformationStepper } from "@/types";
import { normalizeVehicleOnboardingData } from "@/utils/vehicleOnboardingPrefill";

const VEHICLE_ID_KEY = "vehicleId";
const SUBMITTED_VEHICLE_ID_KEY = "submittedVehicleId";
const SUBMITTED_VEHICLE_NAME_KEY = "submittedVehicleName";

/** Clear persisted onboarding vehicle so a new listing does not reuse a prior draft. */
export function resetVehicleOnboardingSession() {
  if (typeof window !== "undefined") {
    sessionStorage.removeItem(VEHICLE_ID_KEY);
    sessionStorage.removeItem(SUBMITTED_VEHICLE_ID_KEY);
    sessionStorage.removeItem(SUBMITTED_VEHICLE_NAME_KEY);
  }
  getClientStore()?.dispatch(clearVehicleOnboarding());
}

export function setOnboardingVehicleId(vehicleId: string) {
  if (typeof window !== "undefined") {
    sessionStorage.setItem(VEHICLE_ID_KEY, vehicleId);
  }
}

export function getOnboardingVehicleId(): string {
  if (typeof window === "undefined") return "";
  return sessionStorage.getItem(VEHICLE_ID_KEY) ?? "";
}

/**
 * Prime Redux + session before navigating to edit so type/make/model prefill
 * immediately from listing data (table row or detail page).
 */
export function beginVehicleEdit(
  listing: Pick<VehicleInformationStepper, "id"> & Partial<VehicleInformationStepper>
) {
  if (typeof window === "undefined") return;

  getClientStore()?.dispatch(clearVehicleOnboarding());
  sessionStorage.removeItem(SUBMITTED_VEHICLE_ID_KEY);
  sessionStorage.removeItem(SUBMITTED_VEHICLE_NAME_KEY);
  setOnboardingVehicleId(listing.id);

  const normalized = normalizeVehicleOnboardingData(
    listing as VehicleInformationStepper
  );
  if (normalized) {
    getClientStore()?.dispatch(updateVehicleInformation(normalized));
  }
}
