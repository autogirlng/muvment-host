"use client";

import { useQuery } from "@tanstack/react-query";
import { useAppSelector } from "@/lib/hooks";
import { BookingsDataType, UpcomingBookings } from "@/types";
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
      http.get<UpcomingBookings>(
        `/v1/bookings/upcoming-booking`
      ),
    enabled: !!user?.data.userId,
    retry: false,
  });
  console.log(data)


  return {
    upcomingBookings: data?.data.content || [],
    totalCount: data?.data.totalElements || 0,
    isError,
    isLoading,
    isSuccess,
  };
}
