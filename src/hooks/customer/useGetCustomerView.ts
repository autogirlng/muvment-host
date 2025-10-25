import { useHttp } from "@/hooks/useHttp";
import { useAppSelector } from "@/lib/hooks";
import { VehicleInformation } from "@/types";
import { useQuery } from "@tanstack/react-query";

export default function useGetCustomerView({ id }: { id: string }) {
  const http = useHttp();
  const { user } = useAppSelector((state) => state.user);

  const { data, isError, isLoading, isSuccess } = useQuery({
    queryKey: ["getCustomerView", id],
    queryFn: async () =>
      http.get<VehicleInformation | null>(`/api/vehicle-onboarding/${id}`),
    enabled: !!user?.data.userId && !!id,
    retry: false,
  });

  return {
    vehicle: data,
    isError,
    isLoading,
    isSuccess,
  };
}
