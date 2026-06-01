"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useHttp } from "@/hooks/useHttp";
import { useAppSelector } from "@/lib/hooks";
import { ApiResponse, PageableResponse } from "@/types";
import { Dispute, CreateDisputePayload, DisputeFilterParams } from "./types";

export function useHostDeductions() {
  const http = useHttp();
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const userToken = useAppSelector((s) => s.user.userToken);

  const token = session?.user?.accessToken ?? userToken ?? "";

  const buildQueryString = (params?: DisputeFilterParams) => {
    if (!params) return "";
    const filteredParams = Object.entries(params).filter(
      ([_, v]) => v !== undefined && v !== null && v !== "",
    );
    if (filteredParams.length === 0) return "";
    return `?${new URLSearchParams(filteredParams.map(([k, v]) => [k, String(v)]))}`;
  };

  // POST /v1/hosts/deduction/{id}/dispute
  const useDisputeDeduction = () => {
    return useMutation({
      mutationFn: async ({ deductionId, payload }: { deductionId: string; payload: CreateDisputePayload }): Promise<ApiResponse<Dispute>> => {
        if (!token) throw new Error("Authentication required");
        const result = await http.post<ApiResponse<Dispute>>(`/hosts/deduction/${deductionId}/dispute`, payload);
        if (!result) throw new Error("Failed to submit dispute");
        return result;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["host", "disputes"] });
        queryClient.invalidateQueries({ queryKey: ["hostEarningHistory"] });
        queryClient.invalidateQueries({ queryKey: ["hostPendingBalance"] });
      },
    });
  };

  // GET /v1/hosts/deduction/dispute
  const useGetMyDisputes = (params?: DisputeFilterParams) => {
    return useQuery({
      queryKey: ["host", "disputes", params, token],
      queryFn: async (): Promise<ApiResponse<PageableResponse<Dispute>>> => {
        const queryString = buildQueryString(params);
        const result = await http.get<ApiResponse<PageableResponse<Dispute>>>(`/hosts/deduction/dispute${queryString}`);
        if (!result) throw new Error("Failed to fetch host disputes");
        return result;
      },
      enabled: !!token,
    });
  };

  return {
    useDisputeDeduction,
    useGetMyDisputes,
  };
}
