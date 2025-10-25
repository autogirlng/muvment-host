import { Pricing, TripSettings, ListingStatus, Review, CloudinaryPhotoUpload } from "@/types";
import { GeoFenceAreaData, BookingTypeData } from "@/types";

export interface BasicVehicleInformationValues {
  name: string;
  city:string;
  address: string,
  latitude: number,
  longitude: number,
  vehicleTypeId: string,
  vehicleMakeId: string,
  vehicleModelId: string,
  yearOfRelease: number,
  hasInsurance: string,
  hasTracker: string
}


export interface AdditionalVehicleInformationValues {
  licensePlateNumber: string;
  stateOfRegistration: string;
  vehicleColorId: string;
  numberOfSeats:number;
  description: string;
  featureIds:string[]

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
  inspectionReport: string;
  maintenanceHistory?: string;
  authorizationLetter: string;
}

export interface VehicleInformation {
  id: string;
  listingName: string;
  location?: string;
  address?: string;
  vehicleType: string;
  make: string;
  model: string;
  yearOfRelease: number;
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

export interface VehicleInformationStepper {
  
        id:string,
        vehicleIdentifier: string,
        ownerId: string,
        name: string,
        city: string,
        address: string,
        latitude: number,
        longitude:number,
        vehicleTypeId: string,
        vehicleMakeId: string,
        vehicleModelId: string,
        yearOfRelease: number,
        hasInsurance: boolean,
        hasTracker:boolean,
        status: string,
        willProvideDriver: boolean,
        willProvideFuel: boolean,
        photos: CloudinaryPhotoUpload[],
        documents: any[],
        features: VehicleFeatures[],
        supportedBookingTypes: BookingTypeData[],
        pricing: any[],
        discounts: any[],
        outOfBoundsAreaIds: string[]

    licensePlateNumber: string,
    stateOfRegistration: string,
    vehicleColorId: string,
    numberOfSeats: number,
    description: string,
    maxTripDurationUnit: string,
    maxTripDurationValue: number,
    advanceNoticeUnit: string,
    advanceNoticeValue: number,
   
    extraHourlyRate: number,
    outskirtFee: number,
    extremeFee: number,

 
        
    }

    export interface VehicleFeatures  {
        id: string,
        name: string,
        description: string
      }

    export interface VehicleInformationResponse {
    status: string,
    message: string,
    data: VehicleInformationStepper,
    timestamp: string
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

export interface Reviews {
  data: Review[];
  totalCount: number;
};


export interface ListingDataType {
  data: VehicleInformation[];
  totalCount: number;
};


export interface AvailabilityAndPricingValues {
  
  maxTripDurationUnit: string,
  maxTripDurationValue: number,
  advanceNoticeUnit: string,
  advanceNoticeValue: number,
  willProvideDriver: string,
  willProvideFuel: string,
  supportedBookingTypeIds: string[],
  outOfBoundsAreaIds: string[],
  outskirtFee: number,
  extremeFee: number,
  pricing?: 
    {
      bookingTypeId: string,
      price: number,
      platformFeeType: string
    }[]
  ,
  discounts?: 
    {
      discountDurationId: string,
      percentage: number
    }[]
  ,
  extraHourlyRate?: number
  
}