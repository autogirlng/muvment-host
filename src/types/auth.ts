import { JSX } from "react";
import { User, BankProp } from "@/types";



export interface AccountSetupTask {
  icon: JSX.Element;
  title: string;
  link: string;
  linkText: string;
  isCompleted: boolean;
  taskId: keyof User["data"];
}

interface PasswordChecks {
  length: boolean;
  uppercase_letters: boolean;
  lowercase_letters: boolean;
  digit: boolean;
  special_character: boolean;
  no_space: boolean;
}

export interface SignupFormValues {
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  phoneNumber: string,
  userType: "HOST",
  referralCode?: string,
  country: string;
  countryCode: string;
  password_checks?: PasswordChecks;
}

export interface LoginFormValues {
  email: string;
  password: string;
}

export interface loginResponse {
  status: string;
  message: string;
  errorCode: string;
  data: {
    accessToken: string;
    refreshToken: string;
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    profilePictureUrl: string;
    emailVerified: boolean;
    phoneVerified: boolean;
  },
  timestamp: string;
}

export interface verifyEmailValues {
  email: string;
  token: string;
}

export interface verifyEmail {
  email:string;
  otp:string;
}

export interface ResendVerifyEmailTokenValues {
  email: string;
}
export interface ResetPasswordEmailValues {
  email: string;
}

export interface VerifyPhoneNumberTokenValues {
  phoneNumber?: string;
  email?:string;
  otp: string;
}

export interface SendPhoneNumberTokenValues {
  phoneNumber: string;
  email:string;
}

export interface VerifyOtpValues {
  token: string;
}

export interface SetNewPasswordValues {
  email: string;
  token: string;
  password?: string;
  confirmPassword: string;
  password_checks?: PasswordChecks;
}

export interface ChangePasswordValues {
  currentPassword: string;
  password: string;
  confirmPassword: string;
  password_checks?: PasswordChecks;
}

export interface VerifyPhoneNumberValues {
  phoneNumber: string;
  countryCode: string;
  country: string;
}

export interface VerifyIdentityValues {
  day: string;
  month: string;
  year: string;
  bvn: string;
}

export interface WithdrawalAccountValues {
  bank?: BankProp | null;
  bankCode: string;
  accountNumber: string;
  accountName?: string;
}


export interface ProfileFormValues {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  country: string;
  countryCode: string;
  bio: string;
  profileImage?: string;
  city: string;
  // isBusiness: boolean;
  // businessAddress: string;
  // businessEmail: string;
  // businessLogo?: string;
  // businessName: string;
  // businessPhoneNumber: string;
  // businessCountry?: string;
  // businessCountryCode?: string;
}

export interface WithdrawalValues {
  amount: string;
}


