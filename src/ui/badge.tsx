import cn from "classnames";
import {
    BookingBadgeProps,
    ListingBadgeProps,
    TransactionBadgeProps,
    PaymentBadgeProps,
    ReferralBadgeProps
} from "./props";
import { VehicleStatus } from "@/types";


export const BookingTableBadge = ({ status }: BookingBadgeProps) => {
    const badgeColor =
        status === "ACCEPTED" || status === "APPROVED"
            ? "bg-success-500"
            : status === "CANCELLED"
                ? "bg-error-900"
                : status === "PENDING"
                    ? "bg-warning-400"
                    : "bg-grey-500";

    return (
        <div
            className={cn(
                "px-3 py-[2px] text-sm font-medium capitalize text-white rounded-xl w-fit",
                badgeColor
            )}
        >
            {status === "APPROVED" ? "accepted" : status.toLocaleLowerCase()}
        </div>
    );
};

export const BookingBadge = ({ status }: BookingBadgeProps) => {
    const badgeColor =
        status === "APPROVED"
            ? "bg-success-100 text-success-600"
            : status === "CANCELLED"
                ? "bg-error-100 text-error-900"
                : status === "PENDING"
                    ? "bg-warning-75 text-warning-500"
                    : "bg-grey-90 text-grey-500";

    return (
        <div
            className={cn(
                "px-6 py-2 text-sm 3xl:text-base font-medium capitalize rounded-[121px] w-fit",
                badgeColor
            )}
        >
            {status.toLocaleLowerCase()}
        </div>
    );
};


export const VehicleListingBadge = ({ status }: { status: VehicleStatus }) => {
    const badgeColor =
        status === VehicleStatus.BOOKED || status === VehicleStatus.APPROVED
            ? "bg-success-100 text-success-600"
            : status === VehicleStatus.IN_REVIEW || status === VehicleStatus.IN_MAINTENANCE
                ? "bg-warning-75 text-warning-500"
                : status === VehicleStatus.UNAVAILABLE
                    ? "bg-error-100 text-error-900"
                    : "bg-grey-300 text-grey-500";

    return (
        <div
            className={cn(
                "px-6 py-2 text-sm 3xl:text-base font-medium capitalize rounded-[121px]",
                badgeColor
            )}
        >
            {status}
        </div>
    );
};


export const ListingBadge = ({ status }: ListingBadgeProps) => {
    const badgeColor =
        status === "approved"
            ? "bg-success-100 text-success-600"
            : status === "review"
                ? "bg-warning-75 text-warning-500"
                : status === "rejected" || status === "feedback"
                    ? "bg-error-100 text-error-900"
                    : "bg-grey-300 text-grey-500";

    return (
        <div
            className={cn(
                "px-6 py-2 text-sm 3xl:text-base font-medium capitalize rounded-[121px]",
                badgeColor
            )}
        >
            {status}
        </div>
    );
};


export const TransactionBadge = ({ status }: TransactionBadgeProps) => {
    const badgeColor =
        status === "SUCCESS"
            ? "bg-success-500"
            : status === "FAILED"
                ? "bg-error-800"
                : "bg-warning-500";

    return (
        <div
            className={cn(
                "px-3 py-[2px] text-sm font-medium capitalize text-white rounded-xl w-fit",
                badgeColor
            )}
        >
            {status.toLocaleLowerCase()}
        </div>
    );
};


export const PaymentBadge = ({ status }: PaymentBadgeProps) => {
    const badgeColor =
        status === "successful" || status === "paid"
            ? "bg-success-500"
            : status === "failed" || status === "cancelled"
                ? "bg-error-800"
                : "bg-warning-500";

    return (
        <div
            className={cn(
                "px-3 py-[2px] text-sm font-medium capitalize text-white rounded-xl w-fit",
                badgeColor
            )}
        >
            {status}
        </div>
    );
};


export const ReferralBadge = ({ status }: ReferralBadgeProps) => {
    const badgeColor = status === "JOINED" ? "bg-success-500" : "bg-warning-500";

    return (
        <div
            className={cn(
                "px-3 py-[2px] text-sm font-medium capitalize text-white rounded-xl w-fit",
                badgeColor
            )}
        >
            {status.toLocaleLowerCase()}
        </div>
    );
};
