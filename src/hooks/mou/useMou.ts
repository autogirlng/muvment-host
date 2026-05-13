"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useHttp } from "@/hooks/useHttp";
import { useAppSelector } from "@/lib/hooks";
import {
  ApiResponse,
  PageableResponse,
  MouItem,
  MouSubmitPayload,
  HostTripItem,
  HostTripsParams,
} from "@/types";
import { baseAPIURL } from "@/utils/constants";

export function useMou() {
  const http = useHttp();
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const userToken = useAppSelector((s) => s.user.userToken);

  const token = session?.user?.accessToken ?? userToken ?? "";

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
        const result = await http.post<ApiResponse<MouItem>>("/hosts/mou", payload);
        if (!result) throw new Error("Failed to submit MOU");
        return result;
      },
      onSuccess: () => {
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

  // ============== 4. GET /v1/hosts/mou/{hostMouId}/download ==============
  const useDownloadHostMou = () => {
    return useMutation({
      mutationFn: async (hostMouId: string) => {
        if (!token) throw new Error("Authentication required");
        /** 
         * Using standard fetch to bypass the useHttp interceptor 
         * because a 403 on this specific endpoint shouldn't force a global logout.
         */
        const response = await fetch(`${baseAPIURL}/hosts/mou/${hostMouId}/download`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(response.status === 403 ? "You do not have permission to download this MOU" : "Failed to download MOU");
        }

        const blob = await response.blob();

        // Convert the blob to a downloadable URL
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `MOU_${hostMouId}.pdf`);
        document.body.appendChild(link);
        link.click();

        // Clean up
        link.remove();
        window.URL.revokeObjectURL(url);
      },
    });
  };

  return {
    useGetHostMou,
    useSubmitHostMou,
    useGetHostTrips,
    useDownloadHostMou,
  };
}