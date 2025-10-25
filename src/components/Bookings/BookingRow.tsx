import Link from "next/link";
import { format } from "date-fns";
import { BookingBadgeStatus, BookingInformation } from "@/types";
import { Popup, Icons } from "@/ui";
import TableCell from "@/components/Table/TableCell";
import DeclineTrip from "@/components/Bookings/modals/DeclineTrip";
import AcceptTrip from "@/components/Bookings/modals/AcceptTrip";
import useBookingActions from "@/hooks/bookings/useBookingActions";

const BookingRow = ({ items }: { items: BookingInformation }) => {
    const {
        openAcceptModal,
        handleAcceptModal,
        acceptBooking,

        openDeclineModal,
        handleDeclineModal,
        declineBooking,
    } = useBookingActions({ id: items.id });
    return (
        <tr>
            <TableCell content={items?.vehicle?.listingName} />
            <TableCell content={items?.guestName} className="text-grey-900" />
            <TableCell content={items?.id} />
            <TableCell content={items?.bookingType} />
            <TableCell content={`${items?.duration} days`} />
            <TableCell
                content={
                    items?.startDate
                        ? format(new Date(items?.startDate), "MMM d ,yyyy")
                        : ""
                }
            />
            <TableCell
                content={
                    items?.endDate ? format(new Date(items?.endDate), "MMM d ,yyyy") : ""
                }
            />
            <TableCell content={items?.bookingStatus} isBadge type="booking" />
            <TableCell content={`${items?.currencyCode} ${items?.amount}`} />
            <td>
                <Popup
                    trigger={
                        <button
                            className={
                                "block border border-grey-200 bg-white text-black rounded-lg p-2 w-fit mx-auto"
                            }
                        >
                            {Icons.ic_more}
                        </button>
                    }
                    content={
                        <>
                            <p className="!text-xs 3xl:!text-base !font-semibold">Actions</p>
                            <ul className="space-y-2 *:py-2">
                                {items.bookingStatus !== BookingBadgeStatus.APPROVED &&
                                    items.bookingStatus !== BookingBadgeStatus.ACCEPTED && (
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
                                        href={`/bookings/${items?.id}`}
                                        className="!text-xs 3xl:!text-base"
                                    >
                                        View Booking Details
                                    </Link>
                                </li>
                            </ul>
                        </>
                    }
                />
            </td>
        </tr>
    );
};

export default BookingRow;
