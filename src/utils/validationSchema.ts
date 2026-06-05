import { array, object, ref, string, mixed, number, boolean } from "yup";
import {
  emailRegEx,
  VEHICLE_MAKE_PLACEHOLDER,
  VEHICLE_SELECT_PLACEHOLDER,
} from "@/utils/constants";
import { validatePhoneNumber } from "./functions";

export const newLetterValidationSchema = object().shape({
  email: string()
    .email("Please enter a valid email")
    .required("Please enter your email"),
});

export const signupFormValidationSchema = object().shape({
  firstName: string().required("Please enter your first name"),
  lastName: string().required("Please enter your last name"),
  phoneNumber: string()
    .required("Please enter your phone number")
    .test("phoneNumber", "Invalid phone number", function (val) {
      const { country } = this.parent;
      return validatePhoneNumber(val, country);
    }),
  country: string().required("Please enter your country code"),
  email: string()
    .email("Please enter a valid email address")
    .required("Please enter your email")
    .matches(emailRegEx, "Please enter a valid email address"),
  password: string().required("Please enter your password"),
});

export const loginFormValidationSchema = object().shape({
  email: string()
    .email("Please enter a valid email")
    .required("Please enter your email"),
  password: string()
    .required("Please enter your password")
});

export const resetPasswordEmailValidationSchema = object().shape({
  email: string()
    .email("Please enter a valid email")
    .required("Please enter your email"),
});

export const setNewPasswordValidationSchema = object().shape({
  password: string().required("Please enter your password"),
  confirmPassword: string()
    .required("Please confirm your password")
    .oneOf([ref("password")], "The passwords doesn’t match."),
});

export const verifyPhoneNumberSchema = object().shape({
  country: string().required("Please select country"),
  phoneNumber: string()
    .required("Please enter your phone number")
    .test("phoneNumber", "Invalid phone number", function (val) {
      const { country } = this.parent;
      return validatePhoneNumber(val, country);
    }),
});

export const verifyIdentitySchema = object().shape({
  // valdate day, month and year as dob
  // dob: string().required("Please enter your dob"),
  bvn: string().required("Please enter your bvn"),
});

export const withdrawalAccountSchema = object().shape({
  bankCode: string().required("Please enter your bank"),
  accountNumber: string().required("Please enter your account number"),
});

export const basicVehicleInformationSchema = object().shape({

  name: string().required("Vehicle name is required"),
  city: string().required("City is required"),
  address: string().required("Address is required"),
  vehicleTypeId: string()
    .required("Please select vehicle type")
    .notOneOf([VEHICLE_SELECT_PLACEHOLDER], "Please select vehicle type"),
  vehicleMakeId: string()
    .required("Please select vehicle make")
    .notOneOf([VEHICLE_MAKE_PLACEHOLDER], "Please select vehicle make"),
  vehicleModelId: string()
    .required("Please select vehicle model")
    .notOneOf([VEHICLE_SELECT_PLACEHOLDER], "Please select vehicle model"),
  yearOfRelease: number()
    .min(2013, "Please select year of release")
    .required("Please select year of release"),
  hasInsurance: string()
    .required("Please select insurance status")
    .notOneOf([VEHICLE_SELECT_PLACEHOLDER], "Please select insurance status"),
  hasTracker: string()
    .required("Please select tracker status")
    .notOneOf([VEHICLE_SELECT_PLACEHOLDER], "Please select tracker status"),
  isVehicleUpgraded: string()
    .required("Please select upgraded status")
    .notOneOf([VEHICLE_SELECT_PLACEHOLDER], "Please select upgraded status"),
});

export const addtionalVehicleInformationSchema = object().shape({
  licensePlateNumber: string().required("License plate number is required"),
  stateOfRegistration: string().required("State of registration is required"),
  description: string()
    .required("Vehicle description is required")
    .min(30, "30 characters minimum"),
  vehicleColorId: string().required("Vehicle color is required"),
  numberOfSeats: string().required("Number of seats is required"),
  featureIds: array().min(1, "Please select at least one feature"),

});

export const documentVehicleInformationSchema = object().shape({
  proofOfOwnership: mixed().required("Proof of ownership is required."),
  vehicleRegistration: mixed().required(
    "Vehicle registration document is required."
  ),
  insuranceCertificate: mixed().required("Insurance certificate is required."),
  inspectionReport: mixed().required(
    "Vehicle inspection report is required."
  ),
  maintenanceHistory: mixed().nullable(),
  authorizationLetter: mixed().required("Authorization letter is required."),
});
const vehiclePhotoField = (label: string) =>
  mixed()
    .required(`Please upload ${label}`)
    .test("is-photo", `Please upload ${label}`, (value) => {
      if (value instanceof File) return true;
      return typeof value === "string" && value.trim().length > 0;
    });

