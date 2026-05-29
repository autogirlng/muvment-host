"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useHttp } from "@/hooks/useHttp";
import { useAppSelector } from "@/lib/hooks";
import { ApiResponse, PageableResponse } from "@/types";
import { Complaint, CreateComplaintPayload, ComplaintsFilterParams } from "./types";

export function useHostComplaints() {
  const http = useHttp();
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const userToken = useAppSelector((s) => s.user.userToken);

  const token = session?.user?.accessToken ?? userToken ?? "";

  const buildQueryString = (params?: ComplaintsFilterParams) => {
    if (!params) return "";
    const filteredParams = Object.entries(params).filter(
      ([_, v]) => v !== undefined && v !== null && v !== "",
    );
    if (filteredParams.length === 0) return "";
    return `?${new URLSearchParams(filteredParams.map(([k, v]) => [k, String(v)]))}`;
  };

  // ============== 1. POST /v1/complaints ==============
  const useCreateComplaint = () => {
    return useMutation({
      mutationFn: async (payload: CreateComplaintPayload): Promise<ApiResponse<Complaint>> => {
        if (!token) throw new Error("Authentication required");
        const result = await http.post<ApiResponse<Complaint>>("/complaints", payload);
        if (!result) throw new Error("Failed to create complaint");
        return result;
      },
      onSuccess: () => {
        // Refresh the host's complaint list after successfully creating one
        queryClient.invalidateQueries({ queryKey: ["host", "complaints"] });
      },
    });
  };

  // ============== 2. GET /v1/complaints ==============
  const useGetMyComplaints = (params?: ComplaintsFilterParams) => {
    return useQuery({
      queryKey: ["host", "complaints", params, token],
      queryFn: async (): Promise<ApiResponse<PageableResponse<Complaint>>> => {
        const queryString = buildQueryString(params);
        const result = await http.get<ApiResponse<PageableResponse<Complaint>>>(
          `/complaints${queryString}`
        );
        if (!result) throw new Error("Failed to fetch complaints");
        return result;
      },
      enabled: !!token,
    });
  };

  // ============== 3. GET /v1/complaints/{id} ==============
  const useGetComplaintDetails = (complaintId: string | null) => {
    return useQuery({
      queryKey: ["host", "complaint-detail", complaintId, token],
      queryFn: async (): Promise<ApiResponse<Complaint>> => {
        const result = await http.get<ApiResponse<Complaint>>(`/complaints/${complaintId}`);
        if (!result) throw new Error("Failed to fetch complaint details");
        return result;
      },
      enabled: !!token && !!complaintId,
    });
  };

  return {
    useCreateComplaint,
    useGetMyComplaints,
    useGetComplaintDetails,
  };
}
