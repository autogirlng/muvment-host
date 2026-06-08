import cn from "classnames";
import {
    BookingBadgeProps,
    ListingBadgeProps,
    TransactionBadgeProps,
    PaymentBadgeProps,
    ReferralBadgeProps
} from "./props";
import { VehicleStatus } from "@/types";
import { getBookingStatusLabel } from "@/utils/bookingStatusLabels";
import { getTripStatusLabel, tripStatusColors } from "@/utils/tripStatusLabels";

/* ─── shared primitive ─── */
function StatusPill({
    dot,
    bg,
    text,
    label,
    className,
}: {
    dot: string;
    bg: string;
    text: string;
    label: string;
    className?: string;
}) {
    return (
        <span
            className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap",
                bg,
                text,
                className
            )}
        >
            <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", dot)} />
            {label}
        </span>
    );
}

/* ─── helpers ─── */
function formatLabel(raw: string): string {
    return raw
        .replace(/_/g, " ")
        .toLowerCase()
        .replace(/\b\w/g, (c) => c.toUpperCase());
}

function bookingColors(status: string): { dot: string; bg: string; text: string } {
    const s = status?.toUpperCase();
    if (["CONFIRMED", "APPROVED", "ACCEPTED", "COMPLETED"].includes(s))
        return { dot: "bg-success-500", bg: "bg-success-50", text: "text-success-600" };
    if (["PENDING", "PENDING_PAYMENT", "IN_PROGRESS"].includes(s))
        return { dot: "bg-warning-400", bg: "bg-warning-75", text: "text-warning-700" };
    if (s.includes("CANCEL") || ["REJECTED", "FAILED_AVAILABILITY", "NO_SHOW", "VOID"].includes(s))
        return { dot: "bg-error-500", bg: "bg-error-50", text: "text-error-800" };
    if (["ABANDONED"].includes(s))
        return { dot: "bg-grey-400", bg: "bg-grey-90", text: "text-grey-600" };
    return { dot: "bg-grey-400", bg: "bg-grey-90", text: "text-grey-600" };
}

/* ─── Trip table badge ─── */
export const TripTableBadge = ({ status }: BookingBadgeProps) => {
    const { dot, bg, text } = tripStatusColors(status);
    return (
        <StatusPill
            dot={dot}
            bg={bg}
            text={text}
            label={getTripStatusLabel(status)}
        />
    );
};

/* ─── Booking table badge (used inside TableCell isBadge) ─── */
export const BookingTableBadge = ({ status }: BookingBadgeProps) => {
    const { dot, bg, text } = bookingColors(status);
    return (
        <StatusPill
            dot={dot}
            bg={bg}
            text={text}
            label={getBookingStatusLabel(status)}
        />
    );
};

/* ─── Booking badge (used on booking detail pages) ─── */
export const BookingBadge = ({ status }: BookingBadgeProps) => {
    const { dot, bg, text } = bookingColors(status);
    return (
        <StatusPill
            dot={dot}
            bg={bg}
            text={text}
            label={getBookingStatusLabel(status)}
            className="px-4 py-1.5 text-sm"
        />
    );
};

/* ─── Vehicle listing badge ─── */
export const VehicleListingBadge = ({ status }: { status: VehicleStatus }) => {
    const colors: Record<string, { dot: string; bg: string; text: string }> = {
        [VehicleStatus.APPROVED]:      { dot: "bg-success-500", bg: "bg-success-50",  text: "text-success-600" },
        [VehicleStatus.BOOKED]:        { dot: "bg-primary-500", bg: "bg-primary-50",  text: "text-primary-600" },
        [VehicleStatus.IN_TRIP]:       { dot: "bg-primary-500", bg: "bg-primary-50",  text: "text-primary-600" },
        [VehicleStatus.IN_REVIEW]:     { dot: "bg-warning-400", bg: "bg-warning-75",  text: "text-warning-700" },
        [VehicleStatus.IN_MAINTENANCE]:{ dot: "bg-warning-400", bg: "bg-warning-75",  text: "text-warning-700" },
        [VehicleStatus.UNAVAILABLE]:   { dot: "bg-error-500",   bg: "bg-error-50",    text: "text-error-800"   },
        [VehicleStatus.REJECTED]:      { dot: "bg-error-500",   bg: "bg-error-50",    text: "text-error-800"   },
        [VehicleStatus.COMPANY_USE]:   { dot: "bg-grey-400",    bg: "bg-grey-90",     text: "text-grey-600"    },
        [VehicleStatus.DRAFT]:         { dot: "bg-grey-400",    bg: "bg-grey-90",     text: "text-grey-500"    },
    };
    const { dot, bg, text } = colors[status] ?? { dot: "bg-grey-400", bg: "bg-grey-90", text: "text-grey-500" };
    return (
        <StatusPill
            dot={dot}
            bg={bg}
            text={text}
            label={formatLabel(status)}
            className="px-3 py-1.5 text-xs"
        />
    );
};

/* ─── Listing badge ─── */
export const ListingBadge = ({ status }: ListingBadgeProps) => {
    const colors: Record<string, { dot: string; bg: string; text: string }> = {
        approved: { dot: "bg-success-500", bg: "bg-success-50", text: "text-success-600" },
        review:   { dot: "bg-warning-400", bg: "bg-warning-75", text: "text-warning-700" },
        rejected: { dot: "bg-error-500",   bg: "bg-error-50",   text: "text-error-800"   },
        feedback: { dot: "bg-error-500",   bg: "bg-error-50",   text: "text-error-800"   },
    };
    const { dot, bg, text } = colors[status] ?? { dot: "bg-grey-400", bg: "bg-grey-90", text: "text-grey-500" };
    return <StatusPill dot={dot} bg={bg} text={text} label={formatLabel(status)} />;
};

/* ─── Transaction badge ─── */
export const TransactionBadge = ({ status }: TransactionBadgeProps) => {
    const colors: Record<string, { dot: string; bg: string; text: string }> = {
        SUCCESS: { dot: "bg-success-500", bg: "bg-success-50", text: "text-success-600" },
        FAILED:  { dot: "bg-error-500",   bg: "bg-error-50",   text: "text-error-800"   },
        PENDING: { dot: "bg-warning-400", bg: "bg-warning-75", text: "text-warning-700" },
    };
    const { dot, bg, text } = colors[status] ?? { dot: "bg-grey-400", bg: "bg-grey-90", text: "text-grey-500" };
    return <StatusPill dot={dot} bg={bg} text={text} label={formatLabel(status)} />;
};

/* ─── Payment badge ─── */
export const PaymentBadge = ({ status }: PaymentBadgeProps) => {
    const isSuccess = status === "successful" || status === "paid";
    const isFailed  = status === "failed" || status === "cancelled";
    const dot  = isSuccess ? "bg-success-500" : isFailed ? "bg-error-500"   : "bg-warning-400";
    const bg   = isSuccess ? "bg-success-50"  : isFailed ? "bg-error-50"    : "bg-warning-75";
    const text = isSuccess ? "text-success-600": isFailed ? "text-error-800" : "text-warning-700";
    return <StatusPill dot={dot} bg={bg} text={text} label={formatLabel(status)} />;
};

/* ─── Referral badge ─── */
export const ReferralBadge = ({ status }: ReferralBadgeProps) => {
    const joined = status === "JOINED";
    return (
        <StatusPill
            dot={joined ? "bg-success-500" : "bg-warning-400"}
            bg={joined ? "bg-success-50"  : "bg-warning-75"}
            text={joined ? "text-success-600" : "text-warning-700"}
            label={formatLabel(status)}
        />
    );
};
