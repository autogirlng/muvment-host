"use client";

import { useQuery } from "@tanstack/react-query";
import { useHttp } from "@/hooks/useHttp";
import { ApiResponse } from "@/types";

export interface PricingSheetItem {
  id: string;
  vehicleMakeName: string;
  vehicleModelName: string;
  startYear: number;
  endYear: number;
  upgradedYear?: number;
  bookingTypeName: string;
  durationInMinutes: number;
  price: number;
  active: boolean;
}

export function usePublicPricing({
  modelId,
  year,
  enabled = true,
}: {
  modelId?: string;
  year?: number;
  enabled?: boolean;
}) {
  const http = useHttp();

  return useQuery({
    queryKey: ["publicPricing", modelId, year],
    queryFn: async () => {
      const params = new URLSearchParams({
        modelId: modelId!,
        year: String(year!),
      });
      const result = await http.get<ApiResponse<PricingSheetItem[]>>(
        `/public/pricing?${params.toString()}`
      );
      return result?.data ?? [];
    },
    enabled: enabled && !!modelId && !!year,
    retry: false,
  });
}
