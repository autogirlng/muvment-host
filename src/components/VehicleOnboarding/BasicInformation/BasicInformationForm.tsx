import { ChangeEvent, useEffect, useState } from "react";
import { Formik, Form } from "formik";
import { toast } from "react-toastify";
import { FullPageSpinner, StepperNavigation, InputField, SelectInput } from "@/ui";
import FormRow from "@/components/VehicleOnboarding/FormRow";
import useBasicInformationForm from "@/hooks/vehicle/useBasicInformationForm";
import { basicVehicleInformationSchema } from "@/utils/validationSchema";
import { VehicleOnboardingStepsHookProps } from "@/types";
import {
    citiesOptions,
    yearOfReleaseOptions,
    yesOrNoOptions,
} from "@/utils/data";

const BasicVehicleInformationForm = ({
    steps,
    currentStep,
    setCurrentStep,
}: VehicleOnboardingStepsHookProps) => {
    const {
        submitStep1,
        saveStep1,
        initialValues,
        googlePlaces,
        searchAddressError,
        searchAddressLoading,
        setSearchAddressQuery,
        setShowAddressList,
        showAddressList,
        vehicleOptions
    } = useBasicInformationForm({ currentStep, setCurrentStep });

    const [coordinates, setCoordinates] = useState<{ latitude: number, longitude: number }>()

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={basicVehicleInformationSchema}
            onSubmit={(values, { setSubmitting }) => {
                console.log("Form values:", values);

                const vehicleInitialDraftValues = {
                    ...values,
                    latitude: coordinates?.latitude || 0,
                    longitude: coordinates?.longitude || 0,
                }

                submitStep1.mutate(vehicleInitialDraftValues);
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
                            placeholder="Enter address"
                            value={values.address}
                            onChange={(event: ChangeEvent<HTMLInputElement>) => {
                                const value = event.target.value;
                                setSearchAddressQuery(value);
                                setFieldValue("address", value);
                            }}
                            onBlur={handleBlur}
                            error={errors.address && touched.address ? errors.address : ""}
                            info
                            tooltipTitle="Address:"
                            tooltipDescription="Provide the exact address where the vehicle is located when it’s not in use."
                        />
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
                                                    setShowAddressList(false);
                                                    setFieldValue(
                                                        "address",
                                                        address?.formattedAddress || ""
                                                    );
                                                    setCoordinates({
                                                        latitude: address.location.latitude,
                                                        longitude: address.location.longitude
                                                    })
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
                            value={values.vehicleTypeId}
                            onChange={(value: string) => {
                                setFieldTouched("vehicleTypeId", true);
                                setFieldValue("vehicleTypeId", value);
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
                            value={values.vehicleMakeId}
                            onChange={(value: string) => {
                                setFieldTouched("vehicleMakeId", true);
                                setFieldValue("vehicleMakeId", value);
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
                            placeholder="Select vehicle model"
                            variant="outlined"
                            options={vehicleOptions.vehicleModels}
                            value={values.vehicleModelId}
                            onChange={(value: string) => {
                                setFieldTouched("vehicleModelId", true);
                                setFieldValue("vehicleModelId", value);
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
                            value={`${values.yearOfRelease}`}
                            onChange={(value: string) => {
                                setFieldTouched("yearOfRelease", true);
                                setFieldValue("yearOfRelease", value);
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
                            options={yesOrNoOptions}
                            value={values.hasInsurance}
                            onChange={(value: string) => {
                                setFieldTouched("hasInsurance", true);
                                setFieldValue("hasInsurance", value);
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
                            options={yesOrNoOptions}
                            value={values.hasTracker}
                            onChange={(value: string) => {
                                setFieldTouched("hasTracker", true);
                                setFieldValue("hasTracker", value);
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
                            options={yesOrNoOptions}
                            value={values.isVehicleUpgraded}
                            onChange={(value: string) => {
                                setFieldTouched("isVehicleUpgraded", true);
                                setFieldValue("isVehicleUpgraded", value);
                            }}
                            error={
                                errors.isVehicleUpgraded && touched.isVehicleUpgraded ? errors.isVehicleUpgraded : ""
                            }
                            info
                            tooltipTitle="Is your vehicle upgraded"
                            tooltipDescription="Specify whether your vehicle is upgraded from a different model or year."
                        />
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
