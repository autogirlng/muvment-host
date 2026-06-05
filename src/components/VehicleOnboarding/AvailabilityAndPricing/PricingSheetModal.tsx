"use client";

import { BlurredDialog, Button } from "@/ui";
import type { PricingSheetItem } from "@/hooks/pricing/usePublicPricing";
import { formatNumberWithCommas } from "@/utils/functions";

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  if (remainder === 0) return `${hours} hr${hours > 1 ? "s" : ""}`;
  return `${hours} hr ${remainder} min`;
}

type PricingSheetModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: PricingSheetItem[];
  isLoading?: boolean;
  onContinue: () => void;
  isContinuing?: boolean;
};

export default function PricingSheetModal({
  open,
  onOpenChange,
  items,
  isLoading,
  onContinue,
  isContinuing,
}: PricingSheetModalProps) {
  const activeItems = items.filter((item) => item.active);

  return (
    <BlurredDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Pricing sheet"
      description="Review the platform pricing for your vehicle before continuing."
      width="max-w-[720px]"
      content={
        <div className="space-y-5">
          {isLoading ? (
            <p className="text-sm text-grey-600">Loading pricing sheet...</p>
          ) : activeItems.length === 0 ? (
            <p className="text-sm text-grey-600 rounded-2xl border border-grey-200 bg-grey-50 p-4">
              No pricing sheet is available for this model and year yet. You can still
              continue — admin will set pricing during review.
            </p>
          ) : (
            <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
              {activeItems.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-grey-200 bg-white p-4 text-sm text-grey-800"
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-semibold text-grey-900">{item.bookingTypeName}</p>
                      <p className="text-xs text-grey-500 mt-0.5">
                        {item.vehicleMakeName} {item.vehicleModelName} ·{" "}
                        {formatDuration(item.durationInMinutes)}
                      </p>
                    </div>
                    <p className="text-base font-bold text-primary-600 tabular-nums">
                      NGN {formatNumberWithCommas(item.price)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
          <Button
            color="primary"
            radius="lg"
            fullWidth
            loading={isContinuing}
            disabled={isContinuing}
            onClick={onContinue}
          >
            Continue to summary
          </Button>
        </div>
      }
    />
  );
}
