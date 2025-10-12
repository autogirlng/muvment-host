import { TripSettings } from "./trip";

export enum EarningPeriod {
  WEEK = "week",
  MONTH = "month",
  QUARTER = "quarter",
  ALL_TIME = "all_time",
}

export enum TransactionType {
  CREDIT = "CREDIT",
  DEBIT = "DEBIT",
}

export enum TransactionStatus {
  SUCCESS = "SUCCESS",
  PENDING = "PENDING",
  FAILED = "FAILED",
}

export enum TransactionOrigin {
  WITHDRAWAL = "WITHDRAWAL",
  BOOKING = "BOOKING",
}

export type WalletBalance = {
  id: string;
  userId: string;
  walletBalance: number;
  // otpExpires: null;
  locked: boolean;
  // createdAt: string;
  // updatedAt: string;
};

export enum PaymentBadgeStatus {
  SUCCESSFUL = "successful",
  PENDING = "pending",
  FAILED = "failed",
  PAID = "paid",
  CANCELLED = "cancelled",
}

export interface BankProp {
  bankId: string;
  baseUssdCode: string;
  code: string;
  name: string;
  nipBankCode: string;
  transferUssdTemplate: string;
  ussdTemplate: string;
}

export type BankCodes = {
  bankId: string;
  baseUssdCode: string;
  code: string;
  name: string;
  nipBankCode: string;
  transferUssdTemplate: string;
  ussdTemplate: string;
};

export interface Rate {
  value: number;
  unit: string;
}

export interface Discount {
  durationInDays: number;
  percentage: number;
}

export interface Pricing {
  dailyRate: Rate;
  extraHoursFee: number;
  // hourlyRate: Rate;
  airportPickupFee: number;
  discounts: Discount[];
}

export interface AvailabilityAndPricing {
  tripSettings: TripSettings;
  pricing: Pricing;
  outskirtsLocation?: string[];
  outskirtsPrice?: number;
}

export type Transaction = {
  id: string;
  transactionId: string;
  apiTransactionReference: string | null;
  date: string;
  time: string;
  amount: number;
  currencyCode: string;
  type: TransactionType;
  status: TransactionStatus;
  origin: TransactionOrigin;
  userId: string;
  bookingId: string | null;
  createdAt: string;
  updatedAt: string;
};

export type TransactionTableRow = {
  transactionId: string;
  date: string;
  bookingId: string;
  type: string;
  vehicle: string;
  purpose: string;
  amount: string;
  status: string;
  actions: string;
};
