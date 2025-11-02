"use client";

import { useQuery } from "@tanstack/react-query";
import { useHttp } from "@/hooks//useHttp";
import { useAppSelector } from "@/lib/hooks";
import {  ListingDataType, HostVehicleListings } from "@/types";
import { handleFilterQuery } from "@/utils/functions";

export default function useListings({
  currentPage,
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
    queryKey: ["getListings", user?.data.userId, currentPage, JSON.stringify(filters), search],
    queryFn: () =>
      http.get<HostVehicleListings>(
        `/v1/hosts/my-vehicles?size=${pageLimit}&page=${currentPage}&${handleFilterQuery({filters, search})}`
      
      ), 
    enabled: !!user?.data.userId,
    retry: false,
  });
  return {
    listings: data?.data.content || [],
    totalCount: data?.data.totalItems || 0,
    isError,
    isLoading,
  };
}