export const vehiclePhotosSchema = object().shape({
  frontView: vehiclePhotoField("Front view image"),
  backView: vehiclePhotoField("Back view image"),
  sideView1: vehiclePhotoField("Side view image"),
  sideView2: vehiclePhotoField("Side view image"),
  interior: vehiclePhotoField("Interior image"),
  other: vehiclePhotoField("other image"),
});

export const availabilityAndPricingSchema = object().shape({
 
  maxTripDurationValue: number()
    .typeError("Maximum duration is required")
    .required("Maximum duration is required"),
  advanceNoticeValue: number()
    .typeError("Advance notice is required")
    .required("Advance notice is required"),
  willProvideDriver: string()
    .required("Please select an option")
    .notOneOf([VEHICLE_SELECT_PLACEHOLDER], "Please select an option"),
  willProvideFuel: string()
    .required("Please select an option")
    .notOneOf([VEHICLE_SELECT_PLACEHOLDER], "Please select an option"),
  driverMode: string().when("willProvideDriver", {
    is: "yes",
    then: (schema) => schema.oneOf(["existing", "new", ""]).notRequired(),
    otherwise: (schema) => schema.notRequired(),
  }),
  driverId: string().when(["willProvideDriver", "driverMode"], {
    is: (willProvideDriver: string, driverMode: string) =>
      willProvideDriver === "yes" && driverMode === "existing",
    then: (schema) =>
      schema
        .required("Please select a driver")
        .notOneOf([VEHICLE_SELECT_PLACEHOLDER], "Please select a driver"),
    otherwise: (schema) => schema.notRequired(),
  }),
  newDriverFirstName: string().when(["willProvideDriver", "driverMode"], {
    is: (willProvideDriver: string, driverMode: string) =>
      willProvideDriver === "yes" && driverMode === "new",
    then: (schema) => schema.required("First name is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  newDriverLastName: string().when(["willProvideDriver", "driverMode"], {
    is: (willProvideDriver: string, driverMode: string) =>
      willProvideDriver === "yes" && driverMode === "new",
    then: (schema) => schema.required("Last name is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  newDriverPhoneNumber: string().when(["willProvideDriver", "driverMode"], {
    is: (willProvideDriver: string, driverMode: string) =>
      willProvideDriver === "yes" && driverMode === "new",
    then: (schema) => schema.required("Phone number is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  newDriverLicenseNumber: string().when(["willProvideDriver", "driverMode"], {
    is: (willProvideDriver: string, driverMode: string) =>
      willProvideDriver === "yes" && driverMode === "new",
    then: (schema) => schema.required("License number is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  newDriverLicenseExpiryDate: string().when(["willProvideDriver", "driverMode"], {
    is: (willProvideDriver: string, driverMode: string) =>
      willProvideDriver === "yes" && driverMode === "new",
    then: (schema) => schema.required("License expiry date is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  supportedBookingTypeIds: array().min(1, "Please select at least one booking type"),
  outOfBoundsAreaIds: array().min(0),
  outskirtFee: mixed()
    .transform((value) => (value === "" || value === null || value === undefined ? 0 : Number(value)))
    .optional(),
  extremeFee: mixed()
    .transform((value) => (value === "" || value === null || value === undefined ? 0 : Number(value)))
    .optional(),
});

export const assignNewDriverFormValidationSchema = object().shape({
  firstName: string().required("Please enter your first name"),
  lastName: string().required("Please enter your last name"),
  phoneNumber: string()
    .required("Please enter your phone number")
    .test("phoneNumber", "Invalid phone number", function (val) {
      const { country } = this.parent;
      return validatePhoneNumber(val, country);
    }),
  // country: string().required("Please enter your country code"),
});

export const profileFormValidationSchema = object().shape({
  firstName: string().required("Please enter your first name"),
  lastName: string().required("Please enter your last name"),

  // country: string().required("Please enter your country code"),
  // bio: string().required("Please enter your bio"),
  // city: string().required("Please select your city"),
});

export const changePasswordValidationSchema = object().shape({
  currentPassword: string().required("Please enter your current password"),

  password: string().required("Please enter your new password"),

  confirmPassword: string()
    .required("Please confirm your password")
    .oneOf([ref("password")], "The passwords doesn’t match."),
});

export const withdrawalSchema = object().shape({
  amount: string().required("Please enter amount to withdraw"),
  // minimum of 20k
});

export const reportBookingSchema = object().shape({
  message: string().required("Please type a message"),
});

export const replyReviewSchema = object().shape({
  message: string().required("Please type a message"),
});
