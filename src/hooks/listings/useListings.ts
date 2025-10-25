"use client";

import { useQuery } from "@tanstack/react-query";
import { useHttp } from "@/hooks//useHttp";
import { useAppSelector } from "@/lib/hooks";
import {  ListingDataType } from "@/types";
import { handleFilterQuery } from "@/utils/functions";

export default function useListings({
  currentPage = 1,
  pageLimit = 10,
  filters = {},
  search = "",
}: {
  currentPage: number;
  pageLimit: number;
  filters?: Record<string, string[]>;
  search?: string;
}) {
  const http = useHttp();
  const { user } = useAppSelector((state) => state.user);

  const { data, isError, isLoading } = useQuery({
    queryKey: ["getListings", user?.data.userId , currentPage, filters, search],

    queryFn: () =>
      http.get<ListingDataType>(
        `/api/listings/host/${user?.data.userId}?page=${currentPage}&limit=${pageLimit}&${handleFilterQuery({ filters, search })}`
      ),
    enabled: !!user?.data.userId,
    retry: false,
  });

  return {
    listings: data?.data || [],
    totalCount: data?.totalCount || 0,
    isError,
    isLoading,
  };
}
