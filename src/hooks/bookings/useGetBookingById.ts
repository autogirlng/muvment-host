import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { useHttp } from "@/hooks/useHttp";
import { useAppSelector } from "@/lib/hooks";
import type { BookingVehicleInfo } from "@/components/Bookings/BookingVehicleCard";
import {
  SingleBookingInformation,
  VehicleInformationResponse,
} from "@/types";
import { getBookingDisplayId } from "@/utils/displayIds";
import { formatNgnAmount } from "@/utils/formatters";

function getPrimaryPhotoUrl(
  photos?: { cloudinaryUrl?: string; isPrimary?: boolean }[]
): string | null {
  if (!photos?.length) return null;
  const primary = photos.find((photo) => photo.isPrimary);
  return primary?.cloudinaryUrl ?? photos[0]?.cloudinaryUrl ?? null;
}

function formatYesNo(value?: boolean): string {
  if (value === undefined || value === null) return "—";
  return value ? "Yes" : "No";
}

function formatDuration(value?: number, unit?: string): string {
  if (!value || !unit?.trim()) return "—";
  return `${value} ${unit.toLowerCase()}`;
}

function capitalizeWords(value?: string): string {
  if (!value?.trim()) return "—";
  return value
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export default function useGetBookingById({ id }: { id?: string }) {
  const http = useHttp();
  const { user } = useAppSelector((state) => state.user);

  const { data, isError, isLoading } = useQuery({
    queryKey: ["getBookingById", id],
    queryFn: async () =>
      http.get<SingleBookingInformation>(`/bookings/${id}`),
    enabled: !!user?.data.userId && !!id,
    retry: false,
  });

  const booking = data?.data;
  const vehicleId = booking?.vehicle?.id;
  const firstSegment = booking?.segments?.[0];

  const {
    data: vehicleResponse,
    isLoading: isVehicleLoading,
  } = useQuery({
    queryKey: ["bookingVehicle", vehicleId],
    queryFn: () =>
      http.get<VehicleInformationResponse>(`/vehicles/${vehicleId}`),
    enabled: !!user?.data.userId && !!vehicleId,
    retry: false,
  });

  const vehicleRecord = vehicleResponse?.data;

  const invoiceNumber = getBookingDisplayId(booking);
  const formattedTotalPrice = booking?.totalPrice
    ? `NGN ${formatNgnAmount(Number(booking.totalPrice))}`
    : "—";

  const vehicleInfo = useMemo((): BookingVehicleInfo => {
    const bookingVehicle = booking?.vehicle;
    const segmentVehicle = firstSegment?.vehicle;

    const name =
      vehicleRecord?.name?.trim() ||
      bookingVehicle?.name?.trim() ||
      segmentVehicle?.name?.trim() ||
      "";

    const plate =
      vehicleRecord?.licensePlateNumber?.trim() ||
      bookingVehicle?.licensePlateNumber?.trim() ||
      segmentVehicle?.licensePlateNumber?.trim() ||
      "";

    const status =
      vehicleRecord?.status ||
      bookingVehicle?.status ||
      segmentVehicle?.status ||
      "";

    const specChips = [
      vehicleRecord?.vehicleMake?.name,
      vehicleRecord?.vehicleModel?.name,
      vehicleRecord?.yearOfRelease
        ? String(vehicleRecord.yearOfRelease)
        : undefined,
      vehicleRecord?.vehicleType?.name || vehicleRecord?.vehicleTypeName,
      vehicleRecord?.vehicleColor?.name,
      vehicleRecord?.numberOfSeats
        ? `${vehicleRecord.numberOfSeats} seats`
        : undefined,
    ].filter((chip): chip is string => !!chip?.trim());

    const detailItems: { label: string; value: string }[] = [
      { label: "Plate number", value: plate || "—" },
      {
        label: "Vehicle type",
        value:
          vehicleRecord?.vehicleType?.name ||
          vehicleRecord?.vehicleTypeName ||
          "—",
      },
      {
        label: "Make",
        value: vehicleRecord?.vehicleMake?.name || "—",
      },
      {
        label: "Model",
        value: vehicleRecord?.vehicleModel?.name || "—",
      },
      {
        label: "Year",
        value: vehicleRecord?.yearOfRelease
          ? String(vehicleRecord.yearOfRelease)
          : "—",
      },
      {
        label: "Color",
        value: vehicleRecord?.vehicleColor?.name || "—",
      },
      {
        label: "Seats",
        value: vehicleRecord?.numberOfSeats
          ? String(vehicleRecord.numberOfSeats)
          : "—",
      },
      {
        label: "City",
        value: capitalizeWords(vehicleRecord?.city),
      },
      {
        label: "State of registration",
        value: vehicleRecord?.stateOfRegistration || "—",
      },
      {
        label: "Operational status",
        value: capitalizeWords(
          bookingVehicle?.operationalStatus ||
            segmentVehicle?.operationalStatus
        ),
      },
      {
        label: "Insurance",
        value: formatYesNo(vehicleRecord?.hasInsurance),
      },
      {
        label: "GPS tracker",
        value: formatYesNo(vehicleRecord?.hasTracker),
      },
      {
        label: "Provides driver",
        value: formatYesNo(vehicleRecord?.willProvideDriver),
      },
      {
        label: "Provides fuel",
        value: formatYesNo(vehicleRecord?.willProvideFuel),
      },
      {
        label: "Max trip duration",
        value: formatDuration(
          vehicleRecord?.maxTripDurationValue,
          vehicleRecord?.maxTripDurationUnit
        ),
      },
      {
        label: "Advance notice",
        value: formatDuration(
          vehicleRecord?.advanceNoticeValue,
          vehicleRecord?.advanceNoticeUnit
        ),
      },
    ];

    const assignedDriver = vehicleRecord?.assignedDriver;
    const driver = assignedDriver?.fullName?.trim()
      ? {
          name: assignedDriver.fullName.trim(),
          phone: assignedDriver.phoneNumber?.trim() || "",
          license: assignedDriver.licenseNumber?.trim(),
        }
      : null;

    return {
      name,
      photoUrl: getPrimaryPhotoUrl(vehicleRecord?.photos),
      status,
      specChips,
      detailItems,
      driver,
      features:
        vehicleRecord?.features?.map((feature) => feature.name).filter(Boolean) ??
        [],
      description: vehicleRecord?.description?.trim() || "",
    };
  }, [booking, firstSegment, vehicleRecord]);

  const contactInformation = useMemo(() => {
    if (!booking || !firstSegment) return [];

    return [
      { email: booking.booker?.email || "N/A" },
      { phone: booking.booker?.customerPhone || "N/A" },
      { pickupLocation: firstSegment.pickupLocation || "N/A" },
      { dropoffLocation: firstSegment.dropoffLocation || "N/A" },
    ];
  }, [booking, firstSegment]);

  const bookingDates = useMemo(() => {
    if (!booking || !firstSegment) return [];

    const startDateTime = firstSegment.startDateTime;
    const endDateTime = firstSegment.endDateTime;

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
    ];
  }, [booking, firstSegment]);

  return {
    bookingDetail: data,
    isError,
    isLoading,
    isVehicleLoading,
    invoiceNumber,
    formattedTotalPrice,
    vehicleInfo,
    bookingDates,
    contactInformation,
  };
}
