"use client";

import { Form, Formik } from "formik";
import * as Yup from "yup";
import { getCountryCallingCode } from "react-phone-number-input";
import { InputField, PhoneNumberAndCountryField, Button } from "@/ui";
import { replaceCharactersWithString } from "@/utils/functions";

export interface DriverFormValues {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  licenseNumber: string;
  licenseExpiryDate: string;
  country?: string;
  countryCode?: string;
}

const validationSchema = Yup.object({
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  phoneNumber: Yup.string().required("Phone number is required"),
  licenseNumber: Yup.string().required("License number is required"),
  licenseExpiryDate: Yup.string().required("License expiry date is required"),
});

export default function DriverForm({
  initialValues,
  submitLabel = "Save Driver",
  isPending,
  onCancel,
  onSubmit,
}: {
  initialValues?: Partial<DriverFormValues>;
  submitLabel?: string;
  isPending: boolean;
  onCancel: () => void;
  onSubmit: (values: DriverFormValues) => void;
}) {
  return (
    <Formik
      initialValues={{
        firstName: initialValues?.firstName ?? "",
        lastName: initialValues?.lastName ?? "",
        phoneNumber: initialValues?.phoneNumber ?? "",
        licenseNumber: initialValues?.licenseNumber ?? "",
        licenseExpiryDate: initialValues?.licenseExpiryDate ?? "",
        country: "NG",
        countryCode: "+234",
      }}
      validationSchema={validationSchema}
      enableReinitialize
      onSubmit={(values, { setSubmitting }) => {
        onSubmit(values);
        setSubmitting(false);
      }}
    >
      {({
        values,
        touched,
        errors,
        handleBlur,
        handleChange,
        setFieldValue,
        setFieldTouched,
        isSubmitting,
      }) => (
        <Form className="space-y-6">
          <div className="flex flex-col gap-6 sm:flex-row">
            <InputField
              name="firstName"
              id="firstName"
              type="text"
              label="First name"
              placeholder="Enter first name"
              value={values.firstName}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.firstName && touched.firstName ? errors.firstName : ""}
            />
            <InputField
              name="lastName"
              id="lastName"
              type="text"
              label="Last name"
              placeholder="Enter last name"
              value={values.lastName}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.lastName && touched.lastName ? errors.lastName : ""}
            />
          </div>

          <PhoneNumberAndCountryField
            inputName="phoneNumber"
            selectName="country"
            inputId="phoneNumber"
            selectId="country"
            label="Phone Number"
            inputPlaceholder="Enter phone number"
            selectPlaceholder="+234"
            inputValue={values.phoneNumber}
            selectValue={values.country || "NG"}
            inputOnChange={(event) => {
              const number = replaceCharactersWithString(event.target.value);
              setFieldTouched("phoneNumber", true);
              setFieldValue("phoneNumber", number);
            }}
            selectOnChange={(value: string) => {
              const countryCode = `+${getCountryCallingCode(value as any)}`;
              setFieldValue("country", value);
              setFieldValue("countryCode", countryCode);
            }}
            inputOnBlur={handleBlur}
            selectOnBlur={handleBlur}
            selectClassname="!w-[170px]"
            inputError={errors.phoneNumber && touched.phoneNumber ? errors.phoneNumber : ""}
          />

          <InputField
            name="licenseNumber"
            id="licenseNumber"
            type="text"
            label="License Number"
            placeholder="Enter license number"
            value={values.licenseNumber}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.licenseNumber && touched.licenseNumber ? errors.licenseNumber : ""}
          />

          <InputField
            name="licenseExpiryDate"
            id="licenseExpiryDate"
            type="date"
            label="License Expiry Date"
            placeholder="Select expiry date"
            value={values.licenseExpiryDate}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.licenseExpiryDate && touched.licenseExpiryDate ? errors.licenseExpiryDate : ""}
          />

          <div className="flex gap-4 pt-2">
            <Button
              fullWidth
              variant="filled"
              color="white"
              type="button"
              className="!bg-grey-90 !text-grey-700"
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button
              fullWidth
              variant="filled"
              color="primary"
              type="submit"
              loading={isSubmitting || isPending}
              disabled={isSubmitting || isPending}
            >
              {submitLabel}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
