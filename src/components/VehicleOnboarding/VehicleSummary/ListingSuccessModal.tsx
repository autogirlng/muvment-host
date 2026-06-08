"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { BlurredDialog, Button } from "@/ui";

type ListingSuccessModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehicleName: string;
  mode?: "submitted" | "updated";
};

export default function ListingSuccessModal({
  open,
  onOpenChange,
  vehicleName,
  mode = "submitted",
}: ListingSuccessModalProps) {
  const router = useRouter();
  const isUpdate = mode === "updated";

  const handleBackToListings = () => {
    onOpenChange(false);
    router.push("/listings");
  };

  return (
    <BlurredDialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) return;
        onOpenChange(nextOpen);
      }}
      width="max-w-[640px]"
      title={
        <div className="flex flex-col items-center text-center gap-6">
          <Image
            src="/icons/success_confetti.png"
            alt=""
            height={80}
            width={80}
          />
          <span className="text-h5 md:text-h4 text-black">
            {isUpdate ? "Vehicle updated" : "Listing successful"}
          </span>
        </div>
      }
      description={
        isUpdate
          ? `Your changes to ${vehicleName} have been saved.`
          : `Your ${vehicleName} has been submitted for review. Our team will review it and notify you once it's approved.`
      }
      content={
        <div className="flex justify-center pt-2">
          <Button
            variant="filled"
            color="primary"
            className="px-8"
            onClick={handleBackToListings}
          >
            Go to Listings
          </Button>
        </div>
      }
    />
  );
}
