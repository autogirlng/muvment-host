"use client";

import { useQuery } from "@tanstack/react-query";
import { useAppSelector } from "@/lib/hooks";
import type { HostEarningHistoryResponse } from "@/types";
import { useHttp } from "@/hooks/useHttp";

const EARNING_HISTORY_URL = "/host-performance/earning-history";

export default function useHostEarningHistory({
  enabled = true,
  currentPage = 1,
  pageLimit = 10,
  year,
  month,
}: {
  enabled?: boolean;
  currentPage?: number;
  pageLimit?: number;
  year?: string | number;
  month?: string | number;
}) {
  const http = useHttp();
  const { user } = useAppSelector((state) => state.user);
  const apiPage = Math.max(0, currentPage - 1);

  const { data, isError, error, isLoading, isFetching } = useQuery({
    queryKey: ["hostEarningHistory", user?.data.userId, apiPage, pageLimit, year, month],
    queryFn: () => {
      const params = new URLSearchParams();
      params.append("page", String(apiPage));
      params.append("size", String(pageLimit));
      if (year) params.append("year", String(year));
      if (month) params.append("month", String(month));
      const queryString = params.toString() ? `?${params.toString()}` : "";
      return http.get<HostEarningHistoryResponse>(`${EARNING_HISTORY_URL}${queryString}`);
    },
    enabled: !!user?.data.userId && enabled,
    retry: false,
  });

  const totalEarnings = data?.data?.totalEarnings ?? 0;
  const totalPending = data?.data?.totalPending ?? 0;
  const totalPaid = data?.data?.totalPaid ?? 0;
  const items = data?.data?.hostEarningItems ?? [];
  const bookingItems = data?.data?.bookings?.content ?? [];
  const totalCount = data?.data?.bookings?.totalItems ?? 0;

  return {
    items,
    bookingItems,
    totalCount,
    totalPending,
    totalPaid,
    totalEarnings,
    isError,
    error,
    isLoading,
    isFetching,
  };
}
