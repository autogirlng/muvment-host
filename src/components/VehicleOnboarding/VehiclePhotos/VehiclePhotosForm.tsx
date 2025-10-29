import Image from "next/image";
import { useEffect } from "react";
import { Formik, Form } from "formik";
import { vehiclePhotosSchema } from "@/utils/validationSchema";
import { VehiclePhotos, VehicleOnboardingStepsHookProps } from "@/types";
import { PhotoUpload, StepperNavigation } from "@/ui";
import useVehiclePhotosForm from "@/hooks/vehicle/useVehiclePhotosForm";

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
        appendFormData,
        photoViewOptions,
    } = useVehiclePhotosForm({ setPhotoTipIndex, currentStep, setCurrentStep });

    // Set the initial photoTipIndex when the component mounts
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={vehiclePhotosSchema}
            onSubmit={(values, { setSubmitting }) => {
                const formData = appendFormData(values);
                console.log("values", values);
                console.log("Form data:", formData);

                submitStep3.mutate(formData);
                setSubmitting(false);
            }}
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
            }) => (
                <Form className="w-full grid grid-cols-1 sm:grid-cols-2 gap-10">
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
                                    setFieldValue(item.name, null);
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
                            const formData = appendFormData(values);
                            console.log(formData);
                            saveStep3.mutate(formData);
                        }}
                        isSaveDraftloading={saveStep3.isPending}
                        isNextLoading={isSubmitting || submitStep3.isPending}
                        disableNextButton={
                            !isValid || isSubmitting || submitStep3.isPending
                        }
                    />
                </Form>
            )}
        </Formik>
    );
};

export default VehiclePhotosForm;
