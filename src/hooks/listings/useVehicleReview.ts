"use client";

import { useQuery } from "@tanstack/react-query";
import { useAppSelector } from "@/lib/hooks";
import { useHttp } from "@/hooks/useHttp";
import { Reviews } from "@/types";

export default function useVehicleReview({
  id,
  currentPage = 1,
  pageLimit = 10,
}: {
  id: string;
  currentPage: number;
  pageLimit: number;
}) {
  const http = useHttp();

  const { user } = useAppSelector((state) => state.user);

  const { data, isError, isLoading } = useQuery({
    queryKey: ["getVehicleReviews", user?.data.userId, id],

    queryFn: () =>
      http.get<Reviews>(
        `/api/reviews/findonebooking/${id}?page=${currentPage}&limit=${pageLimit}`
      ),
    enabled: !!user?.data.userId && !!id,
    retry: false,
  });

  return {
    vehicleReviews: data?.data || [],
    totalCount: data?.totalCount || 0,
    isError,
    isLoading,
  };
}
