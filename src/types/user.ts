import { TopRatedVehicleType } from "./vehicle";

type UserVerification = {
  id: string;
  phoneNumber: string;
  otpToken: string | null;
  bvnNumber: string | null;
  dob: string | null;
  userId: string;
  createdAt: string;
  updatedAt: string;
};


export interface DashboardStatistics {
  totalEarnings: number;
  totalOnboardedVehicles: number;
  totalCompletedRides: number;
  walletBalance: number;
  topRatedVehicle: null | TopRatedVehicleType;
}

export interface EarningsStatistics {
  bookingsCompleted: number;
  cancelledBookings: number;
  numberOfCustomers: number;
  totalRevenue: number;
}

export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  dob: string | null;
  profileImage: string | null;
  countryCode: string;
  country: string;
  emailConfirmed: boolean;
  phoneNumber: string;
  phoneVerified: boolean;
  withdrawalAccountVerified: boolean;
  bvnVerified: boolean;
  bio: string | null;
  city: string | null;
  userRole: "HOST";
  businessLogo: string | null;
  businessName: string | null;
  businessAddress: string | null;
  businessPhoneNumber: string | null;
  businessEmail: string | null;
  createdAt: string;
  updatedAt: string;
  Verification: UserVerification;
  averageRating: number;
  statistics?: EarningsStatistics;
  isBusiness: boolean;
};

export interface UserState {
  user: User | null;
  userToken: string;
  isAuthenticated: boolean;
  isLoading: boolean;
}

