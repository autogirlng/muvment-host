import { useEffect, useState } from "react";

import { Formik, Form } from "formik";
import { StepperNavigation, GroupCheckBox, SelectInput, AppSwitch, Tooltip } from "@/ui";

import FormRow from "@/components/VehicleOnboarding/AvailabilityAndPricing/FormRow";
import useAvailabilityAndPricingForm from "@/hooks/vehicle/useAvailabilityAndPricingForm";
import {
    vehicleAvailabilityOptions,
    yesOrNoOptions,
} from "@/utils/data";
import { availabilityAndPricingSchema } from "@/utils/validationSchema";
import { VEHICLE_SELECT_PLACEHOLDER } from "@/utils/constants";
import ProvideDriverSection from "@/components/VehicleOnboarding/AvailabilityAndPricing/ProvideDriverSection";
import PricingSheetModal from "@/components/VehicleOnboarding/AvailabilityAndPricing/PricingSheetModal";
import BookingTypePricingPreview from "@/components/VehicleOnboarding/AvailabilityAndPricing/BookingTypePricingPreview";
import { useHttp } from "@/hooks/useHttp";
import {
    AvailabilityAndPricingValues,
    GeoFenceAreaResponse,
    BookingTypeResponse,
    VehicleOnboardingStepsHookProps,
} from "@/types";
import type { PricingSheetItem } from "@/hooks/pricing/usePublicPricing";
import { ApiResponse } from "@/types";
import ListingSuccessModal from "@/components/VehicleOnboarding/VehicleSummary/ListingSuccessModal";
import { isVehicleDraft } from "@/utils/vehicleOnboardingMode";



