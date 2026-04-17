"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useHttp } from "@/hooks/useHttp";
import { ErrorResponse } from "@/types";

// ============== Types for API Responses ==============

// Base API Response wrapper
interface ApiResponse<T> {
  status: "SUCCESSFUL" | "FAILED";
  message: string;
  errorCode?: string;
  data: T;
  timestamp: string;
}

// ============== 1. Completed Trip Types ==============
interface CompletedTripDate {
  startDate: string;
  endDate: string;
}

interface CompletedTrip {
  vehicleId: string;
  dates: CompletedTripDate[];
  totalFare: number;
}

// ============== 2. Earning History Types ==============
interface PaidBy {
  fullName: string;
  email: string;
}

interface HostEarningItem {
  amountPaid: number;
  paidAt: string;
  paidBy: PaidBy;
}

interface EarningHistoryData {
  totalEarnings: number;
  hostEarningItems: HostEarningItem[];
}

// ============== 3. Booking History Types ==============
interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  userType: string;
  departmentName: string;
  referredById: string;
  active: boolean;
}

interface Segment {
  additionalProp1?: any;
  additionalProp2?: any;
  additionalProp3?: any;
}

interface BookingHistoryItem {
  bookingId: string;
  invoiceNumber: string;
  vehicleId: string;
  calculationId: string;
  userId: string;
  status: string;
  totalPrice: number;
  bookedAt: string;
  primaryPhoneNumber: string;
  secondaryPhoneNumber: string;
  guestFullName: string;
  guestEmail: string;
  recipientFullName: string;
  recipientEmail: string;
  recipientPhoneNumber: string;
  recipientSecondaryPhoneNumber: string;
  user: User;
  extraDetails: string;
  purposeOfRide: string;
  bookingRef: string;
  segments: Segment[];
  bookingForOthers: boolean;
}

interface PageableResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
}

// ============== 4. Upcoming Trip Types ==============
interface UpcomingTrip {
  id: string;
  startDateTime: string;
  endDateTime: string;
  customerName: string;
  customerPhoneNumber: string;
  vehicleId: string;
  vehicleIdentifier: string;
  vehicleName: string;
  hostName: string;
  hostEmail: string;
  hostPhoneNumber: string;
  driverName: string;
  driverPhoneNumber: string;
  customerAgentName: string;
  operationsAgentName: string;
  bookingTypeName: string;
  bookedHours: number;
  duration: string;
  city: string;
  pickupLocation: string;
  bookingStatus: string;
  tripStatus: string;
  totalPrice: number;
  bookingId: string;
  createdAt: string;
  bookingCategory: string;
  ongoing: boolean;
}

// ============== 5. Onboarded Vehicle Types ==============
interface VehicleOwner {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  userType: string;
  profilePictureUrl: string;
  referralCode: string;
  birthday: string;
  phoneVerified: boolean;
  emailVerified: boolean;
}

interface VehicleType {
  id: string;
  name: string;
  description: string;
}

interface VehicleMake {
  id: string;
  name: string;
  code: string;
}

interface VehicleModel {
  id: string;
  name: string;
  code: string;
  makeName: string;
  makeId: string;
}

interface VehicleColor {
  id: string;
  name: string;
  hexCode: string;
}

interface AssignedDriver {
  id: string;
  driverIdentifier: string;
  fullName: string;
  phoneNumber: string;
  ownerType: string;
  ownerName: string;
  assignedVehicleId: string;
  assignedVehicleIdentifier: string;
  assignedVehicleName: string;
  profilePictureUrl: string;
  active: boolean;
}

interface Photo {
  cloudinaryUrl: string;
  cloudinaryPublicId: string;
  isPrimary: boolean;
  id: string;
}

interface Document {
  documentType: string;
  cloudinaryUrl: string;
  cloudinaryPublicId: string;
  id: string;
}

interface Feature {
  id: string;
  name: string;
  description: string;
}

interface SupportedBookingType {
  id: string;
  name: string;
  durationInMinutes: number;
  description: string;
  defaultActive: boolean;
}

interface Pricing {
  bookingTypeId: string;
  bookingTypeName: string;
  price: number;
  platformFeeType: string;
  id: string;
}

