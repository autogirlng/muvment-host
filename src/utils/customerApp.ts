export const customerBookingAppUrl =
  process.env.NEXT_PUBLIC_CUSTOMER_APP_URL?.replace(/\/+$/, "") ??
  "https://muvment-customer-app.vercel.app";

type CustomerVehicleUrlParams = {
  slug: string;
  vehicleType: string;
  bookingTypeId: string;
};

/** Customer booking detail page (slug + vehicleType + bookingType query params). */
export function getCustomerVehicleUrl({
  slug,
  vehicleType,
  bookingTypeId,
}: CustomerVehicleUrlParams): string {
  const params = new URLSearchParams({
    vehicleType: vehicleType.trim().toUpperCase(),
    bookingType: bookingTypeId,
  });
  return `${customerBookingAppUrl}/booking/details/${slug}?${params.toString()}`;
}

type ListingCustomerLinkInput = {
  slug?: string;
  vehicleTypeName?: string;
  vehicleType?: { name?: string };
  supportedBookingTypes?: { id: string }[];
};

export function getCustomerVehicleUrlFromListing(
  listing: ListingCustomerLinkInput
): string | null {
  const slug = listing.slug?.trim();
  const vehicleType =
    listing.vehicleTypeName?.trim() || listing.vehicleType?.name?.trim();
  const bookingTypeId = listing.supportedBookingTypes?.[0]?.id;

  if (!slug || !vehicleType || !bookingTypeId) return null;

  return getCustomerVehicleUrl({ slug, vehicleType, bookingTypeId });
}
