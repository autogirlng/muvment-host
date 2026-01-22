import { User,
    VehicleStatus,
    VehiclePhotos,
    BookingInformation, 
    Pricing, 
    TripSettings, 
    AssignedDriver,
    BaseResponse, 
    CloudinaryPhotoUpload,
    PricingOptions
} from "@/types";


export enum ListingStatus {
  DRAFT = "DRAFT",
  IN_REVIEW = "IN_REVIEW",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  IN_MAINTENANCE = "IN_MAINTENANCE",
  COMPANY_USE = " COMPANY_USE",
  BOOKED = "BOOKED",
  IN_TRIP = "IN_TRIP",
  UNAVAILABLE = "UNAVAILABLE"
  
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

export interface VehicleListingInformationPublic {
    id: string,
    name: string,
    photos: CloudinaryPhotoUpload[],
    city: string,
    allPricingOptions: PricingOptions[],
    extraHourlyRate: number,
    vehicleTypeName: string,
    willProvideDriver: boolean,
    willProvideFuel: boolean,
    numberOfSeats: number,
    advanceNotice: string,
    vehicleMakeName: string,
    vehicleModelName: string,
    vehicleColorName: string,
    year: number,
    description: string,
    vehicleFeatures: string[],
    maxTripDuration: string,
    discounts: {
        durationName: string,
        percentage: number
      }[]
  }

export interface VehicleListingInformationPublicResponse{
  data: VehicleListingInformationPublic

}