interface Discount {
  discountDurationId: string;
  discountDurationName: string;
  percentage: number;
  id: string;
}

interface SupportedState {
  id: string;
  stateId: string;
  stateName: string;
  countryName: string;
  surchargeFee: number;
}

interface OutOfBoundsArea {
  id: string;
  name: string;
}

interface Vehicle {
  id: string;
  vehicleIdentifier: string;
  ownerId: string;
  name: string;
  city: string;
  address: string;
  latitude: number;
  longitude: number;
  vehicleTypeId: string;
  vehicleTypeName: string;
  vehicleMakeId: string;
  vehicleModelId: string;
  yearOfRelease: number;
  hasInsurance: boolean;
  hasTracker: boolean;
  status: string;
  licensePlateNumber: string;
  stateOfRegistration: string;
  vehicleColorId: string;
  numberOfSeats: number;
  description: string;
  maxTripDurationUnit: string;
  maxTripDurationValue: number;
  advanceNoticeUnit: string;
  advanceNoticeValue: number;
  willProvideDriver: boolean;
  willProvideFuel: boolean;
  extraHourlyRate: number;
  outskirtFee: number;
  extremeFee: number;
  isVehicleUpgraded: boolean;
  upgradedYear: number;
  owner: VehicleOwner;
  vehicleType: VehicleType;
  vehicleMake: VehicleMake;
  vehicleModel: VehicleModel;
  vehicleColor: VehicleColor;
  assignedDriver: AssignedDriver;
  photos: Photo[];
  documents: Document[];
  features: Feature[];
  supportedBookingTypes: SupportedBookingType[];
  pricing: Pricing[];
  discounts: Discount[];
  supportedStates: SupportedState[];
  outOfBoundsAreas: OutOfBoundsArea[];
}

interface OnboardedVehicleData {
  approved: Vehicle[];
  rejected: Vehicle[];
  drafts: Vehicle[];
  suspended: Vehicle[];
  inReview: Vehicle[];
  totalVehicles: number;
}

// ============== 6. Top Rated Vehicle Types ==============
interface ModeratorUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  userType: string;
  departmentName: string;
  referredById: string;
  active: boolean;
}

interface TopRatedVehicle {
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  createdById: string;
  updatedById: string;
  deletedById?: string;
  restoredById?: string;
  id: string;
  rating: number;
  review: string;
  recommend: string;
  moderatedBy: ModeratorUser;
  moderatedAt: string;
  moderatedReason: string;
  entityId: string;
  entityType: string;
  isAnonymous: boolean;
  source: string;
  status: string;
  isModerated: boolean;
  reviewedBy: ModeratorUser;
  anonymousEmail: string;
  anonymousFullName: string;
  anonymousPhoneNumber: string;
}

// ============== Query Params Types ==============
interface PaginationParams {
  page?: number;
  size?: number;
}

interface CompletedTripParams extends PaginationParams {}

interface EarningHistoryParams extends PaginationParams {
  year?: number;
  month?: number;
  week?: number;
}

interface BookingHistoryParams extends PaginationParams {
  startDate?: string;
  endDate?: string;
  vehicleTypeName?: string;
  bookingStatus?: string;
  bookingId?: string;
}

interface UpcomingTripParams extends PaginationParams {}

interface OnboardedVehicleParams extends PaginationParams {}

interface TopRatedParams extends PaginationParams {}

