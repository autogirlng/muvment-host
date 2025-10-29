import { VehicleStatus, MappedInformation, EarningsStatistics, ListingInformation, AssignNewDriver, VehicleInformationStepper} from "@/types";
import { ReactNode } from "react";

export interface DeleteListingProps  {
  handleModal: (open: boolean) => void;
  id?: string;
  isDraft?: boolean;
};

export interface DeactivateListingProps  { 
    handleModal: (open: boolean) => void; 
    id?: string
 };

 
 export interface ListingDetailHeaderProps  {
   name?: string;
   status: VehicleStatus;
   id?: string;
 };

export interface ListingDetailsVehicleImagesProps { vehicleImages: string[] };



export interface Extras {
    name: string;
    icon: ReactNode;
    id: string;
};

export interface ListingDetailsVehicleDetailsProps { vehicleDetails: MappedInformation[]; extras: Extras[] };

export interface ListingDetailsEarningsProps { statistics: EarningsStatistics | null | undefined };


export interface VehicleInformationProps  {
    listingDetails: VehicleInformationStepper | null;
};

export interface VehicleReviewsProps { id: string };


export interface ListingDetailsUpcomingBookingsProps  { vehicleId: string };

export interface BookingDataProps  {
    title: string;
    value: string;
};

export interface BookingCardProps {
    guestName: string;
    startDate: string;
    endDate: string;
    active: boolean;
}

export interface AssignDriverFormProps {
    handleModal: (open: boolean) => void;
    vehicleId: string;
    assignNewDriver: (values: AssignNewDriver) => void;
    isPending: boolean;
};


export interface DriverDetailsProps { id: string };

interface Driver {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    numberOfBookingsAssigned?: number;
};

export interface DriverCardProps {
    driver: Driver;
}

export interface ViewListingProps { id: string };


