import Link from "next/link";
import { SingleCheckBox, StepperNavigation } from "@/ui";
import useVehicleSummary from "@/hooks/vehicle/useVehicleSummary";
import ViewAsCustomer from "@/components/VehicleOnboarding/VehicleSummary/ViewAsCustomer";
import { useHttp } from "@/hooks/useHttp";
import { useEffect, useState } from "react";
import { VehicleInformationResponse, VehicleInformationStepper, VehicleOnboardingStepsHookProps } from "@/types";

export default function VehicleSummary({
    steps,
    currentStep,
    setCurrentStep,
}: VehicleOnboardingStepsHookProps) {
    const vehicleId = sessionStorage.getItem("vehicleId")
    const [vehicleInfo, setVehicleInfo] = useState<VehicleInformationStepper>()

    const http = useHttp();

    const fetchVehicleDetails = async () => {
        const vehicle = await http.get<VehicleInformationResponse>(`/v1/vehicles/${vehicleId}`)
        setVehicleInfo(vehicle?.data)

    }

    useEffect(() => {
        fetchVehicleDetails();
    }, [])


    const { submitVehicleOnboarding, agreeToTerms, setAgreeToTerms } = useVehicleSummary();

    return (
        <div className="space-y-11">
            <ViewAsCustomer vehicleInfo={vehicleInfo} />

            <div>
                {/* checkbox */}
                <p className="text-xs md:text-xl 3xl:text-h6 !font-normal flex items-center gap-3">
                    <SingleCheckBox
                        id="agreeToTerms"
                        checked={agreeToTerms}
                        onChange={(isChecked: boolean) => {
                            setAgreeToTerms(isChecked);
                        }}
                    />
                    By submitting your vehicle you agree to the Rental{" "}
                    <Link href="/terms-of-service" className="text-primary-500">
                        Terms and conditions
                    </Link>
                </p>
            </div>

            <StepperNavigation
                submitText="Submit Vehicle"
                //@ts-ignore
                steps={steps}
                currentStep={currentStep}
                setCurrentStep={setCurrentStep}
                handleSubmit={() => {
                    submitVehicleOnboarding.mutate();
                }}
                isSubmitloading={submitVehicleOnboarding.isPending}
                disableSubmitButton={!agreeToTerms}
                disableSaveDraftButton
            />
        </div>
    );
}
