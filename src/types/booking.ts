import { User } from "./user";
import { ListingInformation } from "./listing";
import { PaymentBadgeStatus } from "./transactions_payment_finance";


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

export interface BookingStatistics {
  totalBookings: number;
  pendingApprovals: number;
  rejectedBookings: number;
  approvedRequests: number;
}



export interface BookingDetailsInformation {
  id: string;
  startDate: string;
  endDate: string;
  duration: number;
  // bookingType: string;
  amount: number;
  // paymentStatus: string;
  // paymentMethod: string;
  // rentalAgreement: string | null;
  // bookingStatus: string;
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
  // vehicle: Vehicle;
  // travelCompanions: TravelCompanion[];
}

export interface BookingInformation {
  id: string;
  startDate: string;
  endDate: string;
  duration: number;
  bookingType: BookingType;
  amount: number;
  paymentStatus: PaymentBadgeStatus;
  paymentMethod: "BANK_TRANSFER" | "CARD_PAYMENT" | "CASH"; //check booking status
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