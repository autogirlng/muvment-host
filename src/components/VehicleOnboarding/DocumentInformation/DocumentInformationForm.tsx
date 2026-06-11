import { useState } from "react";
import { Formik, Form } from "formik";
import { toast } from "react-toastify";
import { StepperNavigation, FileInputField, Button } from "@/ui";
import { documentVehicleInformationSchema } from "@/utils/validationSchema";
import useDocumentInformationForm from "@/hooks/vehicle/useDocumentInformationForm";
import { VehicleOnboardingStepsHookProps } from "@/types"
import { createPlaceholderPdfFile } from "@/utils/devPrefill";

const DOCUMENT_PREFILL_FIELDS: { name: string; label: string }[] = [
    { name: "proofOfOwnership", label: "Proof Of Ownership" },
    { name: "vehicleRegistration", label: "Vehicle Registration" },
    { name: "insuranceCertificate", label: "Insurance Certificate" },
    { name: "inspectionReport", label: "Inspection Report" },
    { name: "maintenanceHistory", label: "Maintenance History" },
    { name: "authorizationLetter", label: "Authorization Letter" },
];

const DocumentInformationForm = ({
    steps,
    currentStep,
    setCurrentStep,
}: VehicleOnboardingStepsHookProps) => {
    const { submitStep5, saveStep5, initialValues } = useDocumentInformationForm({
        currentStep,
        setCurrentStep,
    });

    const [isPrefilling, setIsPrefilling] = useState(false);

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={documentVehicleInformationSchema}
            enableReinitialize
            validateOnChange
            validateOnBlur
            onSubmit={(values, { setSubmitting }) => {
                submitStep5.mutate(values);
                setSubmitting(false);
            }}
        >
            {({ values, setFieldValue, isValid, isSubmitting }) => {
                const handlePrefill = () => {
                    try {
                        setIsPrefilling(true);
                        DOCUMENT_PREFILL_FIELDS.forEach((field) => {
                            setFieldValue(field.name, createPlaceholderPdfFile(field.label));
                        });
                        toast.success("Documents prefilled with placeholder files");
                    } catch {
                        toast.error("Could not prefill documents");
                    } finally {
                        setIsPrefilling(false);
                    }
                };

                return (
                <Form className="max-w-[800px] w-full space-y-8">
                    <div className="flex justify-end">
                        <Button
                            type="button"
                            color="white"
                            radius="lg"
                            onClick={handlePrefill}
                            loading={isPrefilling}
                            className="!py-2.5 !px-6 !text-sm border border-primary-500"
                        >
                            Prefill with placeholder documents
                        </Button>
                    </div>
                    <FileInputField
                        name="proofOfOwnership"
                        id="proofOfOwnership"
                        label="Proof Of Ownership"
                        placeholder="Upload Document"
                        filePicker
                        onFileSelect={(file) => setFieldValue("proofOfOwnership", file)}
                        info
                        tooltipTitle="Proof Of Ownership:"
                        tooltipDescription="Upload documents such as vehicle purchase receipts or Certificate of Ownership to verify that you legally own the vehicle."
                        value={values.proofOfOwnership}
                    />
                    <FileInputField
                        name="vehicleRegistration"
                        id="vehicleRegistration"
                        label="Vehicle Registration Document"
                        placeholder="Upload Document"
                        filePicker
                        onFileSelect={(file) => setFieldValue("vehicleRegistration", file)}
                        info
                        tooltipTitle="Vehicle Registration Document:"
                        tooltipDescription="Provide a document showing that the vehicle is officially registered and recognized by the appropriate authorities."
                        value={values.vehicleRegistration}
                    />
                    <FileInputField
                        name="insuranceCertificate"
                        id="insuranceCertificate"
                        label="Current Insurance Certificate"
                        placeholder="Upload Document"
                        filePicker
                        onFileSelect={(file) => setFieldValue("insuranceCertificate", file)}
                        info
                        tooltipTitle="Current Insurance Certificate:"
                        tooltipDescription="Submit your current insurance certificate to confirm that the vehicle is insured with valid coverage."
                        value={values.insuranceCertificate}
                    />
                    <FileInputField
                        name="inspectionReport"
                        id="inspectionReport"
                        label="Vehicle Inspection Report"
                        placeholder="Upload Document"
                        filePicker
                        onFileSelect={(file) =>
                            setFieldValue("inspectionReport", file)
                        }
                        info
                        tooltipTitle="Vehicle Inspection Report:"
                        tooltipDescription="Attach a report from a certified inspection authority to verify the condition of the vehicle. Providing this helps Muvment ensure your vehicle can serve our users with confidence."
                        value={values.inspectionReport}
                    />
                    <FileInputField
                        name="maintenanceHistory"
                        id="maintenanceHistory"
                        label="Maintenance History (optional)"
                        placeholder="Upload Document"
                        filePicker
                        onFileSelect={(file) => setFieldValue("maintenanceHistory", file)}
                        info
                        tooltipTitle="Maintenance History:"
                        tooltipDescription="Share service and maintenance records to showcase regular upkeep. This helps build trust in your vehicle’s performance for our user experiences."
                        value={values.maintenanceHistory}
                    />
                    <FileInputField
                        name="authorizationLetter"
                        id="authorizationLetter"
                        label="Authorization Letter"
                        placeholder="Upload Document"
                        filePicker
                        onFileSelect={(file) => setFieldValue("authorizationLetter", file)}
                        info
                        tooltipTitle="Authorization Letter:"
                        tooltipDescription="If you are not the owner but have permission to use the vehicle, provide a formal authorization letter granting you permission to manage the vehicle."
                        value={values.authorizationLetter}
                    />

                    <StepperNavigation
                        steps={steps ?? []}
                        currentStep={currentStep}
                        setCurrentStep={setCurrentStep}
                        handleSaveDraft={() => {
                            saveStep5.mutate(values);
                        }}
                        isSaveDraftloading={saveStep5.isPending}
                        isNextLoading={isSubmitting || submitStep5.isPending}
                        disableNextButton={
                            !isValid || isSubmitting || submitStep5.isPending
                        }
                    />
                </Form>
                );
            }}
        </Formik>
    );
};

export default DocumentInformationForm;
