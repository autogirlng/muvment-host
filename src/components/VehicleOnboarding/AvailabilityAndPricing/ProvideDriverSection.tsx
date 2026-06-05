"use client";

import { useMemo } from "react";
import { getCountryCallingCode } from "react-phone-number-input";
import { InputField, PhoneNumberAndCountryField, SelectInput } from "@/ui";
import { VEHICLE_SELECT_PLACEHOLDER } from "@/utils/constants";
import { replaceCharactersWithString } from "@/utils/functions";
import type { DriverContent, VehicleAssignedDriver } from "@/types";
import type { DriverProvisionMode } from "@/types/vehicle";
import cn from "classnames";

type ProvideDriverSectionProps = {
  driverMode: DriverProvisionMode;
  driverId: string;
  newDriverFirstName: string;
  newDriverLastName: string;
  newDriverPhoneNumber: string;
  newDriverLicenseNumber: string;
  newDriverLicenseExpiryDate: string;
  drivers: DriverContent[];
  assignedDriver?: VehicleAssignedDriver | null;
  driversLoading: boolean;
  errors: Record<string, string | string[] | undefined>;
  touched: Record<string, boolean | undefined>;
  setFieldValue: (field: string, value: unknown, shouldValidate?: boolean) => void;
  setFieldTouched: (field: string, touched?: boolean, shouldValidate?: boolean) => void;
  handleBlur: (e: React.FocusEvent<unknown>) => void;
  handleChange: (e: React.ChangeEvent<unknown>) => void;
};

function fieldError(
  errors: Record<string, string | string[] | undefined>,
  field: string
): string {
  const value = errors[field];
  if (!value) return "";
  return Array.isArray(value) ? value.join(", ") : value;
}

const modeOptions: { id: DriverProvisionMode; label: string }[] = [
  { id: "existing", label: "Select existing driver" },
  { id: "new", label: "Add new driver" },
];

export default function ProvideDriverSection({
  driverMode,
  driverId,
  newDriverFirstName,
  newDriverLastName,
  newDriverPhoneNumber,
  newDriverLicenseNumber,
  newDriverLicenseExpiryDate,
  drivers,
  assignedDriver,
  driversLoading,
  errors,
  touched,
  setFieldValue,
  setFieldTouched,
  handleBlur,
  handleChange,
}: ProvideDriverSectionProps) {
  const driverOptions = useMemo(() => {
    const options = [
      { option: "Select driver", value: VEHICLE_SELECT_PLACEHOLDER },
      ...drivers.map((driver) => ({
        option: driver.fullName,
        value: driver.id,
      })),
    ];

    if (
      assignedDriver?.id &&
      !options.some((option) => option.value === assignedDriver.id)
    ) {
      options.push({
        option: assignedDriver.fullName,
        value: assignedDriver.id,
      });
    }

    return options;
  }, [drivers, assignedDriver]);

  return (
    <div className="rounded-2xl border border-grey-200 bg-grey-50/60 p-5 space-y-5">
      <div>
        <p className="text-sm font-semibold text-grey-900">Driver details</p>
        <p className="text-xs text-grey-500 mt-1">
          Choose an existing driver or add a new one. A driver is only assigned to
          this vehicle when you explicitly select or create one below.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        {modeOptions.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => {
              setFieldValue("driverMode", option.id, true);
              setFieldTouched("driverMode", true, false);
            }}
            className={cn(
              "rounded-full px-4 py-2 text-xs font-semibold transition-colors",
              driverMode === option.id
                ? "bg-primary-500 text-white"
                : "bg-white text-grey-700 border border-grey-200 hover:border-primary-300"
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
      {errors.driverMode && touched.driverMode && (
        <p className="text-error-500 text-sm">{fieldError(errors, "driverMode")}</p>
      )}

      {driverMode === "existing" && (
        <SelectInput
          id="driverId"
          label="Driver"
          placeholder={driversLoading ? "Loading drivers…" : "Select driver"}
          variant="outlined"
          options={driverOptions}
          value={driverId}
          onChange={(value: string) => {
            setFieldValue("driverId", value, true);
            setFieldTouched("driverId", true, false);
          }}
          error={errors.driverId && touched.driverId ? fieldError(errors, "driverId") : ""}
        />
      )}

      {driverMode === "new" && (
        <div className="space-y-5">
          <div className="flex flex-col gap-5 sm:flex-row">
            <InputField
              name="newDriverFirstName"
              id="newDriverFirstName"
              type="text"
              label="First name"
              placeholder="Enter first name"
              value={newDriverFirstName}
              onChange={handleChange}
              onBlur={handleBlur}
              error={
                errors.newDriverFirstName && touched.newDriverFirstName
                  ? fieldError(errors, "newDriverFirstName")
                  : ""
              }
            />
            <InputField
              name="newDriverLastName"
              id="newDriverLastName"
              type="text"
              label="Last name"
              placeholder="Enter last name"
              value={newDriverLastName}
              onChange={handleChange}
              onBlur={handleBlur}
              error={
                errors.newDriverLastName && touched.newDriverLastName
                  ? fieldError(errors, "newDriverLastName")
                  : ""
              }
            />
          </div>

          <PhoneNumberAndCountryField
            inputName="newDriverPhoneNumber"
            selectName="country"
            inputId="newDriverPhoneNumber"
            selectId="country"
            label="Phone Number"
            inputPlaceholder="Enter phone number"
            selectPlaceholder="+234"
            inputValue={newDriverPhoneNumber}
            selectValue="NG"
            inputOnChange={(event) => {
              const number = replaceCharactersWithString(event.target.value);
              setFieldTouched("newDriverPhoneNumber", true);
              setFieldValue("newDriverPhoneNumber", number, true);
            }}
            selectOnChange={(value: string) => {
              const countryCode = `+${getCountryCallingCode(value as any)}`;
              setFieldValue("country", value);
              setFieldValue("countryCode", countryCode);
            }}
            inputOnBlur={handleBlur}
            selectOnBlur={handleBlur}
            selectClassname="!w-[170px]"
            inputError={
              errors.newDriverPhoneNumber && touched.newDriverPhoneNumber
                ? fieldError(errors, "newDriverPhoneNumber")
                : ""
            }
          />

          <div className="flex flex-col gap-5 sm:flex-row">
            <InputField
              name="newDriverLicenseNumber"
              id="newDriverLicenseNumber"
              type="text"
              label="License Number"
              placeholder="Enter license number"
              value={newDriverLicenseNumber}
              onChange={handleChange}
              onBlur={handleBlur}
              error={
                errors.newDriverLicenseNumber && touched.newDriverLicenseNumber
                  ? fieldError(errors, "newDriverLicenseNumber")
                  : ""
              }
            />
            <InputField
              name="newDriverLicenseExpiryDate"
              id="newDriverLicenseExpiryDate"
              type="date"
              label="License Expiry Date"
              placeholder="Select expiry date"
              value={newDriverLicenseExpiryDate}
              onChange={handleChange}
              onBlur={handleBlur}
              error={
                errors.newDriverLicenseExpiryDate && touched.newDriverLicenseExpiryDate
                  ? fieldError(errors, "newDriverLicenseExpiryDate")
                  : ""
              }
            />
          </div>
        </div>
      )}
    </div>
  );
}
