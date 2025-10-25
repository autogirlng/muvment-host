"use client";

import { useQuery } from "@tanstack/react-query";
import { useAppSelector } from "@/lib/hooks";
import { BookingsDataType } from "@/types";
import { useHttp } from "@/hooks/useHttp";



export default function useUpcomingBookings({
  currentPage = 1,
  pageLimit = 10,
}: {
  currentPage: number;
  pageLimit: number;
}) {
  const http = useHttp();
  const { user } = useAppSelector((state) => state.user);

  const { data, isError, isLoading, isSuccess } = useQuery({
    queryKey: ["getUpcomingBookings",user?.data.userId, currentPage],

    queryFn: async () =>
      http.get<BookingsDataType>(
        `/api/bookings/host/upcoming/${user?.data.userId}?page=${currentPage}&limit=${pageLimit}`
      ),
    enabled: !!user?.data.userId,
    retry: false,
  });


  return {
    upcomingBookings: data?.data || [],
    totalCount: data?.totalCount || 0,
    isError,
    isLoading,
    isSuccess,
  };
}
