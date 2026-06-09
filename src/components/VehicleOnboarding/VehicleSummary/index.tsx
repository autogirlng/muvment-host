import Link from "next/link";
import { useEffect } from "react";
import { FullPageSpinner, SingleCheckBox, StepperNavigation } from "@/ui";
import useVehicleSummary from "@/hooks/vehicle/useVehicleSummary";
import ViewAsCustomer from "@/components/VehicleOnboarding/VehicleSummary/ViewAsCustomer";
import { useHttp } from "@/hooks/useHttp";
import { useState } from "react";
import { VehicleInformationResponse, VehicleInformationStepper, VehicleOnboardingStepsHookProps } from "@/types";
import { getOnboardingVehicleId } from "@/utils/vehicleOnboardingSession";

type VehicleSummaryProps = VehicleOnboardingStepsHookProps & {
    isEditingExisting?: boolean;
    onSubmitSuccess?: (vehicleName: string) => void;
};

export default function VehicleSummary({
    steps,
    currentStep,
    setCurrentStep,
    isEditingExisting = false,
    onSubmitSuccess,
}: VehicleSummaryProps) {
    const vehicleId = getOnboardingVehicleId();
    const [vehicleInfo, setVehicleInfo] = useState<VehicleInformationStepper>();
    const [isLoadingVehicle, setIsLoadingVehicle] = useState(true);

    const http = useHttp();

    useEffect(() => {
        if (!vehicleId) {
            setIsLoadingVehicle(false);
            return;
        }

        let cancelled = false;
        setIsLoadingVehicle(true);

        http.get<VehicleInformationResponse>(`/vehicles/${vehicleId}`)
            .then((vehicle) => {
                if (!cancelled) {
                    setVehicleInfo(vehicle?.data);
                }
            })
            .finally(() => {
                if (!cancelled) {
                    setIsLoadingVehicle(false);
                }
            });

        return () => {
            cancelled = true;
        };
    }, [vehicleId]);

    const {
        submitForReview,
        submitVehicleOnboarding,
        agreeToTerms,
        setAgreeToTerms,
    } = useVehicleSummary({ isEditingExisting, onSubmitSuccess });

    if (isLoadingVehicle) {
        return <FullPageSpinner className="!min-h-[320px]" />;
    }

    return (
        <div className="space-y-11">
            <ViewAsCustomer vehicleInfo={vehicleInfo} />

            <div>
                <SingleCheckBox
                    id="agreeToTerms"
                    checked={agreeToTerms}
                    onChange={(isChecked: boolean) => {
                        setAgreeToTerms(isChecked);
                    }}
                >
                    <span className="text-xs md:text-xl 3xl:text-h6 !font-normal">
                        By submitting your vehicle you agree to the Rental{" "}
                        <Link href="/terms-of-service" className="text-primary-500">
                            Terms and conditions
                        </Link>
                    </span>
                </SingleCheckBox>
            </div>

            <StepperNavigation
                submitText={
                    submitVehicleOnboarding.isPending
                        ? "Submitting..."
                        : isEditingExisting
                          ? "Save changes"
                          : "Submit Vehicle"
                }
                //@ts-ignore
                steps={steps}
                currentStep={currentStep}
                setCurrentStep={setCurrentStep}
                handleSubmit={() => {
                    if (!agreeToTerms) return;
                    if (vehicleInfo?.name) {
                        sessionStorage.setItem("submittedVehicleName", vehicleInfo.name);
                    }
                    submitForReview(vehicleInfo?.name);
                }}
                isSubmitloading={submitVehicleOnboarding.isPending}
                disableSubmitButton={!agreeToTerms || submitVehicleOnboarding.isPending}
                disableSaveDraftButton
            />

        </div>
    );
}
