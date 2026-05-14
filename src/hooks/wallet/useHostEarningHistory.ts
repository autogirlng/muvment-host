"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAppSelector } from "@/lib/hooks";
import type { HostEarningHistoryResponse } from "@/types";
import { useHttp } from "@/hooks/useHttp";

const EARNING_HISTORY_URL = "/host-performance/earning-history";

export default function useHostEarningHistory({
  currentPage = 1,
  pageLimit = 10,
  enabled = true,
  year,
  month,
}: {
  currentPage?: number;
  pageLimit?: number;
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
  const allItems = data?.data?.hostEarningItems ?? [];

  const { paginatedItems, totalCount } = useMemo(() => {
    const sorted = [...allItems].sort(
      (a, b) => new Date(b.paidAt).getTime() - new Date(a.paidAt).getTime()
    );
    const totalCount = sorted.length;
    const start = (currentPage - 1) * pageLimit;
    return {
      paginatedItems: sorted.slice(start, start + pageLimit),
      totalCount,
    };
  }, [allItems, currentPage, pageLimit]);

  return {
    items: paginatedItems,
    totalEarnings,
    totalCount,
    isError,
    error,
    isLoading,
    isFetching,
  };
}
