import { ChangeEvent } from "react";
import { Formik, Form } from "formik";
import { toast } from "react-toastify";
import { FullPageSpinner, StepperNavigation, InputField, SelectInput } from "@/ui";
import FormRow from "@/components/VehicleOnboarding/FormRow";
import useBasicInformationForm from "@/hooks/vehicle/useBasicInformationForm";
import { basicVehicleInformationSchema } from "@/utils/validationSchema";
import { VehicleOnboardingStepsHookProps } from "@/types";
import {
    citiesOptions,
    yesOrNoOptions,
} from "@/utils/data";
import {
    VEHICLE_MAKE_PLACEHOLDER,
    VEHICLE_SELECT_PLACEHOLDER,
} from "@/utils/constants";
import { isValidVehicleCoordinates } from "@/utils/functions";

type GooglePlaceLocation = {
    latitude?: number;
    longitude?: number;
    latLng?: { latitude?: number; longitude?: number };
};

function getPlaceCoordinates(
    location?: GooglePlaceLocation
): { latitude: number; longitude: number } | null {
    if (!location) return null;
    const latitude = location.latitude ?? location.latLng?.latitude;
    const longitude = location.longitude ?? location.latLng?.longitude;
    if (!isValidVehicleCoordinates(latitude, longitude)) return null;
    return { latitude: latitude!, longitude: longitude! };
}

const yesNoSelectOptions = [
    { option: "Select an option", value: VEHICLE_SELECT_PLACEHOLDER },
    ...yesOrNoOptions,
];

function toSelectDisplayValue(
    value: string,
    placeholder: string
): string | undefined {
    return value && value !== placeholder ? value : undefined;
}

const currentYear = new Date().getFullYear();
const upgradeYearOptions = Array.from(
    { length: currentYear - 2013 + 1 },
    (_, i) => ({ value: String(2013 + i), option: String(2013 + i) })
);

const yearOfReleaseOptions = Array.from(
    { length: currentYear - 2013 + 1 },
    (_, i) => ({ value: String(2013 + i), option: String(2013 + i) })
);

