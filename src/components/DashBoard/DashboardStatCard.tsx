import cn from "classnames";
import type { ReactNode } from "react";
import { Spinner, FullPageDialog } from "@/ui";
import EarningsModal from "@/components/ActivityCard/modal/EarningsModal";
import ReviewsModal from "@/components/ActivityCard/modal/ReviewsModal";
import {
  formatLocaleCount,
  formatNgnAmount,
  parseLooseNumber,
} from "@/utils/formatters";

type IconTone = "purple" | "green" | "blue" | "orange";

const iconToneStyles: Record<IconTone, string> = {
  purple: "bg-[#7C3AED]",
  green: "bg-success-500",
  blue: "bg-primary-400",
  orange: "bg-warning-500",
};

type DashboardStatCardProps = {
  title: string;
  value: string | number;
  icon: ReactNode;
  iconTone: IconTone;
  valueTone?: "primary" | "default";
  modalTitle?: string;
  modalName?: "graph" | "review" | "balance";
  modalIcon?: ReactNode;
  showCurrency?: boolean;
  isLoading?: boolean;
};

function formatDisplayValue(
  value: string,
  modalName?: string,
  showCurrency?: boolean,
): string {
  if (value === "-" || value === "") return value;
  const n = parseLooseNumber(value);
  if (n === null) return value;

  const asMoney =
    showCurrency || modalName === "graph" || modalName === "balance";

  if (asMoney) {
    return `₦${formatNgnAmount(n)}`;
  }

  return formatLocaleCount(n);
}

export default function DashboardStatCard({
  title,
  value,
  icon,
  iconTone,
  valueTone = "default",
  modalTitle,
  modalName,
  modalIcon,
  showCurrency,
  isLoading,
}: DashboardStatCardProps) {
  const displayRaw =
    value === undefined || value === null || value === ""
      ? "-"
      : String(value);

  return (
    <div className="flex h-full flex-col rounded-2xl border border-grey-200 bg-white px-4 py-4 sm:px-5 sm:py-5">
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2.5">
          <span
            className={cn(
              "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white",
              iconToneStyles[iconTone],
            )}
          >
            <span className="scale-90 [&_svg]:stroke-white [&_svg]:text-white">
              {icon}
            </span>
          </span>
          <p className="text-xs sm:text-sm text-grey-500 leading-snug">{title}</p>
        </div>
        {modalTitle && modalName && (
          <FullPageDialog
            title={modalName === "graph" ? "Earnings" : "Reviews"}
            trigger={
              <button className="flex shrink-0 items-center gap-1 text-xs text-primary-500 sm:text-sm">
                {modalIcon}
                <span>{modalTitle}</span>
              </button>
            }
            content={
              modalName === "graph" ? <EarningsModal /> : <ReviewsModal />
            }
          />
        )}
      </div>

      <div className="mt-auto pt-4 sm:pt-5">
        {isLoading ? (
          <Spinner />
        ) : (
          <p
            className={cn(
              "text-2xl font-bold sm:text-[28px] lg:text-[32px] leading-none",
              valueTone === "primary" && displayRaw === "-"
                ? "text-primary-500"
                : "text-grey-900",
            )}
          >
            {formatDisplayValue(displayRaw, modalName, showCurrency)}
          </p>
        )}
      </div>
    </div>
  );
}
