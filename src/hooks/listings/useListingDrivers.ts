import { AxiosError } from "axios";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useAppSelector } from "@/lib/hooks";
import { handleErrors } from "@/utils/functions";
import {
  AssignNewDriver,
  ErrorResponse,
  AllDrivers,
  DriverDetailResponse,
  VehicleAssignedDriver,
} from "@/types";
import { useHttp } from "@/hooks/useHttp";

export default function useListingDrivers(
  vehicleId: string,
  assignedDriver?: VehicleAssignedDriver | null
) {
  const http = useHttp();
  const queryClient = useQueryClient();
  const { user } = useAppSelector((state) => state.user);

  const [createOpen, setCreateOpen] = useState(false);
  const [assignPromptOpen, setAssignPromptOpen] = useState(false);
  const [assignPickerOpen, setAssignPickerOpen] = useState(false);
  const [pendingDriverId, setPendingDriverId] = useState<string | null>(null);

  const invalidateListing = () => {
    queryClient.invalidateQueries({ queryKey: ["getListingById", vehicleId] });
    queryClient.invalidateQueries({ queryKey: ["myDrivers"] });
  };

  const myDriversQuery = useQuery({
    queryKey: ["myDrivers", user?.data.userId, "listing", vehicleId],
    queryFn: () => http.get<AllDrivers>(`/drivers/my-drivers?page=0&size=100`),
    enabled: !!user?.data.userId && !!vehicleId,
    retry: false,
  });

  const hostDrivers = myDriversQuery.data?.data?.content ?? [];
  const hostDriverCount = myDriversQuery.data?.data?.totalItems ?? hostDrivers.length;
  const hasAssignedDriver = !!assignedDriver?.id;

  const showAddDriver = !hasAssignedDriver && hostDriverCount === 0 && !myDriversQuery.isLoading;
  const showAssignDriver = !hasAssignedDriver && hostDriverCount > 0 && !myDriversQuery.isLoading;

  const createDriver = useMutation({
    mutationFn: (values: AssignNewDriver) =>
      http.post<DriverDetailResponse>(`/drivers`, values),
    onSuccess: (response) => {
      const newDriverId = response?.data?.id;
      setCreateOpen(false);
      invalidateListing();
      myDriversQuery.refetch();

      if (newDriverId) {
        setPendingDriverId(newDriverId);
        setAssignPromptOpen(true);
      } else {
        toast.success("Driver created successfully");
      }
    },
    onError: (error: AxiosError<ErrorResponse>) =>
      handleErrors(error, "Create Driver"),
  });

  const assignToVehicle = useMutation({
    mutationFn: (driverId: string) =>
      http.patch(`/hosts/vehicle/${vehicleId}/assign-driver`, { driverId }),
    onSuccess: () => {
      toast.success("Driver assigned to this vehicle");
      setAssignPromptOpen(false);
      setAssignPickerOpen(false);
      setPendingDriverId(null);
      invalidateListing();
    },
    onError: (error: AxiosError<ErrorResponse>) =>
      handleErrors(error, "Assign Driver"),
  });

  const unassignFromVehicle = useMutation({
    mutationFn: () => http.delete(`/hosts/vehicle/${vehicleId}/assign-driver`),
    onSuccess: () => {
      toast.success("Driver unassigned from this vehicle");
      invalidateListing();
    },
    onError: (error: AxiosError<ErrorResponse>) =>
      handleErrors(error, "Unassign Driver"),
  });

  const handleAssignPromptYes = () => {
    if (pendingDriverId) {
      assignToVehicle.mutate(pendingDriverId);
    }
  };

  const handleAssignPromptNo = () => {
    setAssignPromptOpen(false);
    setPendingDriverId(null);
    toast.success("Driver created. You can assign them later.");
  };

  return {
    isLoading: myDriversQuery.isLoading,
    isError: myDriversQuery.isError,
    assignedDriver: hasAssignedDriver ? assignedDriver : null,
    hostDrivers,
    showAddDriver,
    showAssignDriver,
    createOpen,
    setCreateOpen,
    assignPromptOpen,
    setAssignPromptOpen,
    assignPickerOpen,
    setAssignPickerOpen,
    pendingDriverId,
    createDriver,
    assignToVehicle,
    unassignFromVehicle,
    handleAssignPromptYes,
    handleAssignPromptNo,
  };
}
