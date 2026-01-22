import { useState } from "react";
import { TipsPopup } from "@/ui";
import Tips from "@/components/VehicleOnboarding/Tips";
import VehiclePhotosForm from "@/components/VehicleOnboarding/VehiclePhotos/VehiclePhotosForm";
import VehiclePhotosTips from "@/components/VehicleOnboarding/VehiclePhotos/VehiclePhotosTips";
import { VehicleOnboardingStepsHookProps } from "@/types"

const VehiclePhotos = ({ steps, currentStep, setCurrentStep }: VehicleOnboardingStepsHookProps) => {
  const [photoTipIndex, setPhotoTipIndex] = useState<number>(0);

  return (
    <div className="space-y-[52px]">
      <DesktopTips photoTipIndex={photoTipIndex} />
      <MobileTips photoTipIndex={photoTipIndex} />

      <VehiclePhotosForm
        steps={steps}
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
        setPhotoTipIndex={setPhotoTipIndex}
      />
    </div>
  );
};

const DesktopTips = ({ photoTipIndex }: { photoTipIndex: number }) => (
  <div className="hidden md:block">
    <VehiclePhotosTips photoTipIndex={photoTipIndex} />
  </div>
);

const MobileTips = ({ photoTipIndex }: { photoTipIndex: number }) => (
  <div className="block md:hidden">
    <TipsPopup
      trigger={
        <button className="w-full">
          <Tips />
        </button>
      }
      content={<VehiclePhotosTips photoTipIndex={photoTipIndex} />}
    />
  </div>
);

export default VehiclePhotos;
