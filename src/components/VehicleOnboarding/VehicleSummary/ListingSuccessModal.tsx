"use client";

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
          <div
            className="flex h-20 w-20 items-center justify-center rounded-full bg-success-50 text-success-600 text-4xl"
            aria-hidden
          >
            ✓
          </div>
          <span className="text-h5 md:text-h4 text-black">
            {isUpdate ? "Vehicle updated" : "Vehicle listed successfully"}
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
