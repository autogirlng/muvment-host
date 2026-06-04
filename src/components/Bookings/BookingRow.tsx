import Link from "next/link";
import { BookingSegmentContent, BookingStatus } from "@/types";
import { Popup, MoreButton } from "@/ui";
import { TableCell, TableRow } from "@/components/Table";
import DeclineTrip from "@/components/Bookings/modals/DeclineTrip";
import AcceptTrip from "@/components/Bookings/modals/AcceptTrip";
import useBookingActions from "@/hooks/bookings/useBookingActions";

function formatDurationLabel(duration: string | undefined): string {
    if (duration == null || duration === "") return "";
    const s = String(duration).trim();
    if (/day/i.test(s)) return s;
    return `${s} days`;
}

type BookingActionsMenuProps = {
    items: BookingSegmentContent;
    openAcceptModal: boolean;
    handleAcceptModal: () => void;
    acceptBooking: { isPending: boolean; mutate: () => void };
    openDeclineModal: boolean;
    handleDeclineModal: () => void;
    declineBooking: { isPending: boolean; mutate: () => void };
};

function BookingActionsMenu({
    items,
    openAcceptModal,
    handleAcceptModal,
    acceptBooking,
    openDeclineModal,
    handleDeclineModal,
    declineBooking,
}: BookingActionsMenuProps) {
    return (
        <Popup
            trigger={<MoreButton className="!mx-0" />}
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
    );
}

const BookingRow = ({ items }: { items: BookingSegmentContent }) => {
    const {
        openAcceptModal,
        handleAcceptModal,
        acceptBooking,
        openDeclineModal,
        handleDeclineModal,
        declineBooking,
    } = useBookingActions({ id: items.bookingId });

    const actionsMenuProps = {
        items,
        openAcceptModal,
        handleAcceptModal,
        acceptBooking,
        openDeclineModal,
        handleDeclineModal,
        declineBooking,
    };

    return (
        <TableRow>
            <td className="order-first mb-2 flex w-full justify-end border-0 px-0 py-0 lg:hidden">
                <BookingActionsMenu {...actionsMenuProps} />
            </td>
            <TableCell title="Vehicle" content={items?.vehicleName} />
            <TableCell
                title="Invoice Number"
                content={items?.invoiceNumber || items?.bookingId || "—"}
            />
            <TableCell title="Booking Type" content={items?.bookingCategory} />
            <TableCell title="Duration" content={formatDurationLabel(items?.duration)} />
            <TableCell title="Status" content={items?.bookingStatus} isBadge type="booking" />
            <td className="hidden px-5 py-4 lg:table-cell lg:w-fit">
                <BookingActionsMenu {...actionsMenuProps} />
            </td>
        </TableRow>
    );
};

export default BookingRow;
