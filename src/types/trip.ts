

export interface TripSettings {
  advanceNotice: string;
  maxTripDuration: string;
  provideDriver: boolean;
  fuelProvided: boolean;
}


export interface ApiResponse<T> {
  status: "SUCCESSFUL" | "FAILED";
  message: string;
  errorCode?: string;
  data: T;
  timestamp: string;
}

export interface PageableResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
}


export interface HostTripItem {
  id: string;
  startDateTime: string;
  endDateTime: string;
  vehicleId: string;
  vehicleIdentifier: string;
  vehicleName: string;
  hostName: string;
  hostEmail: string;
  hostPhoneNumber: string;
  driverName: string;
  driverPhoneNumber: string;
  bookingTypeName: string;
  bookedHours: number;
  city: string;
  pickupLocation: string;
  bookingStatus: string;
  tripStatus: string;
  totalPrice: number;
  bookingId: string;
  createdAt: string;
  bookingCategory: string;
}

export interface HostTripsParams {
  page?: number;
  size?: number;
  site?: string;
  tripStatus?: "UPCOMING" | "IN_PROGRESS" | "COMING_TO_AN_END" | "COMPLETED" | "DELAYED" | "EXTENDED" | "CANCELLED";
}