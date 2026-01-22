"use client";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useHttp } from "@/hooks/useHttp";
import { useAppSelector } from "@/lib/hooks";
import { CalendarValue, NotificationDataType } from "@/types";
import { handleFilterQuery } from "@/utils/functions";


export default function useNotifications({
  currentPage,
  pageLimit,
  filters = null,
}: {
  currentPage: number;
  pageLimit: number;
  filters?: CalendarValue;
}) {
  const http = useHttp();
  const { user } = useAppSelector((state) => state.user);

  const formatDate = (date: Date | null): string => {
    return date ? date.toISOString().split("T")[0] : "";
  };

  const { startDate, endDate } = useMemo(() => {
    const startDate =
      filters && Array.isArray(filters) ? formatDate(filters[0] as Date) : "";
    const endDate =
      filters && Array.isArray(filters) && filters[1]
        ? formatDate(
            new Date(
              (filters[1] as Date).setDate((filters[1] as Date).getDate() - 1)
            )
          )
        : "";
    return { startDate, endDate };
  }, [filters]);

  const { data, isError, isLoading } = useQuery({
    queryKey: ["getNotifications", currentPage, pageLimit, startDate, endDate],
    queryFn: () =>
      http.get<NotificationDataType>(
        `/api/notifications?page=${currentPage}&limit=${pageLimit}&${handleFilterQuery({ filters: {}, startDate, endDate })}`
      ),
    enabled: !!user?.data.userId,
    retry: false,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });

  return {
    notifications: data?.data ?? [],
    totalCount: data?.totalCount ?? 0,
    totalUnread: data?.unreadCount ?? 0,
    isError,
    isLoading,
  };
}
