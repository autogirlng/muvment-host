import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { useHttp } from "@/hooks/useHttp";
import { useAppSelector } from "@/lib/hooks";
import { BookingInformation, SingleBookingInformation } from "@/types";

export default function useGetBookingById({ id }: { id?: string }) {
  const http = useHttp();
  const { user } = useAppSelector((state) => state.user);

  const { data, isError, isLoading } = useQuery({
    queryKey: ["getBookingById", id],

    queryFn: async () =>
      http.get<SingleBookingInformation>(`/v1/bookings/${id}`),
    enabled: !!user?.data.userId && !!id,
    retry: false,
  });

  const vehicleDetails = useMemo(() => {
    if (data) {
      return [
        // @ts-ignore
        { make: data?.data.vehicle.vehicleName || "N/A" },
        // @ts-ignore
        { licenseNumber: data?.data.vehicle.licensePlate || "N/A" },
        { status: data?.data.vehicle.status || "N/A" },
        // { colour: data?.vehicle?.vehicleColor || "N/A" },
        // { seatingCapacity: data?.vehicle?.numberOfSeats || "N/A" },
      ];
    }
    return [{}];
  }, [data]);

  const contactInformation = useMemo(() => {
    if (data) {
      return [
        { email: data?.data.booker.email || "N/A" },
        { phone: data?.data.booker.customerPhone || "N/A" },
        { pickupLocation: data?.data.segments[0].pickupLocation || "N/A" },
        { dropoffLocation: data?.data?.segments[0].dropoffLocation || "N/A" },
      ];
    }
    return [{}];
  }, [data]);

  const bookingDates = useMemo(() => {
    const startDateTime = data?.data.segments[0].startDateTime;
    const endDateTime = data?.data.segments[0].endDateTime;
    if (data) {
      return [
        {
          startDate: startDateTime
            ? `${format(new Date(startDateTime), "do MMM yyyy")} | ${format(new Date(startDateTime), "h:mma")}`
            : "N/A",
        },
        {
          endDate: endDateTime
            ? `${format(new Date(endDateTime), "do MMM yyyy")} | ${format(new Date(endDateTime), "h:mma")}`
            : "N/A",
        },
        // { duration: `${data?.duration} days` || "N/A" },
      ];
    }
    return [{}];
  }, [data]);
console.log(data)
  return {
    bookingDetail: data,
    isError,
    isLoading,

    vehicleDetails,
    bookingDates,
    contactInformation,
  };
}
