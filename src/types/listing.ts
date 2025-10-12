import { VehicleStatus, VehiclePhotos } from "./vehicle";
import { User } from "./user";
import { BookingInformation } from "./booking";
import { Pricing } from "./transactions_payment_finance";
import { TripSettings } from "./trip";
import { AssignedDriver } from "./driver";

export enum ListingStatus {
  REVIEW = "review",
  REJECTED = "rejected",
  APPROVED = "approved",
  ACCEPTED = "accepted",
  FEEDBACK = "feedback",
  SUSPENDED = "suspended",
}

export interface ListingInformation {
  id?: string;
  listingName: string;
  location?: string;
  address?: string;
  vehicleType: string;
  make: string;
  model: string;
  yearOfRelease: string;
  hasTracker: boolean;
  hasInsurance: boolean;
  licensePlateNumber: string;
  stateOfRegistration: string;
  vehicleDescription: string;
  features: string[];
  vehicleColor: string;
  numberOfSeats: number;
  outskirtsLocation?: string[];
  outskirtsPrice?: number;
  status: ListingStatus;
  userId: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  unavailableFrom: string;
  unavailableUntil: string;
  vehicleStatus: VehicleStatus;
  VehicleImage: VehiclePhotos;
  pricing: Pricing;
  tripSettings: TripSettings;
  user: User;
  AssignedDriver: AssignedDriver[];
  Booking: BookingInformation[];
}
