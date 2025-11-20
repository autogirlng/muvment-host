import {BaseResponse} from "@/types"

export enum DriverStatus {
  ASSIGNED = "ASSIGNED",
  UNASSIGNED = "UNASSIGNED",
}

export interface AssignedDriver {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  vehicleId: string;
  bookingId: string;
  assignmentDate: string;
  status: DriverStatus;
  createdAt: string;
  updatedAt: string;
}


export interface AssignNewDriver {
  driverIdentifier: string;
  // bookingId: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

export interface DriverContent {
      
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

export interface AllDrivers extends BaseResponse{
  data: {
    content: DriverContent[];
    currentPage: number,
    pageSize:number,
    totalItems: number,
    totalPages: number
  }
}
