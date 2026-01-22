import cn from "classnames";
import { Spinner, FullPageDialog } from "@/ui";
import EarningsModal from "@/components/ActivityCard/modal/EarningsModal";
import ReviewsModal from "@/components/ActivityCard/modal/ReviewsModal"
import { ActivityCardProps } from "./props";

export default function ActivityCard({
    primary,
    title,
    value,
    modalTitle,
    modalName,
    modalIcon,
    isLoading,
    className,
}: ActivityCardProps) {
    return (
        <div
            className={cn(
                "rounded-xl px-3 py-5 space-y-4",

                primary && value !== "-"
                    ? "bg-primary-500 border border-grey-200 text-white"
                    : "bg-white border border-grey-200 text-grey-500",
                className
            )}
        >
            <div className="flex justify-between gap-1 text-xs 3xl:text-sm">
                <p>{title}</p>
                {modalTitle && (
                    <FullPageDialog
                        title={modalName === "graph" ? "Earnings" : "Reviews"}
                        trigger={
                            <button className="flex items-center gap-1 min-w-[103px]">
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
            {isLoading ? (
                <Spinner />
            ) : (
                <h2
                    className={cn(
                        "text-h3 2xl:text-4xl",
                        primary && value !== "-" ? "text-white" : "text-black"
                    )}
                >
                    {(modalName == "graph" || modalName == "balance") && value !== "-" ? `₦${Number(value).toFixed(2)}` : value}
                </h2>
            )}
        </div>
    );
}
