"use client";

import { useMemo } from "react";
import { usePublicPricing } from "@/hooks/pricing/usePublicPricing";
import { formatNumberWithCommas } from "@/utils/functions";

type BookingTypePricingPreviewProps = {
  modelId?: string;
  year?: number;
  selectedBookingTypeIds: string[];
  bookingTypes: { option: string; value: string }[];
};

export default function BookingTypePricingPreview({
  modelId,
  year,
  selectedBookingTypeIds,
  bookingTypes,
}: BookingTypePricingPreviewProps) {
  const pricingQuery = usePublicPricing({
    modelId,
    year,
    enabled: !!modelId && !!year && selectedBookingTypeIds.length > 0,
  });

  const selectedNames = useMemo(() => {
    const idToName = new Map(bookingTypes.map((t) => [t.value, t.option]));
    return selectedBookingTypeIds
      .map((id) => idToName.get(id))
      .filter((name): name is string => !!name);
  }, [bookingTypes, selectedBookingTypeIds]);

  const matchedPrices = useMemo(() => {
    const items = pricingQuery.data ?? [];
    return selectedNames
      .map((name) => {
        const match = items.find(
          (item) =>
            item.active &&
            item.bookingTypeName.toLowerCase() === name.toLowerCase()
        );
        return match
          ? { name: match.bookingTypeName, price: match.price }
          : null;
      })
      .filter((row): row is { name: string; price: number } => row !== null);
  }, [pricingQuery.data, selectedNames]);

  if (selectedBookingTypeIds.length === 0) return null;

  return (
    <div className="rounded-2xl border border-primary-100 bg-primary-50/50 p-4 space-y-3">
      <p className="text-sm font-semibold text-grey-800">Platform pricing</p>
      {pricingQuery.isLoading ? (
        <p className="text-xs text-grey-600">Loading prices for selected booking types…</p>
      ) : matchedPrices.length > 0 ? (
        <ul className="space-y-2">
          {matchedPrices.map((row) => (
            <li
              key={row.name}
              className="flex items-center justify-between text-sm text-grey-800"
            >
              <span className="capitalize">{row.name}</span>
              <span className="font-semibold text-primary-600 tabular-nums">
                NGN {formatNumberWithCommas(row.price)}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-xs text-grey-600">
          No platform pricing sheet found for the selected booking types yet.
        </p>
      )}
    </div>
  );
}
