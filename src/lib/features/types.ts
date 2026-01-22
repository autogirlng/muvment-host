import { WithdrawalAccountValues } from "@/types";
import { User, VehicleInformation } from "@/types";

export interface AccountSetupSliceOtpState {
  phoneNumberToVerify: string;
  accountDetails: WithdrawalAccountValues;
  withdrawalAccountSetupOtp: string;
}


export interface ForgotPasswordSliceOtpState {
  forgotPasswordOtp: string;
}

export interface UserSliceState {
  user: User | null;
  userToken: string;
  isAuthenticated: boolean;
  isLoading: boolean;
}





export interface VehicleState {
  vehicle: VehicleInformation | null;
  currentStep: number;
}