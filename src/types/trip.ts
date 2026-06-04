

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


export interface TripAgent {
  name: string;
  email: string;
  phoneNumber: string;
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
  invoiceNumber?: string;
  createdAt: string;
  bookingCategory: string;
  customerAgent?: TripAgent;
  opsAgent?: TripAgent;
}

export interface HostTripsParams {
  page?: number;
  size?: number;
  site?: string;
  /** Only these are functional (computed from time constraints) */
  tripStatus?: "UPCOMING" | "IN_PROGRESS" | "COMING_TO_AN_END" | "COMPLETED";
  /** Search/filter by invoice number (not bookingId) */
  invoiceNumber?: string;
}