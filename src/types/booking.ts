import { User, ListingInformation, PaymentBadgeStatus, BaseResponse  } from "@/types";




export const enum BookingType {
  SINGLE_DAY = "SINGLE_DAY",
  MULTI_DAY = "MULTI_DAY",
}
export enum BookingBadgeStatus {
  ACCEPTED = "ACCEPTED",
  PENDING = "PENDING",
  CANCELLED = "CANCELLED",
  APPROVED = "APPROVED",
  COMPLTETED = "COMPLETED",
}


export type BookingsDataType = {
  data: BookingInformation[];
  totalCount: number;
};

export interface BookingStatistics {
  totalBookings: number;
  pendingApprovals: number;
  rejectedBookings: number;
  approvedRequests: number;
}

export enum BookingStatus  {
PENDING_PAYMENT ="PENDING_PAYMENT", 
CONFIRMED="CONFIRMED", 
FAILED_AVAILABILITY="FAILED_AVAILABILITY",
CANCELLED_BY_USER="CANCELLED_BY_USER",
CANCELLED_BY_HOST="CANCELLED_BY_HOST",
CANCELLED_BY_ADMIN="CANCELLED_BY_ADMIN",
IN_PROGRESS="IN_PROGRESS",
COMPLETED="COMPLETED", 
NO_SHOW="NO_SHOW"
}

export interface BookingSegmentContent {
    segmentId: string,
    bookingId: string,
    vehicleId: string,
    vehicleName: string,
    createdAt: string,
    customerName: string,
    bookingType: string,
    city: string,
    duration: string,
    bookingStatus: BookingStatus,
    price: number
}

export interface BookingSegments extends BaseResponse {
  data: {
    content: BookingSegmentContent[],
    currentPage: number,
    pageSize: number,
    totalItems: number,
    totalPages: number
  },
}

export interface VehicleUpcomingBookingType  {
  data: BookingInformation[];
  totalCount: number;
};


export interface BookingDetailsInformation {
  id: string;
  startDate: string;
  endDate: string;
  duration: number;
  amount: number;
  guestName: string;
  guestEmail: string;
  guestPhoneNumber: string;
  pickupLocation: string;
  dropoffLocation: string;
  emergencyContact: string;
  vehicleId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface BookingInformation {
  id: string;
  startDate: string;
  endDate: string;
  duration: number;
  bookingType: BookingType;
  amount: number;
  paymentStatus: PaymentBadgeStatus;
  paymentMethod: "BANK_TRANSFER" | "CARD_PAYMENT" | "CASH";
  rentalAgreement: string | null;
  bookingStatus: BookingBadgeStatus;
  guestName: string;
  guestEmail: string;
  guestPhoneNumber: string;
  pickupLocation: string;
  dropoffLocation: string;
  emergencyContact: string;
  vehicle: ListingInformation;
  vehicleId: string;
  user: User;
  userId: string;
  createdAt: string;
  updatedAt: string;
  currencyCode: string;
}

export interface BookingTypeData {
      id: string,
      name: string,
      durationInMinutes: number,
      description: string,
      defaultActive: boolean
}
export interface BookingTypeResponse {
  data:  BookingTypeData[]
}