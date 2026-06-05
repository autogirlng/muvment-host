import { BaseResponse } from "@/types"

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

/** POST /v1/drivers — create driver payload */
export interface AssignNewDriver {
  driverIdentifier?: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  licenseNumber?: string;
  licenseExpiryDate?: string;
}

/** Driver summary returned on GET /vehicles/{id} as assignedDriver */
export interface VehicleAssignedDriver {
  id: string;
  driverIdentifier: string;
  fullName: string;
  phoneNumber: string;
  ownerType?: string;
  ownerName?: string;
  assignedVehicleId?: string;
  assignedVehicleIdentifier?: string;
  assignedVehicleName?: string;
  profilePictureUrl?: string;
  licenseNumber?: string;
  licenseExpiryDate?: string;
  active?: boolean;
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
  licenseNumber?: string;
  licenseExpiryDate?: string;
  active: boolean;
}

export interface AllDrivers extends BaseResponse {
  data: {
    content: DriverContent[];
    currentPage: number,
    pageSize: number,
    totalItems: number,
    totalPages: number
  }
}

/** GET /v1/drivers/{driverId} — single driver detail */
export interface DriverDetail {
  id: string;
  driverIdentifier: string;
  fullName: string;
  phoneNumber: string;
  ownerType: string;
  ownerName: string;
  assignedVehicleId?: string;
  assignedVehicleIdentifier?: string;
  assignedVehicleName?: string;
  profilePictureUrl?: string;
  licenseNumber?: string;
  licenseExpiryDate?: string;
  active: boolean;
}

export interface DriverDetailResponse extends BaseResponse {
  data: DriverDetail;
}

/** PATCH /v1/drivers/{driverId} — edit driver payload */
export interface EditDriverPayload {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  driverIdentifier?: string;
  licenseNumber?: string;
  licenseExpiryDate?: string;
}

/** Weekly schedule shift values (confirmed with backend). */
export type DriverShift = "NONE" | "DAY" | "NIGHT" | "ALL_DAY";

export const DRIVER_SHIFT_OPTIONS: { option: string; value: DriverShift }[] = [
  { option: "None", value: "NONE" },
  { option: "Day", value: "DAY" },
  { option: "Night", value: "NIGHT" },
  { option: "All Day", value: "ALL_DAY" },
];

export interface DriverSchedule {
  id?: string;
  weekStartDate: string;
  mondayShift: DriverShift;
  tuesdayShift: DriverShift;
  wednesdayShift: DriverShift;
  thursdayShift: DriverShift;
  fridayShift: DriverShift;
  saturdayShift: DriverShift;
  sundayShift: DriverShift;
}

export interface DriverScheduleResponse extends BaseResponse {
  data: DriverSchedule;
}

/** GET /v1/drivers/{driverId}/trips — driver trips */
export interface DriverTrip {
  id: string;
  startDateTime: string;
  endDateTime: string;
  customerName: string;
  customerPhoneNumber: string;
  vehicleId: string;
  vehicleIdentifier: string;
  vehicleName: string;
  driverName: string;
  driverPhoneNumber: string;
  bookingTypeName: string;
  duration: string;
  city: string;
  pickupLocation: string;
  bookingStatus: string;
  tripStatus: string;
  totalPrice: number;
  bookingId: string;
  createdAt: string;
  bookingCategory: string;
  ongoing: boolean;
}

export interface DriverTripsResponse extends BaseResponse {
  data: {
    content: DriverTrip[];
    currentPage: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
}
