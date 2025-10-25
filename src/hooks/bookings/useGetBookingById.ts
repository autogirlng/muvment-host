import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { useHttp } from "@/hooks/useHttp";
import { useAppSelector } from "@/lib/hooks";
import { BookingInformation } from "@/types";

export default function useGetBookingById({ id }: { id?: string }) {
  const http = useHttp();
  const { user } = useAppSelector((state) => state.user);

  const { data, isError, isLoading } = useQuery({
    queryKey: ["getBookingById", id],

    queryFn: async () =>
      http.get<BookingInformation>(`/api/bookings/getSingle/${id}`),
    enabled: !!user?.data.userId && !!id,
    retry: false,
  });

  const vehicleDetails = useMemo(() => {
    if (data) {
      return [
        { make: data?.vehicle?.make || "N/A" },
        { model: data?.vehicle?.model || "N/A" },
        { year: data?.vehicle?.yearOfRelease || "N/A" },
        { colour: data?.vehicle?.vehicleColor || "N/A" },
        { seatingCapacity: data?.vehicle?.numberOfSeats || "N/A" },
      ];
    }
    return [{}];
  }, [data]);

  const contactInformation = useMemo(() => {
    if (data) {
      return [
        { email: data?.guestEmail || "N/A" },
        { phone: data?.guestPhoneNumber || "N/A" },
        { pickupLocation: data?.pickupLocation || "N/A" },
        { dropoffLocation: data?.dropoffLocation || "N/A" },
      ];
    }
    return [{}];
  }, [data]);

  const bookingDates = useMemo(() => {
    if (data) {
      return [
        {
          startDate: data?.startDate
            ? `${format(new Date(data?.startDate), "do MMM yyyy")} | ${format(new Date(data?.startDate), "h:mma")}`
            : "N/A",
        },
        {
          endDate: data?.endDate
            ? `${format(new Date(data?.endDate), "do MMM yyyy")} | ${format(new Date(data?.endDate), "h:mma")}`
            : "N/A",
        },
        { duration: `${data?.duration} days` || "N/A" },
      ];
    }
    return [{}];
  }, [data]);

  return {
    bookingDetail: data,
    isError,
    isLoading,

    vehicleDetails,
    bookingDates,
    contactInformation,
  };
}
