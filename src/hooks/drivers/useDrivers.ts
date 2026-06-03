"use client";

import { AxiosError } from "axios";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useAppSelector } from "@/lib/hooks";
import { handleErrors } from "@/utils/functions";
import { AssignNewDriver, ErrorResponse, AllDrivers } from "@/types";
import { useHttp } from "@/hooks/useHttp";

export interface AssignDriverToVehiclePayload {
  driverId: string;
  vehicleId: string;
}

export default function useDrivers({
  page = 0,
  size = 10,
  searchTerm = "",
}: {
  page?: number;
  size?: number;
  searchTerm?: string;
} = {}) {
  const http = useHttp();
  const queryClient = useQueryClient();
  const { user } = useAppSelector((state) => state.user);

  const [createOpen, setCreateOpen] = useState(false);
  const [assignDriver, setAssignDriver] = useState<{ id: string; name: string } | null>(null);

  const driversQuery = useQuery({
    queryKey: ["myDrivers", user?.data?.userId, page, size, searchTerm],
    queryFn: () => {
      const params = new URLSearchParams({ page: String(page), size: String(size) });
      if (searchTerm.trim()) params.set("searchTerm", searchTerm.trim());
      return http.get<AllDrivers>(`/drivers/my-drivers?${params.toString()}`);
    },
    enabled: !!user?.data?.userId,
    retry: false,
  });

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["myDrivers", user?.data?.userId] });

  // POST /drivers — create a new driver
  const createDriver = useMutation({
    mutationFn: (values: AssignNewDriver) => http.post<AssignNewDriver>(`/drivers`, values),
    onSuccess: () => {
      toast.success("Driver created successfully");
      setCreateOpen(false);
      invalidate();
    },
    onError: (error: AxiosError<ErrorResponse>) => handleErrors(error, "Create Driver"),
  });

  // PATCH /drivers/{id}/status — enable/disable a driver
  const toggleStatus = useMutation({
    mutationFn: ({ driverId, isActive }: { driverId: string; isActive: boolean }) =>
      http.patch(`/drivers/${driverId}/status`, { isActive }),
    onSuccess: () => {
      toast.success("Driver status updated");
      invalidate();
    },
    onError: (error: AxiosError<ErrorResponse>) => handleErrors(error, "Update Driver Status"),
  });

  // Assign an existing driver to a vehicle.
  // NOTE: confirm exact endpoint/payload with backend ("HOST assign a driver to the HOST car").
  const assignToVehicle = useMutation({
    mutationFn: ({ driverId, vehicleId }: AssignDriverToVehiclePayload) =>
      http.patch(`/drivers/${driverId}/assign`, { vehicleId }),
    onSuccess: () => {
      toast.success("Driver assigned to vehicle");
      setAssignDriver(null);
      invalidate();
    },
    onError: (error: AxiosError<ErrorResponse>) => handleErrors(error, "Assign Driver To Vehicle"),
  });

  return {
    drivers: driversQuery.data?.data?.content ?? [],
    totalCount: driversQuery.data?.data?.totalItems ?? 0,
    isLoading: driversQuery.isLoading,
    isError: driversQuery.isError,

    createOpen,
    setCreateOpen,
    createDriver,

    toggleStatus,

    assignDriver,
    setAssignDriver,
    assignToVehicle,
  };
}
