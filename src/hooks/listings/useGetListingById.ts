import { useHttp } from "@/hooks/useHttp";
import { useAppSelector } from "@/lib/hooks";
import { VehicleInformationResponse, VehicleInformationStepper } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export default function useGetListingById({ id }: { id: string }) {
  const http = useHttp();
  const { user } = useAppSelector((state) => state.user);

  const { data, isError, isLoading, isSuccess } = useQuery({
    queryKey: ["getListingById", id],

    queryFn: async () =>
      http.get<VehicleInformationResponse>(`/v1/vehicles/${id}`),
    enabled: !!user?.data.userId && !!id,
    retry: false,
  });
  const vehicleData = data?.data
console.log(vehicleData)
  const vehicleDetails = useMemo(() => {
    if (data) {
      return [
        // { make: vehicleData. || "N/A" },
        // { model: data?.data. || "N/A" },
        { year: vehicleData?.yearOfRelease || "N/A" },
        // { colour: data?.vehicleColor || "N/A" },
        { city: vehicleData?.city || "N/A" },
        // { vehicleType: vehicleData. || "N/A" },
        { seatingCapacity: vehicleData?.numberOfSeats || "N/A" },
      ];
    }
    return [{}];
  }, [data]);

  const vehicleImages = useMemo(() => {
    return vehicleData?.photos.map((photo)=>{
      return photo.cloudinaryUrl
    })
    
  }, [data]);


  return {
    listingDetail: {
      ...vehicleData,
      status:vehicleData?.status
      // statistics: {} as EarningsStatistics,
    } as VehicleInformationStepper,
    isError,
    isLoading,
    isSuccess,
    vehicleDetails,
    vehicleImages,
  };
}
