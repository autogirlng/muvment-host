import {
  AdditionalVehicleInformationValues,
  AvailabilityAndPricingValues,
  BasicVehicleInformationValues,
  ChangePasswordValues,
  LoginFormValues,
  ProfileFormValues,
  ResetPasswordEmailValues,
  SetNewPasswordValues,
  SignupFormValues,
  VehiclePhotos,
  VerifyIdentityValues,
  VerifyPhoneNumberValues,
  WithdrawalAccountValues,
  WithdrawalValues,
} from "@/utils/types";

export const signUpFormInitialValues: SignupFormValues = {
  firstName: "",
  lastName: "",
  phoneNumber: "",
  country: "NG",
  countryCode: "+234",
  email: "",
  password: "",
  password_checks: {
    length: false,
    uppercase_letters: false,
    lowercase_letters: false,
    digit: false,
    special_character: false,
    no_space: false,
  },
};

export const loginFormInitialValues: LoginFormValues = {
  email: "",
  password: "",
};

export const resetPasswordEmailInitialValues: ResetPasswordEmailValues = {
  email: "",
};

export const setNewPasswordInitialValues: SetNewPasswordValues = {
  email: "",
  token: "",
  password: "",
  confirmPassword: "",
  password_checks: {
    length: false,
    uppercase_letters: false,
    lowercase_letters: false,
    digit: false,
    special_character: false,
    no_space: false,
  },
};

export const changePasswordInitialValues: ChangePasswordValues = {
  currentPassword: "",
  password: "",
  confirmPassword: "",
  password_checks: {
    length: false,
    uppercase_letters: false,
    lowercase_letters: false,
    digit: false,
    special_character: false,
    no_space: false,
  },
};

export const verifyPhoneNumberValues: VerifyPhoneNumberValues = {
  phoneNumber: "",
  countryCode: "+234",
  country: "NG",
};

export const verifyIdentityValues: VerifyIdentityValues = {
  day: "",
  month: "",
  year: "",
  bvn: "",
};

export const withdrawalAccountValues: WithdrawalAccountValues = {
  bank: null,
  bankCode: "",
  accountNumber: "",
};

export const basicVehicleInformationValues: BasicVehicleInformationValues = {
  listingName: "",
  location: "",
  address: "",
  vehicleType: "",
  make: "",
  model: "",
  yearOfRelease: "",
  hasTracker: "no",
  hasInsurance: "no",
};

export const additionalVehicleInformationValues: AdditionalVehicleInformationValues =
  {
    licensePlateNumber: "",
    stateOfRegistration: "",
    vehicleDescription: "",
    features: [],
    vehicleColor: "",
    numberOfSeats: "",
  };

export const vehiclePhotosValues: VehiclePhotos = {
  frontView: "",
  backView: "",
  sideView1: "",
  sideView2: "",
  interior: "",
  other: "",
};

export const availabilityAndPricingValues: AvailabilityAndPricingValues = {
  advanceNoticeInDays: "",
  minTripDurationInDays: "",
  maxTripDurationInDays: "",
  // selfDrive: "",
  driverProvided: "",
  fuelProvided: "",
  dailyRate: "",
  extraHourRate: "",
  airportPickup: "",
  threeDaysDiscount: "",
  sevenDaysDiscount: "",
  thirtyDaysDiscount: "",
  outskirtsLocation: [],
  outskirtsPrice: "",
};



export const withdrawalValues: WithdrawalValues = {
  amount: "",
};
