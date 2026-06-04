import { useHttp } from "@/hooks/useHttp";
import { useAppSelector } from "@/lib/hooks";
import { VehicleInformationResponse, VehicleInformationStepper } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export default function useGetListingById({ id }: { id: string }) {
  const http = useHttp();
  const { user } = useAppSelector((state) => state.user);

  const userId = user?.data?.userId ?? (user as any)?.userId ?? "";

  const { data, isError, isLoading } = useQuery({
    queryKey: ["getListingById", id, userId],
    queryFn: async () => http.get<VehicleInformationResponse>(`/vehicles/${id}`),
    enabled: !!userId && !!id,
    retry: 1,
  });

  const vehicleData = data?.data;

  const vehicleDetails = useMemo(() => {
    if (!vehicleData) return [];
    return [
      { year: vehicleData.yearOfRelease || "N/A" },
      { city: vehicleData.city || "N/A" },
      { seatingCapacity: vehicleData.numberOfSeats || "N/A" },
    ];
  }, [vehicleData]);

  const vehicleImages = useMemo(() => {
    return vehicleData?.photos?.map((photo) => photo.cloudinaryUrl) ?? [];
  }, [vehicleData]);

  // True while auth is loading (userId not yet available) OR query is fetching
  const isPageLoading = !userId || isLoading;

  return {
    listingDetail: vehicleData
      ? ({ ...vehicleData } as VehicleInformationStepper)
      : null,
    isError,
    isLoading: isPageLoading,
    vehicleDetails,
    vehicleImages,
  };
}
