"use client";

import { useQuery } from "@tanstack/react-query";
import { useAppSelector } from "@/lib/hooks";
import type { HostPendingBalanceResponse } from "@/types";
import { useHttp } from "@/hooks/useHttp";

const PENDING_BALANCE_URL = "/v1/host-performance/pending-balance";

/**
 * Paginated pending balance + booking payout rows (Swagger: `page` 0-based, `size`).
 */
export default function useHostPendingBalance({
  currentPage = 1,
  pageLimit = 10,
}: {
  currentPage: number;
  pageLimit: number;
}) {
  const http = useHttp();
  const { user } = useAppSelector((state) => state.user);

  const apiPage = Math.max(0, currentPage - 1);

  const { data, isError, error, isLoading } = useQuery({
    queryKey: ["hostPendingBalance", user?.data.userId, apiPage, pageLimit],
    queryFn: () =>
      http.get<HostPendingBalanceResponse>(
        `${PENDING_BALANCE_URL}?page=${apiPage}&size=${pageLimit}`
      ),
    enabled: !!user?.data.userId,
    retry: false,
  });

  const payload = data?.data;
  const bookings = payload?.bookings;
  const items = bookings?.content ?? [];
  const totalCount = bookings?.totalItems ?? 0;

  return {
    items,
    totalCount,
    totalAmountToPay: payload?.totalAmountToPay ?? 0,
    totalPaidToHost: payload?.totalPaidToHost ?? 0,
    totalAmountHostHaveMade: payload?.totalAmountHostHaveMade ?? 0,
    totalPages: bookings?.totalPages ?? 0,
    isError,
    error,
    isLoading,
  };
}
