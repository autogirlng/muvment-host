"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAppSelector } from "@/lib/hooks";
import type { HostEarningHistoryResponse } from "@/types";
import { useHttp } from "@/hooks/useHttp";

const EARNING_HISTORY_URL = "/host-performance/earning-history";

export default function useHostEarningHistory({
  enabled = true,
  year,
  month,
}: {
  enabled?: boolean;
  year?: string | number;
  month?: string | number;
}) {
  const http = useHttp();
  const { user } = useAppSelector((state) => state.user);

  const { data, isError, error, isLoading, isFetching } = useQuery({
    queryKey: ["hostEarningHistory", user?.data.userId, year, month],
    queryFn: () => {
      const params = new URLSearchParams();
      if (year) params.append("year", String(year));
      if (month) params.append("month", String(month));
      const queryString = params.toString() ? `?${params.toString()}` : "";
      return http.get<HostEarningHistoryResponse>(`${EARNING_HISTORY_URL}${queryString}`);
    },
    enabled: !!user?.data.userId && enabled,
    retry: false,
  });

  const totalEarnings = data?.data?.totalEarnings ?? 0;
  const items = data?.data?.hostEarningItems ?? [];

  return {
    items,
    totalEarnings,
    isError,
    error,
    isLoading,
    isFetching,
  };
}
