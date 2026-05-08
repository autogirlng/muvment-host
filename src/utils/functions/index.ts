import { AxiosError } from "axios";
import { toast } from "react-toastify";
import { ErrorResponse, NotificationType } from "@/types";

import {
  lowercaseRegex,
  numberRegex,
  spacesRegex,
  specialCharRegex,
  uppercaseRegex,
} from "@/utils/constants";
import { daysOfTheWeek } from "../data";
import { Icons } from "@/ui";


export const toScreamingSnakeCase = (str:string) => {
  return str
    .replace(/([a-z])([A-Z])/g, '$1_$2') // insert underscore before capital letters
    .toUpperCase(); // convert everything to uppercase
}

export const isLengthValid = (password: string): boolean => {
  const isLengthValid = password.length >= 8;
  return isLengthValid;
};

export const isUpperCaseValid = (password: string): boolean => {
  const hasUppercase = uppercaseRegex.test(password);
  return hasUppercase;
};

export const isLowerCaseValid = (password: string): boolean => {
  const hasLowercase = lowercaseRegex.test(password);
  return hasLowercase;
};

export const isDigitValid = (password: string): boolean => {
  const hasNumber = numberRegex.test(password);
  return hasNumber;
};

export const isSpecialCharacterValid = (password: string): boolean => {
  const hasSpecialChar = specialCharRegex.test(password);
  return hasSpecialChar;
};

export const isSpaceValid = (password: string): boolean => {
  const noSpace = spacesRegex.test(password);
  return noSpace;
};

export const validatePhoneNumber = (phoneNumber: string, country: string) => {
  if (!phoneNumber) return false;

  const normalizedPhoneNumber = replaceCharactersWithString(phoneNumber);
  let isPhoneNumberValid = false;

  if (country === "NG") {
    isPhoneNumberValid =
      normalizedPhoneNumber.length === 11 || normalizedPhoneNumber.length === 10;
  } else {
    isPhoneNumberValid = normalizedPhoneNumber.length === 10;
  }

  return isPhoneNumberValid;
};

export const replaceCharactersWithString = (str: string): string => {
  return str.replace(/\D/g, "");
};

export const addSpaceBeforeUppercase = (str: string): string => {
  return str?.replace(/([a-z])([A-Z])/g, "$1 $2");
};

export const keyAndValueInAChip = (
  key: string,
  value: string | number
): string => {
  return `${addSpaceBeforeUppercase(key.charAt(0).toUpperCase() + key.slice(1))}: ${value}`;
};

export const getInitialsFromName = (
  firstName: string,
  lastName: string
): string => {
  if(firstName && lastName){
const firstInitial = firstName.charAt(0).toUpperCase();
  const lastInitial = lastName.charAt(0).toUpperCase();

  return `${firstInitial}${lastInitial}`;
  }
  return ""
};

export const mapRentalAvailabilityToArray = (days: {
  [key: string]: boolean;
}): string[] => {
  return Object.keys(days).filter((day) => days[day]);
};

export const mapRentalAvailabilityArrayToObject = (
  daysArray: string[]
): {
  [key: string]: boolean;
} => {
  return daysOfTheWeek.reduce(
    (acc, day) => {
      acc[day] = daysArray.includes(day);
      return acc;
    },
    {} as { [key: string]: boolean }
  );
};

export const copyToCipboard = (text: string) => {
  navigator.clipboard.writeText(text);
  toast.success("Copied to clipboard");
};

export const formatNumberWithCommas = (number: string | number): string => {
  return number?.toLocaleString();
};

export const formatPhoneNumber = (phoneNumber: string): string => {
  const firstPart = phoneNumber.slice(0, 3);
  const lastPart = phoneNumber.slice(-3);
  const middlePart = "*".repeat(phoneNumber.length - 6);

  return `${firstPart}${middlePart}${lastPart}`;
};

// export const calculateServiceFee = (
//   price: number,
//   standardFee: number
// ): number => {
//   return price * standardFee;
// };

// export const calculateRateGuestsWillSee = (
//   price: number,
//   serviceFee: number
// ): number => {
//   return price + serviceFee;
// };

// ============================= Notification Icons, Color and Bg Color starts ============================= //
export const getNotificationIcon = (type: string) => {
  switch (type) {
    case NotificationType.BOOKING_REQUEST:
      return Icons.ic_booking_request;
    case NotificationType.BOOKING_CONFIRMED:
      return Icons.ic_booking_confirmed;
    case NotificationType.BOOKING_CANCELED:
      return Icons.ic_booking_canceled;
    case NotificationType.UPCOMING_BOOKING:
      return Icons.ic_upcoming_booking;
    case NotificationType.GUEST_CHECK_IN:
      return Icons.ic_check_in;
    case NotificationType.GUEST_CHECK_OUT:
      return Icons.ic_check_out;
    case NotificationType.VEHICLE_ACCEPTED:
      return Icons.ic_car;
    case NotificationType.PAYMENT_RECEIVED:
      return Icons.ic_payment_received;
    case NotificationType.SECURITY_ALERT:
      return Icons.ic_lock;
    case NotificationType.NEW_REVIEW:
      return Icons.ic_star_square;
    case NotificationType.SPECIAL_OFFER:
      return Icons.ic_upcoming_booking;
    default:
      return Icons.ic_lock;
  }
};

