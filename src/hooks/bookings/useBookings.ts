"use client";

import { useQuery } from "@tanstack/react-query";
import { useAppSelector } from "@/lib/hooks";
import { useHttp } from "@/hooks/useHttp";
import { handleFilterQuery } from "@/utils/functions";
import { BookingsDataType, BookingSegments} from "@/types";


export default function useBookings({
  currentPage = 1,
  pageLimit = 10,
  search='',
  filters={},
}: {
  currentPage: number;
  pageLimit: number;
  search?: string;
  filters?: Record<string, string[]>;
}) {
  const http = useHttp();
  const { user } = useAppSelector((state) => state.user);

  const { data, isError, error, isLoading, isSuccess } = useQuery({
    queryKey: ["getBookings", user?.data.userId, currentPage, search, filters],

    queryFn: async () =>
      http.get<BookingSegments>(
        // `/v1/bookings/my-vehicles/segments?page=${currentPage}&limit=${pageLimit}&${handleFilterQuery({ filters, search })}`
        `/v1/bookings/my-vehicles/segments?${handleFilterQuery({ filters, search })}`
      ),

    enabled: !!user?.data.userId,
    retry: false,
  });

  return {
    bookings: data?.data.content || [],
    totalCount: data?.data.totalItems || 0,
    isError,
    error,
    isLoading,
    isSuccess,
  };
}