// ============== Hook ==============
export function useHostPerformance() {
  const http = useHttp();
  const queryClient = useQueryClient();

  const buildQueryString = (params?: Record<string, any>) => {
    if (!params) return "";
    const filteredParams = Object.entries(params).filter(
      ([_, v]) => v !== undefined && v !== null,
    );
    if (filteredParams.length === 0) return "";
    return `?${new URLSearchParams(filteredParams.map(([k, v]) => [k, String(v)]))}`;
  };

  // 1. Get Completed Trip
  const useGetCompletedTrip = (params?: CompletedTripParams) => {
    return useQuery({
      queryKey: ["host-performance", "completed-trip", params],
      queryFn: async (): Promise<ApiResponse<CompletedTrip[]>> => {
        const queryString = buildQueryString(params);
        const result = await http.get<ApiResponse<CompletedTrip[]>>(
          `/host-performance/completed-trip${queryString}`,
        );
        if (!result) throw new Error("Failed to fetch completed trips");
        return result;
      },
      enabled: true,
    });
  };

  // 2. Get Earning History
  const useGetEarningHistory = (params?: EarningHistoryParams) => {
    return useQuery({
      queryKey: ["host-performance", "earning-history", params],
      queryFn: async (): Promise<ApiResponse<EarningHistoryData>> => {
        const queryString = buildQueryString(params);
        const result = await http.get<ApiResponse<EarningHistoryData>>(
          `/host-performance/earning-history${queryString}`,
        );
        if (!result) throw new Error("Failed to fetch earning history");
        return result;
      },
      enabled: true,
    });
  };

  // 3. Get Host Booking History
  const useGetHostBookingHistory = (params?: BookingHistoryParams) => {
    return useQuery({
      queryKey: ["host-performance", "host-booking-history", params],
      queryFn: async (): Promise<
        ApiResponse<PageableResponse<BookingHistoryItem>>
      > => {
        const queryString = buildQueryString(params);
        const result = await http.get<
          ApiResponse<PageableResponse<BookingHistoryItem>>
        >(`/host-performance/host-booking-history${queryString}`);
        if (!result) throw new Error("Failed to fetch booking history");
        return result;
      },
      enabled: true,
    });
  };

  // 4. Get Host Upcoming Trip
  const useGetHostUpcomingTrip = (params?: UpcomingTripParams) => {
    return useQuery({
      queryKey: ["host-performance", "host-upcoming-trip", params],
      queryFn: async (): Promise<
        ApiResponse<PageableResponse<UpcomingTrip>>
      > => {
        const queryString = buildQueryString(params);
        const result = await http.get<
          ApiResponse<PageableResponse<UpcomingTrip>>
        >(`/host-performance/host-upcoming-trip${queryString}`);
        if (!result) throw new Error("Failed to fetch upcoming trips");
        return result;
      },
      enabled: true,
    });
  };

  // 5. Get Onboarded Vehicle
  const useGetOnboardedVehicle = (params?: OnboardedVehicleParams) => {
    return useQuery({
      queryKey: ["host-performance", "onboarded-vehicle", params],
      queryFn: async (): Promise<ApiResponse<OnboardedVehicleData>> => {
        const queryString = buildQueryString(params);
        const result = await http.get<ApiResponse<OnboardedVehicleData>>(
          `/host-performance/onboarded-vehicle${queryString}`,
        );
        if (!result) throw new Error("Failed to fetch onboarded vehicles");
        return result;
      },
      enabled: true,
    });
  };

  // 6. Get Top Rated
  const useGetTopRated = (params?: TopRatedParams) => {
    return useQuery({
      queryKey: ["host-performance", "top-rated", params],
      queryFn: async (): Promise<ApiResponse<TopRatedVehicle[]>> => {
        const queryString = buildQueryString(params);
        const result = await http.get<ApiResponse<TopRatedVehicle[]>>(
          `/host-performance/top-rated${queryString}`,
        );
        if (!result) throw new Error("Failed to fetch top rated vehicles");
        return result;
      },
      enabled: true,
    });
  };

  const invalidateHostPerformanceQueries = () => {
    queryClient.invalidateQueries({ queryKey: ["host-performance"] });
  };

  return {
    useGetCompletedTrip,
    useGetEarningHistory,
    useGetHostBookingHistory,
    useGetHostUpcomingTrip,
    useGetOnboardedVehicle,
    useGetTopRated,
    invalidateHostPerformanceQueries,
  };
}

// Export types for use in other components
export type {
  ApiResponse,
  CompletedTrip,
  CompletedTripDate,
  EarningHistoryData,
  HostEarningItem,
  BookingHistoryItem,
  PageableResponse,
  UpcomingTrip,
  OnboardedVehicleData,
  Vehicle,
  TopRatedVehicle,
  CompletedTripParams,
  EarningHistoryParams,
  BookingHistoryParams,
  UpcomingTripParams,
  OnboardedVehicleParams,
  TopRatedParams,
};
