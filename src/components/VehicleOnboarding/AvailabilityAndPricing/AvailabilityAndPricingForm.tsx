import { useEffect, useState } from "react";

import { Formik, Form } from "formik";
import { StepperNavigation, GroupCheckBox, SelectInput, AppSwitch, Icons, Tooltip, InputField } from "@/ui";

import FormRow from "@/components/VehicleOnboarding/AvailabilityAndPricing/FormRow";
import useAvailabilityAndPricingForm from "@/hooks/vehicle/useAvailabilityAndPricingForm";
import {
    outskirtsLocationOptions,
    vehicleAvailabilityOptions,
} from "@/utils/data";
import { availabilityAndPricingSchema } from "@/utils/validationSchema";
import { useHttp } from "@/hooks/useHttp";
import { GeoFenceAreaResponse, BookingTypeResponse } from "@/types";

interface AvailabilityAndPricingFormProps {
    steps: string[];
    currentStep: number;
    setCurrentStep: (step: number) => void;
};

const AvailabilityAndPricingForm = ({
    steps,
    setCurrentStep,
    currentStep,
}: AvailabilityAndPricingFormProps) => {
    const {
        submitStep4,
        saveStep4,
        mapValuesToApiPayload,
        initialValues,
        showOuskirts,
        setShowOuskirts,
    } = useAvailabilityAndPricingForm({ currentStep, setCurrentStep });

    const http = useHttp();
    const [bookingTypes, setBookingTypes] = useState<{ option: string, value: string }[]>([])
    const [geoFenceAreas, setGeoFencedAreas] = useState<{ option: string, value: string }[]>()

    const fetchAvailabilityAndPricingInfo = async () => {

        const [bookingTypesRes, geoFenceAreasRes] = await Promise.all([
            http.get<BookingTypeResponse>("/v1/booking-types"),
            http.get<GeoFenceAreaResponse>("/v1/geofence-areas")
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
    return (
        <Formik
            initialValues={initialValues}
            validationSchema={availabilityAndPricingSchema}
            onSubmit={(values, { setSubmitting }) => {
                console.log("Form values:", values);
                const payload = mapValuesToApiPayload(values);

                submitStep4.mutate(payload);
                setSubmitting(false);
            }}
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
                                    setFieldValue("advanceNoticeValue", value);
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
                                    options={[{ value: "1 day", option: "1 day" }]}
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
                                        setFieldValue("maxTripDurationValue", value);
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
                                    placeholder=""
                                    variant="outlined"
                                    options={[
                                        { value: "yes", option: "Yes" },
                                        { value: "no", option: "No" },
                                    ]}
                                    value={`${values.willProvideDriver}`}
                                    onChange={(value: string) => {
                                        setFieldTouched("willProvideDriver", true);
                                        setFieldValue("willProvideDriver", value);
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
                                    placeholder=""
                                    variant="outlined"
                                    options={[
                                        { value: "yes", option: "Yes" },
                                        { value: "no", option: "No" },
                                    ]}
                                    value={values.willProvideFuel}
                                    onChange={(value: string) => {
                                        setFieldTouched("willProvideFuel", true);
                                        setFieldValue("willProvideFuel", value);
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
                            </div>
                        </FormRow>

                    </div>



                    <div>
                        <div className="flex justify-between gap-3">
                            <p className="text-h6 3xl:text-h5 font-medium text-black flex justify-between items-center gap-1">
                                Do You Charge Extra For Outskirt & Extreme Locations?
                                <Tooltip
                                    title="Do you charge extra for outskirt locations?"
                                    description={`Do you charge extra for Outskirt & Extreme locations? Outskirts & Extreme locations
                include but not limited to ${geoFenceAreas?.map(o => o.option).join(", ")}`}
                                />
                            </p>
                            <AppSwitch
                                id="outskirtLocations"
                                name="outskirtLocations"
                                value={showOuskirts}
                                onChange={(checked) => {
                                    setShowOuskirts(checked);
                                    if (!checked) {
                                        setFieldValue("outskirtsPrice", "");
                                        setFieldValue("outskirtsLocation", []);
                                    }
                                }}
                            />
                        </div>
                        {showOuskirts && (
                            <div className="space-y-8">

                                <FormRow title="">

                                    <div className="max-w-[770px] flex flex-col sm:flex-row gap-5">


                                        <InputField
                                            name="outskirtFee"
                                            id="outskirtFee"
                                            type="text"
                                            label="Outskirt Fee Charge"
                                            placeholder="+NGN0"
                                            value={values.outskirtFee}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={
                                                errors.outskirtFee && touched.outskirtFee
                                                    ? errors.outskirtFee
                                                    : ""
                                            }
                                            className="sm:w-[150px] md:w-[180px]"
                                        />

                                        <InputField
                                            name="extremeFee"
                                            id="extremeFee"
                                            type="text"
                                            label="Extreme Fee Charge"
                                            placeholder="+NGN0"
                                            value={values.extremeFee}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={
                                                errors.extremeFee && touched.extremeFee
                                                    ? errors.extremeFee
                                                    : ""
                                            }
                                            className="sm:w-[150px] md:w-[180px]"
                                        />

                                    </div>
                                </FormRow>

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
                        steps={steps}
                        currentStep={currentStep}
                        setCurrentStep={setCurrentStep}
                        handleSaveDraft={() => {
                            // const payload = mapValuesToApiPayload(values);
                            // saveStep4.mutate(payload);
                        }}
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
    );
};

export default AvailabilityAndPricingForm;