export const getNotificationIconColor = (type: string) => {
  switch (type) {
    case NotificationType.BOOKING_REQUEST:
      return "text-primary-600";
    case NotificationType.BOOKING_CONFIRMED:
      return "text-success-600";
    case NotificationType.BOOKING_CANCELED:
      return "text-error-900";
    case NotificationType.UPCOMING_BOOKING:
      return "text-warning-400";
    case NotificationType.GUEST_CHECK_IN:
      return "text-grey-700";
    case NotificationType.GUEST_CHECK_OUT:
      return "text-grey-700";
    case NotificationType.VEHICLE_ACCEPTED:
      return "text-success-600";
    case NotificationType.PAYMENT_RECEIVED:
      return "text-success-600";
    case NotificationType.SECURITY_ALERT:
      return "text-error-900";
    case NotificationType.NEW_REVIEW:
      return "text-warning-400";
    case NotificationType.SPECIAL_OFFER:
      return "text-warning-400";
    default:
      return "text-grey-700";
  }
};

export const getNotificationBgColor = (type: string) => {
  switch (type) {
    case NotificationType.BOOKING_REQUEST:
      return "bg-primary-75";
    case NotificationType.BOOKING_CONFIRMED:
      return "bg-success-75";
    case NotificationType.BOOKING_CANCELED:
      return "bg-error-100";
    case NotificationType.UPCOMING_BOOKING:
      return "bg-warning-75";
    case NotificationType.GUEST_CHECK_IN:
      return "bg-grey-90";
    case NotificationType.GUEST_CHECK_OUT:
      return "bg-grey-90";
    case NotificationType.VEHICLE_ACCEPTED:
      return "bg-success-75";
    case NotificationType.PAYMENT_RECEIVED:
      return "bg-success-75";
    case NotificationType.SECURITY_ALERT:
      return "bg-error-100";
    case NotificationType.NEW_REVIEW:
      return "bg-warning-75";
    case NotificationType.SPECIAL_OFFER:
      return "bg-warning-75";
    default:
      return "bg-grey-90";
  }
};
// ============================= Notification Icons, Color and Bg Color ends ============================= //

// Debounce function
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
) => {
  let timer: ReturnType<typeof setTimeout> | null;

  return function (...args: Parameters<T>) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(null, args);
    }, delay);
  };
};

export const handleFilterQuery = ({
  filters,
  month,
  year,
  search,
  startDate,
  endDate,
}: {
  filters: Record<string, string[]>;
  month?: number;
  year?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
}) => {
  const filterQuery = new URLSearchParams();
  Object.entries(filters).forEach(([key, values]) => {
    values.forEach((value) => {
      if (key === "vehicle")
        return filterQuery.append("vehicleId", value.toString());
      else return filterQuery.append(key, value);
    });
  });

  if (month) filterQuery.append("month", month.toString());
  if (year) filterQuery.append("year", year.toString());
  if (search) filterQuery.append("searchTerm", search.toString());
  if (startDate) filterQuery.append("startDate", startDate.toString());
  if (endDate) filterQuery.append("endDate", endDate.toString());
  return filterQuery.toString();
};

const KNOWN_API_ERROR_MESSAGES: Record<string, string> = {
  INCORRECT_OTP: "Incorrect code. Please try again.",
  OTP_NOT_FOUND: "Incorrect code. Please try again.",
  EMAIL_NOT_CONFIRMED: "Please verify your email to continue.",
  INVALID_CREDENTIALS: "Invalid email or password.",
  USER_ALREADY_EXIST: "An account with this email already exists.",
  PHONE_ALREADY_USED: "This phone number is already registered.",
  USER_NOT_FOUND: "User not found.",
};

export function pickSuccessMessage(data: unknown, fallback: string): string {
  if (data != null && typeof data === "object" && "message" in data) {
    const m = (data as { message: unknown }).message;
    if (typeof m === "string" && m.trim().length > 0) return m;
  }
  return fallback;
}

function resolveErrorToastMessage(error: AxiosError<ErrorResponse>): string {
  if (error?.message === "Network Error") {
    return "Network Error";
  }

  const body = error.response?.data as
    | ErrorResponse
    | Record<string, unknown>
    | undefined;

  let raw: string | undefined;

  if (body && typeof body === "object") {
    const msg = (body as { message?: unknown }).message;
    if (typeof msg === "string" && msg.trim()) raw = msg;

    const dataField = (body as { data?: unknown }).data;
    if (!raw && typeof dataField === "string" && dataField.trim()) {
      raw = dataField;
    } else if (!raw && dataField != null && typeof dataField !== "object") {
      raw = String(dataField);
    }
  }

  if (!raw) {
    return error.message?.trim() || "Something went wrong. Please try again.";
  }

  return KNOWN_API_ERROR_MESSAGES[raw] ?? raw;
}

export const handleErrors = (
  error: AxiosError<ErrorResponse>,
  page?: string
) => {
  console.log(page ? `[${page}] API error` : "API error", {
    status: error.response?.status,
    data: error.response?.data,
    message: error.message,
  });

  const msg = resolveErrorToastMessage(error);
  return toast.error(msg);
};
