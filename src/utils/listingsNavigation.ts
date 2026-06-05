import { ListingStatus } from "@/types";

/** Listings page with Draft status filter applied. */
export function getListingsDraftUrl(): string {
  return `/listings?status=${ListingStatus.DRAFT}`;
}