const AvailabilityAndPricingForm = ({
    steps,
    setCurrentStep,
    currentStep,
}: VehicleOnboardingStepsHookProps) => {
    const {
        submitStep4,
        saveStep4,
        mapValuesToApiPayload,
        initialValues,
        showOuskirts,
        setShowOuskirts,
        drivers,
        driversLoading,
        vehicle,
        isEditingExisting,
    } = useAvailabilityAndPricingForm({ currentStep, setCurrentStep });

    const [pricingModalOpen, setPricingModalOpen] = useState(false);
    const [showUpdateSuccessModal, setShowUpdateSuccessModal] = useState(false);
    const [pricingItems, setPricingItems] = useState<PricingSheetItem[]>([]);
    const [pricingLoading, setPricingLoading] = useState(false);
    const [pendingValues, setPendingValues] = useState<AvailabilityAndPricingValues | null>(null);

    const yesNoSelectOptions = [
        { option: "Select an option", value: VEHICLE_SELECT_PLACEHOLDER },
        ...yesOrNoOptions,
    ];

    const http = useHttp();
    const [bookingTypes, setBookingTypes] = useState<{ option: string, value: string }[]>([])
    const [geoFenceAreas, setGeoFencedAreas] = useState<{ option: string, value: string }[]>()

    const fetchAvailabilityAndPricingInfo = async () => {
        const [bookingTypesRes, geoFenceAreasRes] = await Promise.all([
            http.get<BookingTypeResponse>("/hosts/me/booking-types"),
            http.get<GeoFenceAreaResponse>("/geofence-areas"),
        ])

        const bookingTypes = bookingTypesRes?.data.map((booking) => {
            return {
                option: booking.name.toLowerCase(),
                value: booking.id
            }
        })
        const geoFenceAreas = geoFenceAreasRes?.data.map((area) => {
            return {
                option: area.name.toLowerCase(),
                value: area.id
            }
        })
        setBookingTypes(bookingTypes ?? [])

        setGeoFencedAreas(geoFenceAreas ?? [])

    }
    useEffect(() => {
        fetchAvailabilityAndPricingInfo()
    }, [])

    const shouldShowPricingSheet = isVehicleDraft(vehicle);

    const fetchPricingSheet = async () => {
        const modelId = vehicle?.vehicleModelId;
        const year = vehicle?.yearOfRelease;
        if (!modelId || !year) return [];

        const params = new URLSearchParams({
            modelId,
            year: String(year),
        });
        const result = await http.get<ApiResponse<PricingSheetItem[]>>(
            `/public/pricing?${params.toString()}`
        );
        return result?.data ?? [];
    };

    const proceedToSummary = (values: AvailabilityAndPricingValues) => {
        submitStep4.mutate(values, {
            onSuccess: () => {
                if (isEditingExisting) {
                    setShowUpdateSuccessModal(true);
                }
            },
            onSettled: () => {
                setPricingModalOpen(false);
                setPendingValues(null);
            },
        });
    };

    const handleSaveDraft = (values: AvailabilityAndPricingValues) => {
        saveStep4.mutate(values, {
            onSuccess: () => {
                if (isEditingExisting) {
                    setShowUpdateSuccessModal(true);
                }
            },
        });
    };

    const handleStepSubmit = async (
        values: AvailabilityAndPricingValues,
        setSubmitting: (isSubmitting: boolean) => void
    ) => {
        if (shouldShowPricingSheet && vehicle?.vehicleModelId && vehicle?.yearOfRelease) {
            setPendingValues(values);
            setPricingLoading(true);
            setPricingModalOpen(true);
            try {
                const items = await fetchPricingSheet();
                setPricingItems(items);
            } catch {
                setPricingItems([]);
            } finally {
                setPricingLoading(false);
                setSubmitting(false);
            }
            return;
        }

        proceedToSummary(values);
        setSubmitting(false);
    };

    return (
        <>
        <Formik
            initialValues={initialValues}
            validationSchema={availabilityAndPricingSchema}
            onSubmit={(values, { setSubmitting }) => {
                handleStepSubmit(values, setSubmitting);
            }}
            enableReinitialize
            validateOnChange
            validateOnBlur
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
                <Form className="w-full md:w-[calc(100%-250px)] space-y-[72px]">
                    <div className="max-w-[800px] w-full space-y-[72px]">
                        <FormRow
                            title="Advance notice"
                            description="How much advance notice do you need before the trip starts?">
                            <SelectInput
                                id="advanceNoticeValue"
                                label="Advance notice"
                                placeholder="1 day"
                                variant="outlined"
                                className="max-w-[375px]"
                                options={vehicleAvailabilityOptions}
                                value={`${values.advanceNoticeValue}`}
                                onChange={(value: string) => {
                                    setFieldTouched("advanceNoticeValue", true);
                                    setFieldValue("advanceNoticeValue", Number(value));
                                }}
                                error={
                                    errors.advanceNoticeValue && touched.advanceNoticeValue
                                        ? errors.advanceNoticeValue
                                        : ""
                                }
                                info
                                tooltipTitle="Advance notice:"
                                tooltipDescription="Set the amount of time in advance that rental requests should be made to ensure availability."
                            />
                        </FormRow>
                        <FormRow
                            title="Trip duration"
                            description="What’s the shortest and longest trip you’ll accept?"
                        >
                            <div className="max-w-[770px] flex flex-col sm:flex-row gap-5">
                                <SelectInput
                                    id="minTripDurationInDays"
                                    label="Minimum trip duration"
                                    placeholder="1 day"
                                    variant="outlined"
                                    options={[{ value: "1", option: "1 day" }]}
                                    value={"1"}
                                    disabled
                                    info
                                    tooltipTitle="Minimum trip duration:"
                                    tooltipDescription="This is the shortest distance you can provide for this vehicle and the standard is 1 day, which equals 12 hours - non-editable."
                                />
                                <SelectInput
                                    id="maxTripDurationValue"
                                    label="Maximum trip duration"
                                    placeholder="1 day"
                                    variant="outlined"
                                    options={[
                                        { value: "1", option: "1 day" },
                                        { value: "2", option: "2 days" },
                                        { value: "3", option: "3 days" },
                                        { value: "7", option: "1 week" },
                                    ]}
                                    value={`${values.maxTripDurationValue}`}
                                    onChange={(value: string) => {
                                        setFieldTouched("maxTripDurationValue", true);
                                        setFieldValue("maxTripDurationValue", Number(value));
                                    }}
                                    error={
                                        errors.maxTripDurationValue &&
                                            touched.maxTripDurationValue
                                            ? errors.maxTripDurationValue
                                            : ""
                                    }
                                    info
                                    tooltipTitle="Maximum trip duration:"
                                    tooltipDescription="Define the longest duration you are comfortable providing rental services."
                                />
                            </div>
                        </FormRow>

                        <FormRow title="Additional Services">
                            <div className="max-w-[770px] flex flex-col sm:flex-row gap-5">
                                <SelectInput
                                    id="willProvideDriver"
                                    label="Will you provide a driver?"
                                    placeholder="Select an option"
                                    variant="outlined"
                                    options={yesNoSelectOptions}
                                    value={values.willProvideDriver}
                                    onChange={(value: string) => {
                                        setFieldValue("willProvideDriver", value, true);
                                        setFieldTouched("willProvideDriver", true, false);
                                        if (value !== "yes") {
                                            setFieldValue("driverMode", "", false);
                                            setFieldValue("driverId", VEHICLE_SELECT_PLACEHOLDER, false);
                                            setFieldValue("newDriverFirstName", "", false);
                                            setFieldValue("newDriverLastName", "", false);
                                            setFieldValue("newDriverPhoneNumber", "", false);
                                            setFieldValue("newDriverLicenseNumber", "", false);
                                            setFieldValue("newDriverLicenseExpiryDate", "", false);
                                        }
                                    }}
                                    error={
                                        errors.willProvideDriver && touched.willProvideDriver
                                            ? errors.willProvideDriver
                                            : ""
                                    }
                                    info
                                    tooltipTitle="Will you provide a driver?:"
                                    tooltipDescription="Indicate if you are offering a driver along with your rental services for a complete experience. Accommodation should be provided for drivers for journey or 24 hours bookings."
                                />
                                <SelectInput
                                    id="willProvideFuel"
                                    label="Will you provide at least 20 liters of fuel?"
                                    placeholder="Select an option"
                                    variant="outlined"
                                    options={yesNoSelectOptions}
                                    value={values.willProvideFuel}
                                    onChange={(value: string) => {
                                        setFieldValue("willProvideFuel", value, true);
                                        setFieldTouched("willProvideFuel", true, false);
                                    }}
                                    error={
                                        errors.willProvideFuel && touched.willProvideFuel
                                            ? errors.willProvideFuel
                                            : ""
                                    }
                                    info
                                    tooltipTitle="Will you provide at least 20 litres of fuel?:"
                                    tooltipDescription="We will provide 15 litres of fuel for your ride, in the event the fuel finishes during trips, you will be responsible for fueling an amount that can complete your ride."
                                />
                            </div>
                        </FormRow>

                        {values.willProvideDriver === "yes" && (
                            <ProvideDriverSection
                                driverMode={values.driverMode}
                                driverId={values.driverId}
                                newDriverFirstName={values.newDriverFirstName}
                                newDriverLastName={values.newDriverLastName}
                                newDriverPhoneNumber={values.newDriverPhoneNumber}
                                newDriverLicenseNumber={values.newDriverLicenseNumber}
                                newDriverLicenseExpiryDate={values.newDriverLicenseExpiryDate}
                                drivers={drivers}
                                assignedDriver={vehicle?.assignedDriver}
                                driversLoading={driversLoading}
                                errors={errors}
                                touched={touched}
                                setFieldValue={setFieldValue}
                                setFieldTouched={setFieldTouched}
                                handleBlur={handleBlur}
                                handleChange={handleChange}
                            />
                        )}

                        <FormRow title="Booking Types">

                            <div className="space-y-3">

                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-[50px] gap-y-3 max-w-[686px]">
                                    {
                                        bookingTypes.map((type) => (
                                            <GroupCheckBox
                                                key={type.value}
                                                feature={type.value}
                                                checkedValues={values.supportedBookingTypeIds}
                                                name={type.option}
                                                onChange={(bookingId: string, isChecked: boolean) => {
                                                    if (isChecked) {
                                                        const newValues = [...values.supportedBookingTypeIds, bookingId];
                                                        setFieldValue("supportedBookingTypeIds", newValues);
                                                    } else {
                                                        const newValues = values.supportedBookingTypeIds.filter(
                                                            (value) => value !== bookingId
                                                        );
                                                        setFieldValue("supportedBookingTypeIds", newValues);
                                                    }
                                                }}
                                            />
                                        ))
                                    }
                                </div>
                                {errors.supportedBookingTypeIds && touched.supportedBookingTypeIds ? (
                                    <p className="text-error-500 text-sm mt-2 text-nowrap">
                                        {errors.supportedBookingTypeIds}
                                    </p>
                                ) : (
                                    ""
                                )}
                                <BookingTypePricingPreview
                                    modelId={vehicle?.vehicleModelId}
                                    year={vehicle?.yearOfRelease}
                                    selectedBookingTypeIds={values.supportedBookingTypeIds}
                                    bookingTypes={bookingTypes}
                                />
                            </div>
                        </FormRow>

                    </div>



                    <div>
                        <div className="flex justify-between gap-3">
                            <p className="text-h6 3xl:text-h5 font-medium text-black flex justify-between items-center gap-1">
                                Restricted Area aka No Go Area.
                                <Tooltip
                                    title="Restricted Area aka No Go Area"
                                    description={`Select areas where you charge an additional fee for restricted or no-go locations, including but not limited to ${geoFenceAreas?.map(o => o.option).join(", ")}`}
                                />
                            </p>
                            <AppSwitch
                                id="outskirtLocations"
                                name="outskirtLocations"
                                value={showOuskirts}
                                onChange={(checked) => {
                                    setShowOuskirts(checked);
                                    if (!checked) {
                                        setFieldValue("outOfBoundsAreaIds", []);
                                    }
                                }}
                            />
                        </div>
                        {showOuskirts && (
                            <div className="space-y-8">
                                <div className="space-y-3">
                                    <label
                                        htmlFor="features"
                                        className="text-sm block font-medium text-black"
                                    >
                                        Outskirt Locations
                                    </label>
                                    <p className="text-sm text-grey-600">
                                        Select the locations where you would like to apply an
                                        additional charge
                                    </p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-[50px] gap-y-3 max-w-[686px]">
                                        {
                                            geoFenceAreas?.map((area) => (
                                                <GroupCheckBox
                                                    key={area.value}
                                                    feature={area.value}
                                                    checkedValues={values.outOfBoundsAreaIds}
                                                    name={area.option}
                                                    onChange={(areaId: string, isChecked: boolean) => {
                                                        if (isChecked) {
                                                            const newValues = [...values.outOfBoundsAreaIds, areaId];
                                                            setFieldValue("outOfBoundsAreaIds", newValues);
                                                        } else {
                                                            const newValues = values.outOfBoundsAreaIds.filter(
                                                                (value) => value !== areaId
                                                            );
                                                            setFieldValue("outOfBoundsAreaIds", newValues);
                                                        }
                                                    }}
                                                />
                                            ))
                                        }
                                    </div>
                                    {errors.outOfBoundsAreaIds && touched.outOfBoundsAreaIds ? (
                                        <p className="text-error-500 text-sm mt-2 text-nowrap">
                                            {errors.outOfBoundsAreaIds}
                                        </p>
                                    ) : (
                                        ""
                                    )}
                                </div>

                            </div>
                        )}
                    </div>

                    <StepperNavigation
                        steps={steps ?? []}
                        currentStep={currentStep}
                        setCurrentStep={setCurrentStep}
                        handleSaveDraft={() => handleSaveDraft(values)}
                        isSaveDraftloading={saveStep4.isPending}
                        isNextLoading={isSubmitting || submitStep4.isPending}
                        disableNextButton={
                            !isValid || isSubmitting || submitStep4.isPending
                            // ||disableNextButton
                        }
                        showSaveDraftButton
                    />
                </Form>
            )}
        </Formik>
        <PricingSheetModal
            open={pricingModalOpen}
            onOpenChange={(open) => {
                setPricingModalOpen(open);
                if (!open) setPendingValues(null);
            }}
            items={pricingItems}
            isLoading={pricingLoading}
            isContinuing={submitStep4.isPending}
            onContinue={() => {
                if (pendingValues) proceedToSummary(pendingValues);
            }}
        />
        <ListingSuccessModal
            open={showUpdateSuccessModal}
            onOpenChange={setShowUpdateSuccessModal}
            vehicleName={vehicle?.name || "vehicle"}
            mode="updated"
        />
        </>
    );
};

export default AvailabilityAndPricingForm;
