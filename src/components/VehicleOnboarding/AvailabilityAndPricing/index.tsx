import { TipsPopup } from "@/ui";
import Tips from "@/components/VehicleOnboarding//Tips";
import AvailabilityAndPricingForm from "./AvailabilityAndPricingForm";
import AvailabilityAndPricingTips from "./AvailabilityAndPricingTips";
import { VehicleOnboardingStepsHookProps } from "@/types"

export default function AvailabilityAndPricing({ steps, setCurrentStep, currentStep }: VehicleOnboardingStepsHookProps) {
    return (
        <div className="flex justify-between flex-col-reverse md:flex-row gap-8">
            <AvailabilityAndPricingForm steps={steps} currentStep={currentStep} setCurrentStep={setCurrentStep} />
            <DesktopTips />
            <MobileTips />
        </div>
    );
}

const DesktopTips = () => (
    <div className="hidden md:block">
        <Tips>
            <AvailabilityAndPricingTips />
        </Tips>
    </div>
);

const MobileTips = () => (
    <div className="block md:hidden">
        <TipsPopup
            trigger={
                <button className="w-full">
                    <Tips />
                </button>
            }
            content={
                <Tips>
                    <AvailabilityAndPricingTips />
                </Tips>
            }
        />
    </div>
);
