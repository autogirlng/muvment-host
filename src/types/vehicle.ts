import { ListingStatus } from "./listing";
import { TripSettings } from "./trip";
import { Pricing } from "./transactions_payment_finance";


export interface BasicVehicleInformationValues {
  listingName: string;
  location: string;
  address: string;
  vehicleType: string;
  make: string;
  model: string;
  yearOfRelease: string;
  hasTracker: string;
  hasInsurance: string;
}

export interface AdditionalVehicleInformationValues {
  licensePlateNumber: string;
  stateOfRegistration: string;
  vehicleDescription: string;
  features: string[];
  vehicleColor: string;
  numberOfSeats: string;
  // vehicleOwner:string
}


export enum VehicleStatus {
  DRAFT = "draft",
  PENDING = "pending",
  SUBMITTED = "submitted",
  ACTIVE = "active",
  BOOKED = "booked",
  MAINTENANCE = "maintenance",
  UNAVAILABLE = "unavailable",
  INACTIVE = "inactive",
}

export interface VehiclePhotos {
  frontView: string;
  backView: string;
  sideView1: string;
  sideView2: string;
  interior: string;
  other: string;
}

export interface DocumentVehicleInformationValues {
  proofOfOwnership: string;
  vehicleRegistration: string;
  insuranceCertificate: string;
  vehicleInspectionReport: string;
  maintenanceHistory?: string;
  authorizationLetter: string;
}

export interface VehicleInformation {
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
  VehicleImage: VehiclePhotos;
  tripSettings: TripSettings;
  pricing: Pricing;
  outskirtsLocation?: string[];
  outskirtsPrice?: number;
  status: ListingStatus;
  vehicleStatus: VehicleStatus;
  userId: string;
  createdAt: string;
  updatedAt: string;
  VehicleDocument: DocumentVehicleInformationValues;
}

export interface TopRatedVehicle {
  id: string;
}

export interface TopRatedVehicleType {
  make: string;
  model: string;
  year: string;
  color: string;
  colour?:string;
  seatingCapacity: string;
  totalRides: string;
  totalEarnings: string;
};

export interface VehicleState {
  vehicle: VehicleInformation | null;
  currentStep: number;
}