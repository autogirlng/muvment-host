import {  TopRatedVehicleType } from "@/types";

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


export interface User {
    status: string,
    message: string,
    errorCode?:string,
    data: {
        userId: string,
        firstName: string,
        lastName: string,
        email: string,
        phoneNumber: string,
        userType: "HOST",
        emailVerified: boolean,
        phoneVerified: boolean, 
        profilePictureUrl?: string,
        referralCode?: string,
    },
    timestamp: string
}

export interface UserState {
  user: User | null;
  userToken: string;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface UpdateProfilePictureResponse {
    status: string,
    message: string,
    data: string,
    timestamp: string
}

