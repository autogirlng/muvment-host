import Link from "next/link";
import { ReactNode } from "react";
import {
    BookingBadgeStatus,
    BookingSegmentContent,
    TransactionStatus,
} from "@/types";
import { Popup, BookingTableBadge, TransactionBadge, MoreButton } from "@/ui";
import { getBookingDisplayId } from "@/utils/displayIds";


const TableCell = ({
    title,
    content,
    isBadge,
    type,
}: {
    title: string;
    content: string | ReactNode;
    isBadge?: boolean;
    type?: "transaction" | "booking";
}) => (
    <div className="text-sm w-full flex gap-5 items-center justify-between">
        <span className="text-grey-700 w-1/2">{title}</span>
        <span className="font-semibold text-grey-700 w-1/2 break-all">
            {isBadge ? (
                type === "transaction" ? (
                    <TransactionBadge status={content as TransactionStatus} />
                ) : (
                    <BookingTableBadge status={content as BookingBadgeStatus} />
                )
            ) : (
                content
            )}
        </span>
    </div>
);

const BookingMobileRow = ({ items }: { items: BookingSegmentContent }) => {
    return (
        <div className="space-y-3 border-b border-grey-100 pb-4 last:border-0 last:pb-0">
            <Popup
                trigger={<MoreButton className="!mx-0 !ml-auto" />}
                content={
                    <>
                        <p className="!text-xs 3xl:!text-base !font-semibold">Actions</p>
                        <ul className="space-y-2 *:py-2">
                            <li>
                                <Link
                                    href={`/bookings/${items?.bookingId}`}
                                    className="!text-xs 3xl:!text-base"
                                >
                                    View Booking Details
                                </Link>
                            </li>
                        </ul>
                    </>
                }
            />
            <TableCell
                title="Invoice Number"
                content={getBookingDisplayId(items)}
            />
            <TableCell title="Booking Type" content={items?.bookingCategory} />
            <TableCell title="Duration" content={`${items?.duration} days`} />
            <TableCell title="Vehicle" content={items?.vehicleName} />
            <TableCell title="Start Date" content="" />
            <TableCell title="End Date" content="" />
            <TableCell
                title="Booking Status"
                content={items?.bookingStatus}
                isBadge
                type="booking"
            />
            <TableCell title="Price" content={`NGN ${items?.price}`} />
        </div>
    );
};

export default BookingMobileRow;
