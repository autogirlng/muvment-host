import { Dispatch, SetStateAction } from "react";

import type { VehicleAssignedDriver } from "./driver";
import { 
  BookingTypeData, 
  BaseResponse, 
  Option,  
  Review, 
  CloudinaryPhotoUpload,
} from "@/types";


export enum VehicleStatus {
   DRAFT = "DRAFT", 
   IN_REVIEW = "IN_REVIEW", 
   APPROVED = "APPROVED", 
   REJECTED = "REJECTED", 
   IN_MAINTENANCE = "IN_MAINTENANCE", 
   UNAVAILABLE = "UNAVAILABLE", 
   COMPANY_USE = "COMPANY_USE", 
   BOOKED = "BOOKED", 
   IN_TRIP = "IN_TRIP"
}



export interface VehicleMakeTypeResponse extends BaseResponse {
  data: {
        id: string,
        name: string,
        description: string
    }[]
}

export interface VehicleModelResponse extends BaseResponse {
    data:{
        id: string,
        name: string,
        code: string,
        makeName: string,
        makeId: string
    }[]
}


export interface VehicleFeaturesResponse extends BaseResponse {

    data: {
        id: string,
        name: string,
        description: string
    }[],

}

export interface VehicleColorResponse extends BaseResponse {

    data: {
        id: string,
        name: string,
        hexCode: string
    }[]
    ,
}


export interface HostVehicleListingContent {
  id: string,
  vehicleIdentifier: string,
  name: string,
  licensePlateNumber: string,
  ownerName: string,
  status:VehicleStatus 
}

export interface HostVehicleListings extends BaseResponse {
  data: {
    content:VehicleInformationStepper[],
    currentPage: number,
    pageSize: number,
    totalItems: number,
    totalPages: number
  },
}

export interface VehicleOnboardingStepsHookProps  {
    steps?: string[];
    currentStep: number;
    setCurrentStep: Dispatch<SetStateAction<number>>
    setPhotoTipIndex?: Dispatch<SetStateAction<number>>
}

export interface ModelOption extends Option {
    makeId: string;
}

export interface VehicleInfoState {
    vehicleTypes: Option[],
    vehicleMakes: Option[],
    vehicleModels: ModelOption[]
}

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
  isVehicleUpgraded: string,
  yearOfUpgrade?: number,
}


export interface AdditionalVehicleInformationValues {
  licensePlateNumber: string;
  stateOfRegistration: string;
  vehicleColorId: string;
  numberOfSeats:number;
  description: string;
  featureIds:string[]

}


export interface VehiclePhotos {
  frontView: string;
  backView: string;
  sideView1: string;
  sideView2: string;
  interior: string;
  other: string;
}

export type VehiclePhotosFormValues = {
  [K in keyof VehiclePhotos]: string | File;
};


// export enum VehicleStatus {
//   DRAFT = "draft",
//   PENDING = "pending",
//   SUBMITTED = "submitted",
//   ACTIVE = "active",
//   BOOKED = "booked",
//   MAINTENANCE = "maintenance",
//   UNAVAILABLE = "unavailable",
//   INACTIVE = "inactive",
// }

export interface DocumentVehicleInformationValues {
  proofOfOwnership: string;
  vehicleRegistration: string;
  insuranceCertificate: string;
  inspectionReport: string;
  maintenanceHistory?: string;
  authorizationLetter: string;
}

export type DocumentVehicleInformationFormValues = {
  [K in keyof DocumentVehicleInformationValues]: string | File;
};

export interface VehicleInformation extends BaseResponse {
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
    outOfBoundsAreas?: { id: string; name: string }[];
    assignedDriver?: VehicleAssignedDriver | null;
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
    isVehicleUpgraded:boolean

 
}

export interface VehicleDiscounts  {
discountDurationId: string, 
  percentage: number
}

export interface VehiclePricing {

      bookingTypeId: string,
      bookingTypeName: string,
      price: number,
      platformFeeType: string,
      id: string
    
}

export interface VehicleInformationStepper {
    id: string;
    slug?: string;
    vehicleIdentifier: string;
    vehicleTypeName?: string;
    ownerId: string;
    name: string;
    city: string;
    address: string;
    latitude: number;
    longitude: number;
    vehicleTypeId: string;
    vehicleMakeId: string;
    vehicleModelId: string;
    yearOfRelease: number;
    hasInsurance: boolean;
    hasTracker: boolean;
    isVehicleUpgraded?: boolean;
    status: VehicleStatus;
    willProvideDriver: boolean;
    willProvideFuel: boolean;
    photos: CloudinaryPhotoUpload[];
    documents: { id: string; documentType: string; cloudinaryUrl: string; cloudinaryPublicId: string }[];
    features: VehicleFeatures[];
    supportedBookingTypes: BookingTypeData[];
    pricing: VehiclePricing[];
    discounts: { id: string; discountDurationId: string; discountDurationName: string; percentage: number }[];
    outOfBoundsAreaIds: string[];
    outOfBoundsAreas?: { id: string; name: string }[];
    supportedStates?: { id: string; stateId: string; stateName: string; countryName: string; surchargeFee: number }[];
    licensePlateNumber: string;
    stateOfRegistration: string;
    vehicleColorId: string;
    numberOfSeats: number;
    description: string;
    maxTripDurationUnit: string;
    maxTripDurationValue: number;
    advanceNoticeUnit: string;
    advanceNoticeValue: number;
    extraHourlyRate: number;
    outskirtFee: number;
    extremeFee: number;
    vehicleMake?: { id: string; name: string; code: string };
    vehicleModel?: { id: string; name: string; code: string };
    vehicleType?: { id: string; name: string };
    vehicleColor?: { id: string; name: string; hexCode: string };
    assignedDriver?: VehicleAssignedDriver | null;
    createdAt?: string;
    updatedAt?: string;
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


export type DriverProvisionMode = "existing" | "new" | "";

export interface AvailabilityAndPricingValues {
  
  maxTripDurationUnit: string,
  maxTripDurationValue: number,
  advanceNoticeUnit: string,
  advanceNoticeValue: number,
  willProvideDriver: string,
  willProvideFuel: string,
  driverMode: DriverProvisionMode,
  driverId: string,
  newDriverFirstName: string,
  newDriverLastName: string,
  newDriverPhoneNumber: string,
  newDriverLicenseNumber: string,
  newDriverLicenseExpiryDate: string,
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