import Image from "next/image";
import { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import { toast } from "react-toastify";
import { vehiclePhotosSchema } from "@/utils/validationSchema";
import { photoViewOptions } from "@/utils/data";
import { VehiclePhotos, VehicleOnboardingStepsHookProps } from "@/types";
import { PhotoUpload, StepperNavigation, Button } from "@/ui";
import useVehiclePhotosForm from "@/hooks/vehicle/useVehiclePhotosForm";
import { createPlaceholderImageFile } from "@/utils/devPrefill";

const VehiclePhotosForm = ({
    steps,
    setPhotoTipIndex,
    currentStep,
    setCurrentStep,
}: VehicleOnboardingStepsHookProps) => {
    const {
        initialValues,
        photoViews,
        setPhotoViews,
        submitStep3,
        saveStep3,
    } = useVehiclePhotosForm({ setPhotoTipIndex, currentStep, setCurrentStep });

    const [isPrefilling, setIsPrefilling] = useState(false);

    useEffect(() => {
        const filledFields = photoViewOptions.filter(
            (view) => initialValues[view.name as keyof VehiclePhotos]
        );

        if (filledFields.length > 0) {
            // @ts-ignore
            setPhotoTipIndex(filledFields.length - 1);
        } else {
            // @ts-ignore
            setPhotoTipIndex(0);
        }
    }, [initialValues, setPhotoTipIndex]);

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={vehiclePhotosSchema}
            onSubmit={(values, { setSubmitting }) => {
                submitStep3.mutate(values);
                setSubmitting(false);
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
                setFieldTouched,
                setFieldValue,
                isSubmitting,
            }) => {
                const handlePrefill = async () => {
                    try {
                        setIsPrefilling(true);
                        for (const view of photoViewOptions) {
                            const file = await createPlaceholderImageFile(view.label);
                            setFieldValue(view.name, file);
                            setFieldTouched(view.name, true);
                        }
                        setPhotoViews(
                            photoViewOptions.map((view) => ({ ...view, disabled: false }))
                        );
                        toast.success("Photos prefilled with placeholder images");
                    } catch {
                        toast.error("Could not prefill photos");
                    } finally {
                        setIsPrefilling(false);
                    }
                };

                return (
                <Form className="w-full grid grid-cols-1 sm:grid-cols-2 gap-10">
                    <div className="sm:col-span-2 flex justify-end">
                        <Button
                            type="button"
                            color="white"
                            radius="lg"
                            onClick={handlePrefill}
                            loading={isPrefilling}
                            className="!py-2.5 !px-6 !text-sm border border-primary-500"
                        >
                            Prefill with placeholder images
                        </Button>
                    </div>
                    {photoViews.map((item) => {
                        const fieldName = item.name as keyof VehiclePhotos;

                        return (
                            <PhotoUpload
                                key={item.name}
                                id={item.name}
                                name={item.name}
                                label={item.label}
                                image={
                                    <Image
                                        src={item.image}
                                        alt=""
                                        width={90}
                                        height={67}
                                        className={item.size}
                                    />
                                }
                                value={values[fieldName]}
                                onChange={(fieldName, file) => {
                                    setFieldTouched(fieldName, true);
                                    setFieldValue(fieldName, file);
                                    const currentIndex = photoViews.findIndex(
                                        (view) => view.name === fieldName
                                    );
                                    //@ts-ignore
                                    setPhotoTipIndex(currentIndex + 1);
                                    const updatedViews = photoViews.map((view, idx) => {
                                        if (idx === currentIndex + 1) {
                                            return { ...view, disabled: file === null };
                                        }
                                        return view;
                                    });
                                    setPhotoViews(updatedViews);
                                }}
                                disabled={item.disabled}
                                fieldName={item.name}
                                handlePhotoDelete={() => {
                                    setFieldValue(item.name, "");
                                }}
                            />
                        );
                    })}

                    <StepperNavigation
                        //@ts-ignore
                        steps={steps ?? []}
                        currentStep={currentStep}
                        setCurrentStep={setCurrentStep}
                        handleSaveDraft={async () => {
                            saveStep3.mutate(values);
                        }}
                        isSaveDraftloading={saveStep3.isPending}
                        isNextLoading={isSubmitting || submitStep3.isPending}
                        disableNextButton={
                            !isValid || isSubmitting || submitStep3.isPending
                        }
                    />
                </Form>
                );
            }}
        </Formik>
    );
};

export default VehiclePhotosForm;
