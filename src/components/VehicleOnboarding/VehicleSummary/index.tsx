import Link from "next/link";
import { useEffect } from "react";
import { SingleCheckBox, StepperNavigation } from "@/ui";
import useVehicleSummary from "@/hooks/vehicle/useVehicleSummary";
import ViewAsCustomer from "@/components/VehicleOnboarding/VehicleSummary/ViewAsCustomer";
import ListingSuccessModal from "@/components/VehicleOnboarding/VehicleSummary/ListingSuccessModal";
import { useHttp } from "@/hooks/useHttp";
import { useState } from "react";
import { VehicleInformationResponse, VehicleInformationStepper, VehicleOnboardingStepsHookProps } from "@/types";
import { getOnboardingVehicleId } from "@/utils/vehicleOnboardingSession";

export default function VehicleSummary({
    steps,
    currentStep,
    setCurrentStep,
}: VehicleOnboardingStepsHookProps) {
    const vehicleId = getOnboardingVehicleId();
    const [vehicleInfo, setVehicleInfo] = useState<VehicleInformationStepper>();

    const http = useHttp();

    const fetchVehicleDetails = async () => {
        if (!vehicleId) return;
        const vehicle = await http.get<VehicleInformationResponse>(`/vehicles/${vehicleId}`);
        setVehicleInfo(vehicle?.data);
    };

    useEffect(() => {
        fetchVehicleDetails();
    }, [vehicleId]);

    const {
        submitForReview,
        submitVehicleOnboarding,
        agreeToTerms,
        setAgreeToTerms,
        showSuccessModal,
        setShowSuccessModal,
        submittedVehicleName,
    } = useVehicleSummary();

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
                submitText={submitVehicleOnboarding.isPending ? "Submitting..." : "Submit Vehicle"}
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

            <ListingSuccessModal
                open={showSuccessModal}
                onOpenChange={setShowSuccessModal}
                vehicleName={submittedVehicleName}
            />
        </div>
    );
}
