"use client";

import cn from "classnames";

import { useEffect, useMemo, useRef, useState } from "react";

import { useSearchParams } from "next/navigation";

import { toast } from "react-toastify";

import BackLink from "@/components/BackLink";

import AdditionalInformation from "@/components/VehicleOnboarding/AdditionalInformation";

import AvailabilityAndPricing from "@/components/VehicleOnboarding/AvailabilityAndPricing";

import BasicVehicleInformation from "@/components/VehicleOnboarding/BasicInformation";

import VehicleSummary from "@/components/VehicleOnboarding/VehicleSummary";
import ListingSuccessModal from "@/components/VehicleOnboarding/VehicleSummary/ListingSuccessModal";

import useVehicleOnboarding from "@/hooks/vehicle/useVehicleOnboarding";

import DocumentInformation from "@/components/VehicleOnboarding/DocumentInformation";

import VehiclePhotos from "@/components/VehicleOnboarding/VehiclePhotos";

import { FullPageSpinner, Stepper } from "@/ui";

import { useKycStatus } from "@/hooks/useKycStatus";

import KycRequiredNotice from "@/components/KycRequiredNotice";

import { useAppSelector } from "@/lib/hooks";

import {

  canNavigateToOnboardingStep,

  getMaxReachableOnboardingStep,

  isOnboardingStepComplete,

} from "@/utils/vehicleOnboardingSteps";

import { getOnboardingVehicleId } from "@/utils/vehicleOnboardingSession";

import {

  isEditingExistingVehicle,

  isVehicleDraft,

} from "@/utils/vehicleOnboardingMode";



const steps = [

  "Basic Details",

  "Additional Details",

  "Photos",

  "Documents",

  "Availability and Pricing",

];



export default function VehicleOnboardingPage() {

  const { isLoading } = useVehicleOnboarding();

  const searchParams = useSearchParams();

  const routeVehicleId = searchParams.get("id");

  const { vehicle } = useAppSelector((state) => state.vehicleOnboarding);

  const [currentStep, setCurrentStep] = useState<number>(0);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successVehicleName, setSuccessVehicleName] = useState("vehicle");
  const [successModalMode, setSuccessModalMode] = useState<"submitted" | "updated">(
    "submitted"
  );

  const kyc = useKycStatus();



  const sessionVehicleId = getOnboardingVehicleId();

  const vehicleId = routeVehicleId ?? sessionVehicleId;

  const isDraftResume = !!vehicleId && isVehicleDraft(vehicle);

  const isEditingExisting = isEditingExistingVehicle(vehicleId, vehicle);



  const hasResumedDraftStep = useRef(false);



  useEffect(() => {

    if (!routeVehicleId || !vehicle || hasResumedDraftStep.current) return;

    if (!isDraftResume || isEditingExisting) return;



    hasResumedDraftStep.current = true;



    if (isOnboardingStepComplete(vehicle, 4)) {

      setCurrentStep(5);

      return;

    }



    const maxReachable = getMaxReachableOnboardingStep(vehicle);

    if (

      maxReachable < 4 &&

      isOnboardingStepComplete(vehicle, maxReachable)

    ) {

      setCurrentStep(maxReachable + 1);

      return;

    }



    setCurrentStep(maxReachable);

  }, [routeVehicleId, vehicle, isDraftResume, isEditingExisting]);



  const handleCurrentStep = (step: number) => {

    const allowed = canNavigateToOnboardingStep({

      targetStep: step,

      currentStep,

      vehicle,

      isDraftResume,

      isEditingExisting,

    });



    if (!allowed) {

      toast.error(

        isDraftResume || isEditingExisting

          ? "Complete the required fields in that step before opening it."

          : "Finish each step in order before moving forward."

      );

      return;

    }



    setCurrentStep(step);

  };



  const canClickStep = useMemo(

    () => (stepIndex: number) =>

      canNavigateToOnboardingStep({

        targetStep: stepIndex,

        currentStep,

        vehicle,

        isDraftResume,

        isEditingExisting,

      }),

    [currentStep, vehicle, isDraftResume, isEditingExisting]

  );



  const pageTitle = useMemo(() => {

    if (currentStep === 5) return "Summary";

    if (isEditingExisting) return "Edit Vehicle";

    return "Vehicle Onboarding";

  }, [currentStep, isEditingExisting]);



  if ((isLoading || kyc.isLoading) && !showSuccessModal) {

    return <FullPageSpinner />;

  }



  if (!kyc.canCreateListing) {

    return <KycRequiredNotice />;

  }



  return (

    <main className="pb-[188px] pt-[52px] md:pt-16 px-8 lg:px-[52px] min-h-screen">

      <div

        className={cn(

          "mx-auto space-y-8 md:space-y-[52px]",

          currentStep === 5

            ? "max-w-[1020px] 3xl:max-w-[1120px]"

            : "max-w-[1492px]"

        )}

      >

        <div className="space-y-8">

          <BackLink backLink={isEditingExisting ? "/listings" : "/dashboard"} />

          <h2 className="text-h5 md:text-h3 3xl:text-4xl text-black">

            {pageTitle}

          </h2>

        </div>

        <Stepper

          steps={steps}

          currentStep={currentStep}

          onStepClick={handleCurrentStep}

          canClickStep={canClickStep}

        >

          {currentStep === 0 && (

            <BasicVehicleInformation

              steps={steps}

              currentStep={currentStep}

              setCurrentStep={setCurrentStep}

            />

          )}

          {currentStep === 1 && (

            <AdditionalInformation

              steps={steps}

              currentStep={currentStep}

              setCurrentStep={setCurrentStep}

            />

          )}



          {currentStep === 2 && (

            <VehiclePhotos

              steps={steps}

              currentStep={currentStep}

              setCurrentStep={setCurrentStep}

            />

          )}

          {currentStep === 3 && (

            <DocumentInformation

              steps={steps}

              currentStep={currentStep}

              setCurrentStep={setCurrentStep}

            />

          )}

          {currentStep === 4 && (

            <AvailabilityAndPricing

              steps={steps}

              currentStep={currentStep}

              setCurrentStep={setCurrentStep}

            />

          )}

          {currentStep === 5 && (

            <VehicleSummary

              steps={steps}

              currentStep={currentStep}

              setCurrentStep={setCurrentStep}

              isEditingExisting={isEditingExisting}
              onSubmitSuccess={(name) => {
                setSuccessVehicleName(name);
                setSuccessModalMode(isEditingExisting ? "updated" : "submitted");
                setShowSuccessModal(true);
              }}
            />

          )}

        </Stepper>

      </div>

      <ListingSuccessModal
        open={showSuccessModal}
        onOpenChange={setShowSuccessModal}
        vehicleName={successVehicleName}
        mode={successModalMode}
      />
    </main>

  );

}


