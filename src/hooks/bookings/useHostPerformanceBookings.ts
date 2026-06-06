"use client";

import { useQuery } from "@tanstack/react-query";
import { useHttp } from "@/hooks/useHttp";

export interface HostBookingsSummary {
  totalBookings: number;
  successfulBookings: number;
  pendingBookings: number;
  abandonedBookings: number;
}

export interface HostBookingItem {
  bookingId: string;
  /** Host-facing reference, e.g. INVHST1915 — display in tables; keep bookingId for detail URLs */
  invoiceNumber?: string;
  vehicleId: string;
  vehicleIdentifier: string;
  vehicleName: string;
  status: string;
  totalPrice: number;
  primaryPhoneNumber: string;
  secondaryPhoneNumber: string;
  guestFullName: string;
  guestEmail: string;
  recipientFullName: string;
  recipientEmail: string;
  recipientPhoneNumber: string;
  recipientSecondaryPhoneNumber: string;
  extraDetails: string;
  purposeOfRide: string;
  bookedAt: string;
  hostPaymentStatus: string;
}

/** The paginated page of bookings (nested under data.content) */
export interface HostBookingsContentPage {
  content: HostBookingItem[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
}

export interface HostBookingsData {
  summary?: HostBookingsSummary;
  content: HostBookingsContentPage;
}

export interface HostBookingsResponse {
  status: string;
  message: string;
  errorCode: string;
  data: HostBookingsData;
  timestamp: string;
}

export interface HostPerformanceBookingsParams {
  page?: number;
  size?: number;
  startDate?: string;
  endDate?: string;
  bookingStatus?: string;
  /** Search/filter by invoice number (not bookingId) */
  invoiceNumber?: string;
}

export function useHostPerformanceBookings() {
  const http = useHttp();

  const buildQueryString = (params?: Record<string, any>): string => {
    if (!params) return "";
    const filtered = Object.entries(params).filter(
      ([, v]) => v !== undefined && v !== null && v !== ""
    );
    if (filtered.length === 0) return "";
    return `?${new URLSearchParams(filtered.map(([k, v]) => [k, String(v)]))}`;
  };

  const useGetHostBookings = (
    params?: HostPerformanceBookingsParams,
    enabled = true
  ) =>
    useQuery({
      queryKey: ["host-performance-bookings", params],
      queryFn: async (): Promise<HostBookingsResponse> => {
        const qs = buildQueryString(params);
        const result = await http.get<HostBookingsResponse>(
          `/host-performance/bookings${qs}`
        );
        if (!result) throw new Error("Failed to fetch bookings");
        return result;
      },
      enabled,
      retry: false,
    });

  return { useGetHostBookings };
}
