import type { QueryClient } from "@tanstack/react-query";

/** Invalidate listing and vehicle queries after onboarding or listing mutations. */
export function invalidateListingsCache(
  queryClient: QueryClient,
  vehicleId?: string | null
) {
  queryClient.invalidateQueries({ queryKey: ["getListings"] });
  queryClient.invalidateQueries({ queryKey: ["getListingById"] });
  if (vehicleId) {
    queryClient.invalidateQueries({ queryKey: ["getVehicleById", vehicleId] });
  }
}
