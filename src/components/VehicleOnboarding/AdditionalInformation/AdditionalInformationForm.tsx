import { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import { addtionalVehicleInformationSchema } from "@/utils/validationSchema";
import { useHttp } from "@/hooks/useHttp";
import { SelectInput, TextArea, InputField, StepperNavigation, GroupCheckBox } from "@/ui";
import FormRow from "../FormRow";
import useAdditionalInformationForm from "@/hooks/vehicle/useAdditionalInformationForm";
import { VehicleFeaturesResponse, VehicleColorResponse, VehicleOnboardingStepsHookProps } from "@/types";


const AdditionalInformationForm = ({
    steps, currentStep, setCurrentStep
}: VehicleOnboardingStepsHookProps) => {
    const { submitStep2, saveStep2, initialValues } = useAdditionalInformationForm({ currentStep, setCurrentStep });

    const http = useHttp();
    const [vehicleOptions, setVehicleOptions] = useState<{ vehicleColors: { option: string, value: string }[]; vehicleFeatures: { name: string, id: string }[] }>({ vehicleColors: [], vehicleFeatures: [] });


    const fetchAdditionalVehicleDetails = async () => {
        const [vehicleFeaturesRes, vehicleColorsRes] = await Promise.all([
            http.get<VehicleFeaturesResponse>("/v1/public/vehicle-features"),
            http.get<VehicleColorResponse>("/v1/public/vehicle-colors")
        ]);

        const vehicleFeatures = vehicleFeaturesRes?.data.map((feature) => {
            return {
                name: feature.name,
                id: feature.id
            }
        }) ?? []

        const vehicleColors = vehicleColorsRes?.data.map((color) => {
            return {
                option: color.name,
                value: color.id
            }
        }) ?? []

        setVehicleOptions({
            vehicleFeatures,
            vehicleColors
        })

    }

    useEffect(() => {
        fetchAdditionalVehicleDetails()
    }, [])




    return (
        <Formik
            initialValues={initialValues}
            validationSchema={addtionalVehicleInformationSchema}
            onSubmit={(values, { setSubmitting }) => {
                console.log("Form values:", values);

                submitStep2.mutate(values);
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
                <Form className="max-w-[800px] w-full space-y-8">
                    <FormRow>
                        <InputField
                            name="licensePlateNumber"
                            id="licensePlateNumber"
                            type="text"
                            label="License Plate Number"
                            placeholder="E.g AB124-CDE"
                            value={values.licensePlateNumber}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={
                                errors.licensePlateNumber && touched.licensePlateNumber
                                    ? errors.licensePlateNumber
                                    : ""
                            }
                            info
                            tooltipTitle="License plate number:"
                            tooltipDescription="Your vehicle’s license plate number is required to verify its legal registration and for identification purposes."
                        />

                        <InputField
                            name="stateOfRegistration"
                            id="stateOfRegistration"
                            type="text"
                            label="State Of Registration"
                            placeholder="Enter state of reg"
                            value={values.stateOfRegistration}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={
                                errors.stateOfRegistration && touched.stateOfRegistration
                                    ? errors.stateOfRegistration
                                    : ""
                            }
                            info
                            tooltipTitle="State of registration:"
                            tooltipDescription="Knowing the state where your vehicle is registered helps us ensure compliance with local laws and regulations."
                        />
                    </FormRow>

                    {/* text area*/}
                    <TextArea
                        name="description"
                        id="description"
                        type="text"
                        label="Vehicle Description"
                        placeholder={`E.g 2015 Toyota Camry with good fuel efficiency, spacious interior, and
advanced safety features. Perfect for city driving and long trips. Includes GPS,
Bluetooth connectivity, and a sunroof.`}
                        value={values.description}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={
                            errors.description && touched.description
                                ? errors.description
                                : ""
                        }
                        info
                        tooltipTitle="Vehicle of description:"
                        tooltipDescription="Providing a detailed description helps customers understand the unique features and specifications of your vehicle."
                    />
                    {/* vehicle features */}
                    <div className="space-y-3">
                        <label
                            htmlFor="features"
                            className="text-sm block font-medium text-nowrap text-grey-900"
                        >
                            Vehicle Features
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-[50px] gap-y-3 max-w-[686px]">
                            {
                                vehicleOptions.vehicleFeatures.map((feature) => (
                                    <GroupCheckBox
                                        key={feature.id}
                                        feature={feature.id}
                                        checkedValues={values.featureIds}
                                        name={feature.name}
                                        onChange={(featureId: string, isChecked: boolean) => {
                                            if (isChecked) {
                                                const newValues = [...values.featureIds, featureId];
                                                setFieldValue("featureIds", newValues);
                                            } else {
                                                const newValues = values.featureIds.filter(
                                                    (value) => value !== featureId
                                                );
                                                setFieldValue("featureIds", newValues);
                                            }
                                        }}
                                    />
                                ))
                            }
                        </div>
                        {errors.featureIds && touched.featureIds ? (
                            <p className="text-error-500 text-sm mt-2 text-nowrap">
                                {errors.featureIds}
                            </p>
                        ) : (
                            ""
                        )}
                    </div>

                    <FormRow>
                        <SelectInput
                            id="vehicleColor"
                            label="Vehicle Color"
                            placeholder="Select vehicle color"
                            variant="outlined"
                            options={vehicleOptions.vehicleColors}
                            value={values.vehicleColorId}
                            onChange={(value: string) => {
                                console.log(value)
                                setFieldTouched("vehicleColorId", true);
                                setFieldValue("vehicleColorId", value);
                            }}
                            error={
                                errors.vehicleColorId && touched.vehicleColorId
                                    ? errors.vehicleColorId
                                    : ""
                            }
                            info
                            tooltipTitle="Vehicle color:"
                            tooltipDescription="Indicating your vehicle’s color is important for easy identification during customer pickups and possible inspections."
                        />

                        <InputField
                            name="numberOfSeats"
                            id="numberOfSeats"
                            type="number"
                            label="Number of seats"
                            placeholder="Enter number of seats"
                            value={values.numberOfSeats}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={
                                errors.numberOfSeats && touched.numberOfSeats
                                    ? errors.numberOfSeats
                                    : ""
                            }
                            info
                            tooltipTitle="Number of seats:"
                            tooltipDescription="Knowing how many seats your vehicle has allows customers to choose the right vehicle for their needs, especially for group rides."
                        />
                    </FormRow>


                    <StepperNavigation
                        steps={steps ?? []}
                        currentStep={currentStep}
                        setCurrentStep={setCurrentStep}
                        handleSaveDraft={() => {
                            saveStep2.mutate(values);
                        }}
                        isSaveDraftloading={saveStep2.isPending}
                        isNextLoading={isSubmitting || submitStep2.isPending}
                        disableNextButton={
                            !isValid || isSubmitting || submitStep2.isPending
                        }
                        showSaveDraftButton
                    />
                </Form>
            )}
        </Formik>
    );
};

export default AdditionalInformationForm;
