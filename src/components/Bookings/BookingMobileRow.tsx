import Link from "next/link";
import { format } from "date-fns";
import { ReactNode } from "react";
import {
    BookingBadgeStatus,
    BookingInformation,
    BookingSegmentContent,
    BookingStatus,
    TransactionStatus,
} from "@/types";
import { Popup, BookingTableBadge, TransactionBadge, MoreButton } from "@/ui";
import DeclineTrip from "@/components/Bookings/modals/DeclineTrip";
import AcceptTrip from "@/components/Bookings/modals/AcceptTrip";
import useBookingActions from "@/hooks/bookings/useBookingActions";


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
    const {
        openAcceptModal,
        handleAcceptModal,
        acceptBooking,

        openDeclineModal,
        handleDeclineModal,
        declineBooking,
    } = useBookingActions({ id: items.bookingId });
    return (
        <div className="space-y-3 pt-5 pb-3 border-b border-grey-300">
            <Popup
                trigger={<MoreButton className="!mx-0 !ml-auto" />}
                content={
                    <>
                        <p className="!text-xs 3xl:!text-base !font-semibold">Actions</p>
                        <ul className="space-y-2 *:py-2">
                            {items.bookingStatus !== BookingStatus.CONFIRMED && (
                                <>
                                    <li>
                                        <DeclineTrip
                                            openModal={openDeclineModal}
                                            handleModal={() => handleDeclineModal()}
                                            isLoading={declineBooking.isPending}
                                            handleAction={() => declineBooking.mutate()}
                                            trigger={
                                                <button className="!text-xs 3xl:!text-base ">
                                                    Decline Trip
                                                </button>
                                            }
                                        />
                                    </li>
                                    <li>
                                        <AcceptTrip
                                            openModal={openAcceptModal}
                                            handleModal={() => handleAcceptModal()}
                                            isLoading={acceptBooking.isPending}
                                            handleAction={() => acceptBooking.mutate()}
                                            trigger={
                                                <button className="!text-xs 3xl:!text-base ">
                                                    Accept Trip
                                                </button>
                                            }
                                        />
                                    </li>
                                </>
                            )}
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
            <TableCell title="Guest Name" content={items?.customerName} />
            <TableCell title="Booking ID" content={items?.bookingId} />
            <TableCell title="Booking Type" content={items?.bookingType} />
            <TableCell title="Duration" content={`${items?.duration} days`} />
            <TableCell title="Vehicle" content={items?.vehicleName} />
            <TableCell
                title="Start Date"
                content={
                    ""
                }
            />
            <TableCell
                title="End Date"
                content={
                    // items?.endDate ? format(new Date(items?.endDate), "MMM d ,yyyy") : ""
                    ""
                }
            />

            <TableCell
                title="Status"
                content={items?.bookingStatus}
                isBadge
                type="booking"
            />
            <TableCell
                title="Price"
                content={`NGN ${items?.price}`}
            />
        </div>
    );
};

export default BookingMobileRow;
