"use client";

import { AxiosError } from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useAppSelector } from "@/lib/hooks";
import { handleErrors } from "@/utils/functions";
import { useHttp } from "@/hooks/useHttp";
import {
  DriverDetailResponse,
  DriverScheduleResponse,
  DriverTripsResponse,
  EditDriverPayload,
  DriverSchedule,
  ErrorResponse,
} from "@/types";

export default function useDriver(driverId: string, weekStartDate?: string) {
  const http = useHttp();
  const queryClient = useQueryClient();
  const { user } = useAppSelector((state) => state.user);
  const enabled = !!user?.data?.userId && !!driverId;

  const invalidateDriver = () =>
    queryClient.invalidateQueries({ queryKey: ["driver", driverId] });

  // GET /drivers/{id}
  const driverQuery = useQuery({
    queryKey: ["driver", driverId],
    queryFn: () => http.get<DriverDetailResponse>(`/drivers/${driverId}`),
    enabled,
    retry: false,
  });

  // GET /drivers/{id}/schedule?weekStartDate=
  const scheduleQuery = useQuery({
    queryKey: ["driverSchedule", driverId, weekStartDate],
    queryFn: () =>
      http.get<DriverScheduleResponse>(
        `/drivers/${driverId}/schedule?weekStartDate=${weekStartDate}`
      ),
    enabled: enabled && !!weekStartDate,
    retry: false,
  });

  // GET /drivers/{id}/trips
  const tripsQuery = useQuery({
    queryKey: ["driverTrips", driverId],
    queryFn: () =>
      http.get<DriverTripsResponse>(`/drivers/${driverId}/trips?page=0&size=20`),
    enabled,
    retry: false,
  });

  // PATCH /drivers/{id}
  const editDriver = useMutation({
    mutationFn: (payload: EditDriverPayload) => http.patch(`/drivers/${driverId}`, payload),
    onSuccess: () => {
      toast.success("Driver details updated");
      invalidateDriver();
    },
    onError: (error: AxiosError<ErrorResponse>) => handleErrors(error, "Edit Driver"),
  });

  // PATCH /drivers/{id}/profile-picture (multipart)
  const updateProfilePicture = useMutation({
    mutationFn: (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      return http.patch(`/drivers/${driverId}/profile-picture`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
    onSuccess: () => {
      toast.success("Profile picture updated");
      invalidateDriver();
    },
    onError: (error: AxiosError<ErrorResponse>) => handleErrors(error, "Update Profile Picture"),
  });

  // PUT /drivers/{id}/schedule
  const saveSchedule = useMutation({
    mutationFn: (schedule: DriverSchedule) => http.put(`/drivers/${driverId}/schedule`, schedule),
    onSuccess: () => {
      toast.success("Schedule saved");
      queryClient.invalidateQueries({ queryKey: ["driverSchedule", driverId] });
    },
    onError: (error: AxiosError<ErrorResponse>) => handleErrors(error, "Save Schedule"),
  });

  return {
    driver: driverQuery.data?.data ?? null,
    isLoading: driverQuery.isLoading,
    isError: driverQuery.isError,

    schedule: scheduleQuery.data?.data ?? null,
    scheduleLoading: scheduleQuery.isLoading,

    trips: tripsQuery.data?.data?.content ?? [],
    tripsLoading: tripsQuery.isLoading,

    editDriver,
    updateProfilePicture,
    saveSchedule,
  };
}
