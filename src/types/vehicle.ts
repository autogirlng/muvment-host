import { Dispatch, SetStateAction } from "react";

import { 
  BookingTypeData, 
  BaseResponse, 
  Option,  
  Review, 
  CloudinaryPhotoUpload
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
    setCurrentStep: (step: number) => void
    setPhotoTipIndex?: Dispatch<SetStateAction<number>>
}

export  interface VehicleInfoState {
    vehicleTypes: Option[],
    vehicleMakes: Option[],
    vehicleModels: Option[]
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
  isVehicleUpgraded:string
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
    status: VehicleStatus,
    willProvideDriver: boolean,
    willProvideFuel: boolean,
    photos: CloudinaryPhotoUpload[],
    documents: any[],
    features: VehicleFeatures[],
    supportedBookingTypes: BookingTypeData[],
    pricing: VehiclePricing[],
    discounts: VehicleDiscounts[],
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