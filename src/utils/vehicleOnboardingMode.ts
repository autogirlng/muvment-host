import { VehicleInformation, VehicleStatus } from "@/types";

export function isVehicleDraft(
  vehicle?: Pick<VehicleInformation, "status"> | null
): boolean {
  return !vehicle?.status || vehicle.status === VehicleStatus.DRAFT;
}

/** Vehicle was already created — host is updating, not completing a new draft. */
export function isEditingExistingVehicle(
  vehicleId: string | null | undefined,
  vehicle?: Pick<VehicleInformation, "status"> | null
): boolean {
  return !!vehicleId && !!vehicle?.status && vehicle.status !== VehicleStatus.DRAFT;
}
