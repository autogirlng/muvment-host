"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useHttp } from "@/hooks/useHttp";
import { 
  ApiResponse, 
  PageableResponse, 
  MouItem, 
  MouSubmitPayload, 
  HostTripItem, 
  HostTripsParams 
} from "@/types"; // Adjust path as needed

export function useMou() {
  const http = useHttp();
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  
  const token = session?.user?.accessToken;

  // Utility to build query strings
  const buildQueryString = (params?: Record<string, any>) => {
    if (!params) return "";
    const filteredParams = Object.entries(params).filter(
      ([_, v]) => v !== undefined && v !== null && v !== "",
    );
    if (filteredParams.length === 0) return "";
    return `?${new URLSearchParams(filteredParams.map(([k, v]) => [k, String(v)]))}`;
  };

  // ============== 1. GET /v1/hosts/mou ==============
  const useGetHostMou = () => {
    return useQuery({
      queryKey: ["host", "mou", token],
      queryFn: async (): Promise<ApiResponse<MouItem[]>> => {
        // If your useHttp hook doesn't auto-inject the token, you can pass it in the config here:
        // const config = { headers: { Authorization: `Bearer ${token}` } };
        const result = await http.get<ApiResponse<MouItem[]>>("/hosts/mou");
        if (!result) throw new Error("Failed to fetch MOU submissions");
        return result;
      },
      enabled: !!token, 
    });
  };

  // ============== 2. POST /v1/hosts/mou ==============
  const useSubmitHostMou = () => {
    return useMutation({
      mutationFn: async (payload: MouSubmitPayload): Promise<ApiResponse<MouItem>> => {
        if (!token) throw new Error("Authentication required");

        // Example assuming useHttp exposes a post method
        const result = await http.post<ApiResponse<MouItem>>("/hosts/mou", payload);
        if (!result) throw new Error("Failed to submit MOU");
        return result;
      },
      onSuccess: () => {
        // Automatically refresh the MOU list after a successful submission
        queryClient.invalidateQueries({ queryKey: ["host", "mou"] });
      },
    });
  };

  // ============== 3. GET /v1/host-performance/trips ==============
  const useGetHostTrips = (params?: HostTripsParams) => {
    return useQuery({
      queryKey: ["host-performance", "trips", params, token],
      queryFn: async (): Promise<ApiResponse<PageableResponse<HostTripItem>>> => {
        const queryString = buildQueryString(params);
        const result = await http.get<ApiResponse<PageableResponse<HostTripItem>>>(
          `/host-performance/trips${queryString}`
        );
        if (!result) throw new Error("Failed to fetch host trips");
        return result;
      },
      enabled: !!token,
    });
  };

  return {
    useGetHostMou,
    useSubmitHostMou,
    useGetHostTrips,
  };
}