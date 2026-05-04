"use client";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useHttp } from "@/hooks/useHttp";
import { CalendarValue } from "@/types";
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
  const { data: session } = useSession();
  const token = session?.user?.accessToken;

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
              (filters[1] as Date).setDate((filters[1] as Date).getDate() - 1),
            ),
          )
        : "";
    return { startDate, endDate };
  }, [filters]);

  const { data, isError, isLoading } = useQuery({
    queryKey: ["getNotifications", currentPage, pageLimit, startDate, endDate, token],
    queryFn: async () => {
      const filterQuery = handleFilterQuery({ filters: {}, startDate, endDate });
      
      // FIX 1: Convert UI page (starts at 1) to API page (starts at 0)
      // If TopHeader passes 1, it requests 0 from the API.
      const apiPage = currentPage > 0 ? currentPage - 1 : 0;
      
      // FIX 2: Removed the "/v1" prefix to match your useMou pattern
      const url = `/notification/notification-by-user?page=${apiPage}&size=${pageLimit}${
        filterQuery ? `&${filterQuery}` : ""
      }`;

      const result = await http.get<any>(url);
      
      if (!result) throw new Error("Failed to fetch notifications");
      
      return result;
    },
    enabled: !!token, 
    retry: false,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });

  // Safely extract the deeply nested 'content' array
  // payload handles both Axios wrapper (data.data) or direct fetch (data)
  const payload = data?.data?.data || data?.data || data;
  const contentArray = payload?.content || [];
  const totalElements = payload?.totalElements || 0;

  // Map "type" to "notificationType" so the UI colors/icons render correctly
  const notificationsContent = contentArray.map((notif: any) => ({
    ...notif,
    notificationType: notif.type,
  }));

  return {
    notifications: notificationsContent,
    totalCount: totalElements,
    totalUnread: 0, 
    isError,
    isLoading,
  };
}