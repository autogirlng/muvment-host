"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAppSelector } from "@/lib/hooks";
import type { HostEarningHistoryResponse } from "@/types";
import { useHttp } from "@/hooks/useHttp";

const EARNING_HISTORY_URL = "/v1/host-performance/earning-history";

export default function useHostEarningHistory({
  currentPage = 1,
  pageLimit = 10,
  enabled = true,
}: {
  currentPage: number;
  pageLimit: number;
  enabled?: boolean;
}) {
  const http = useHttp();
  const { user } = useAppSelector((state) => state.user);

  const { data, isError, error, isLoading, isFetching } = useQuery({
    queryKey: ["hostEarningHistory", user?.data.userId],
    queryFn: () => http.get<HostEarningHistoryResponse>(EARNING_HISTORY_URL),
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