const BasicVehicleInformationForm = ({
    steps,
    currentStep,
    setCurrentStep,
}: VehicleOnboardingStepsHookProps) => {
    const {
        submitStep1,
        saveStep1,
        initialValues,
        routeVehicleId,
        isFormReady,
        googlePlaces,
        searchAddressError,
        searchAddressLoading,
        setSearchAddressQuery,
        setShowAddressList,
        showAddressList,
        vehicleOptions
    } = useBasicInformationForm({ currentStep, setCurrentStep });

    if (!isFormReady) {
        return <FullPageSpinner className="!min-h-[320px]" />;
    }

    const formKey = [
        routeVehicleId ?? "new",
        initialValues.vehicleTypeId,
        initialValues.vehicleMakeId,
        initialValues.vehicleModelId,
    ].join("-");

    return (
        <Formik
            key={formKey}
            initialValues={initialValues}
            validationSchema={basicVehicleInformationSchema}
            onSubmit={(values, { setSubmitting }) => {
                submitStep1.mutate(values);
                setSubmitting(false);
            }}
            enableReinitialize={true}
            validateOnChange={true}
            validateOnBlur={true}
        >
            {({
                values,
                touched,
                errors,
                isValid,
                dirty,
                handleBlur,
                handleChange,
                setFieldTouched,
                setFieldValue,
                isSubmitting,
            }) => (
                <Form className="max-w-[800px] w-full space-y-8">
                    <FormRow>
                        <InputField
                            name="name"
                            id="name"
                            type="text"
                            label="Vehicle Listing Name"
                            placeholder="E.g. Black Lux Tesla"
                            value={values.name}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={
                                errors.name && touched.name
                                    ? errors.name
                                    : ""
                            }
                            info
                            tooltipTitle="Vehicle listing name:"
                            tooltipDescription="Give your vehicle a name that will help potential renters easily recognize it. For example, you could use something like ‘Blue Toyota Camry 2018.’"
                        />

                        <SelectInput
                            id="city"
                            label="What city is your vehicle located?"
                            placeholder="Select location"
                            variant="outlined"
                            options={citiesOptions}
                            value={values.city}
                            onChange={(value: string) => {
                                setFieldTouched("city", true);
                                setFieldValue("city", value);
                            }}
                            error={errors.city && touched.city ? errors.city : ""}
                            info
                            tooltipTitle="What city is your vehicle located?"
                            tooltipDescription="Select the city where the vehicle is primarily available for bookings. This ensures your vehicle is shown to users searching for vehicles in that specific city."
                        />
                    </FormRow>

                    <div className="space-y-2">
                        <InputField
                            name="address"
                            id="address"
                            type="text"
                            label="Address"
                            placeholder="Search and select an address"
                            value={values.address}
                            onChange={(event: ChangeEvent<HTMLInputElement>) => {
                                const value = event.target.value;
                                setSearchAddressQuery(value);
                                setFieldValue("address", value, false);
                                setFieldValue("latitude", 0, false);
                                setFieldValue("longitude", 0, false);
                                setFieldTouched("address", true, false);
                                setShowAddressList(true);
                            }}
                            onBlur={handleBlur}
                            error={errors.address && touched.address ? errors.address : ""}
                            info
                            tooltipTitle="Address:"
                            tooltipDescription="Search for your address and pick a result from the list so we can save the correct map location."
                        />
                        {values.address.trim() &&
                            !isValidVehicleCoordinates(
                                values.latitude,
                                values.longitude
                            ) && (
                                <p className="text-sm text-amber-700">
                                    Select an address from the suggestions to confirm latitude
                                    and longitude.
                                </p>
                            )}
                        {(searchAddressLoading ||
                            (googlePlaces.length > 0 && showAddressList)) && (
                                <ul className="list-none rounded-xl py-4 px-2 w-full bg-white border border-grey-200 max-h-[200px] overflow-auto shadow-[-2px_4px_6px_-2px_#10192808,12px_16px_37.4px_-4px_#10192814]">
                                    {searchAddressError ? (
                                        <p>{searchAddressError}</p>
                                    ) : searchAddressLoading ? (
                                        <FullPageSpinner className="!min-h-[100px]" />
                                    ) : (
                                        googlePlaces.map((address, index) => (
                                            <li
                                                key={`address-${index}`}
                                                onClick={() => {
                                                    const formatted =
                                                        address?.formattedAddress || "";
                                                    const coords = getPlaceCoordinates(
                                                        address.location
                                                    );
                                                    if (!coords) return;

                                                    setShowAddressList(false);
                                                    setSearchAddressQuery(formatted);
                                                    setFieldValue("address", formatted, false);
                                                    setFieldValue(
                                                        "latitude",
                                                        coords.latitude,
                                                        false
                                                    );
                                                    setFieldValue(
                                                        "longitude",
                                                        coords.longitude,
                                                        false
                                                    );
                                                    setFieldTouched("address", true, false);
                                                }}
                                                className="cursor-pointer hover:bg-primary-75 py-2 px-4 text-sm text-grey-900 rounded-xl"
                                            >
                                                {address?.formattedAddress || ""}
                                            </li>
                                        ))
                                    )}
                                </ul>
                            )}
                    </div>

                    <FormRow>
                        <SelectInput
                            id="vehicleTypeId"
                            label="Vehicle Type"
                            placeholder="Select vehicle type"
                            variant="outlined"
                            options={vehicleOptions.vehicleTypes}
                            value={toSelectDisplayValue(
                                values.vehicleTypeId,
                                VEHICLE_SELECT_PLACEHOLDER
                            )}
                            onChange={(value: string) => {
                                setFieldValue("vehicleTypeId", value, true);
                                setFieldTouched("vehicleTypeId", true, false);
                            }}
                            error={
                                errors.vehicleTypeId && touched.vehicleTypeId
                                    ? errors.vehicleTypeId
                                    : ""
                            }
                            info
                            tooltipTitle="Vehicle type:"
                            tooltipDescription="Select the category that best describes your vehicle. This helps customers filter vehicles based on their needs and preferences."
                        />

                        <SelectInput
                            id="make"
                            label="Vehicle Make"
                            placeholder="Select vehicle make"
                            variant="outlined"
                            options={vehicleOptions.vehicleMakes}
                            value={toSelectDisplayValue(
                                values.vehicleMakeId,
                                VEHICLE_MAKE_PLACEHOLDER
                            )}
                            onChange={(value: string) => {
                                setFieldValue("vehicleMakeId", value, true);
                                setFieldTouched("vehicleMakeId", true, false);
                                setFieldValue(
                                    "vehicleModelId",
                                    VEHICLE_SELECT_PLACEHOLDER,
                                    false
                                );
                            }}
                            error={errors.vehicleMakeId && touched.vehicleMakeId ? errors.vehicleMakeId : ""}
                            info
                            tooltipTitle="Vehicle make:"
                            tooltipDescription="Specify the brand of the vehicle, such as Toyota, Ford, Honda, etc. This helps users identify the manufacturer of your vehicle"
                        />
                    </FormRow>

                    <FormRow>
                        <SelectInput
                            id="model"
                            label="Vehicle Model"
                            placeholder={
                                values.vehicleMakeId &&
                                values.vehicleMakeId !== VEHICLE_MAKE_PLACEHOLDER
                                    ? "Select vehicle model"
                                    : "Select a make first"
                            }
                            variant="outlined"
                            options={
                                values.vehicleMakeId &&
                                values.vehicleMakeId !== VEHICLE_MAKE_PLACEHOLDER
                                    ? vehicleOptions.vehicleModels.filter(
                                          (m) => m.makeId === values.vehicleMakeId
                                      )
                                    : []
                            }
                            value={toSelectDisplayValue(
                                values.vehicleModelId,
                                VEHICLE_SELECT_PLACEHOLDER
                            )}
                            onChange={(value: string) => {
                                setFieldValue("vehicleModelId", value, true);
                                setFieldTouched("vehicleModelId", true, false);
                            }}
                            error={errors.vehicleModelId && touched.vehicleModelId ? errors.vehicleModelId : ""}
                            info
                            tooltipTitle="Vehicle model: "
                            tooltipDescription="Select the specific model of your vehicle, such as ‘Civic,’ ‘Camry,’ or ‘Ranger.’ This, combined with the make and year, provides precise details about your vehicle."
                        />

                        <SelectInput
                            id="yearOfRelease"
                            label="Year of Release"
                            placeholder="Select year of release"
                            variant="outlined"
                            options={yearOfReleaseOptions}
                            value={values.yearOfRelease ? String(values.yearOfRelease) : ""}
                            onChange={(value: string) => {
                                setFieldValue("yearOfRelease", Number(value), true);
                                setFieldTouched("yearOfRelease", true, false);
                            }}
                            error={
                                errors.yearOfRelease && touched.yearOfRelease
                                    ? errors.yearOfRelease
                                    : ""
                            }
                            info
                            tooltipTitle="Year of release:"
                            tooltipDescription="Indicate the year your vehicle was manufactured. This helps customers assess the vehicle’s age and can influence their booking decision."
                        />
                    </FormRow>



                    <FormRow>
                        <SelectInput
                            id="hasInsurance"
                            label="Does your vehicle have insurance?"
                            placeholder="Select an option"
                            variant="outlined"
                            options={yesNoSelectOptions}
                            value={values.hasInsurance}
                            onChange={(value: string) => {
                                setFieldValue("hasInsurance", value, true);
                                setFieldTouched("hasInsurance", true, false);
                            }}
                            error={
                                errors.hasInsurance && touched.hasInsurance
                                    ? errors.hasInsurance
                                    : ""
                            }
                            info
                            tooltipTitle="Does your vehicle have insurance?"
                            tooltipDescription="Let us know if your vehicle is currently insured. Providing insurance information increases the trust and security of potential bookings"
                        />

                        <SelectInput
                            id="hasTracker"
                            label="Does your vehicle have a tracker?"
                            placeholder="Select an option"
                            variant="outlined"
                            options={yesNoSelectOptions}
                            value={values.hasTracker}
                            onChange={(value: string) => {
                                setFieldValue("hasTracker", value, true);
                                setFieldTouched("hasTracker", true, false);
                            }}
                            error={
                                errors.hasTracker && touched.hasTracker ? errors.hasTracker : ""
                            }
                            info
                            tooltipTitle="Does your vehicle have a tracker?"
                            tooltipDescription="Specify whether your vehicle is equipped with a GPS tracker. This feature is useful for safety, to track the vehicle's location when rented."
                        />

                    </FormRow>
                    <FormRow>

                        <SelectInput
                            id="isVehicleUpgraded"
                            label="Is your vehicle upgraded?"
                            placeholder="Select an option"
                            variant="outlined"
                            options={yesNoSelectOptions}
                            value={values.isVehicleUpgraded}
                            onChange={(value: string) => {
                                setFieldValue("isVehicleUpgraded", value, true);
                                setFieldTouched("isVehicleUpgraded", true, false);
                                if (value === "no") {
                                    setFieldValue("yearOfUpgrade", undefined, false);
                                }
                            }}
                            error={
                                errors.isVehicleUpgraded && touched.isVehicleUpgraded ? errors.isVehicleUpgraded : ""
                            }
                            info
                            tooltipTitle="Is your vehicle upgraded"
                            tooltipDescription="Specify whether your vehicle is upgraded from a different model or year."
                        />

                        {values.isVehicleUpgraded === "yes" && (
                            <SelectInput
                                id="yearOfUpgrade"
                                label="Year upgraded to"
                                placeholder="Select upgrade year"
                                variant="outlined"
                                options={upgradeYearOptions}
                                value={values.yearOfUpgrade ? String(values.yearOfUpgrade) : ""}
                                onChange={(value: string) => {
                                    setFieldTouched("yearOfUpgrade", true);
                                    setFieldValue("yearOfUpgrade", Number(value));
                                }}
                                error={
                                    errors.yearOfUpgrade && touched.yearOfUpgrade
                                        ? errors.yearOfUpgrade
                                        : ""
                                }
                                info
                                tooltipTitle="Year of upgrade"
                                tooltipDescription="Select the year your vehicle was upgraded to."
                            />
                        )}
                    </FormRow>
                    <StepperNavigation
                        steps={steps ?? []}
                        currentStep={currentStep}
                        setCurrentStep={setCurrentStep}
                        handleSaveDraft={() => {
                            if (values.name) {
                                saveStep1.mutate(values);
                            } else
                                toast.error(
                                    "Enter your vehicle listing name before you save to draft"
                                );
                        }}
                        isSaveDraftloading={saveStep1.isPending}
                        isNextLoading={isSubmitting || submitStep1.isPending}
                        disableNextButton={
                            !isValid || isSubmitting || submitStep1.isPending
                            // ||disableNextButton
                        }
                        showSaveDraftButton
                    />
                </Form>
            )}
        </Formik>
    );
};

export default BasicVehicleInformationForm;
