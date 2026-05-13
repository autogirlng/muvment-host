import Link from "next/link";
import { BookingSegmentContent, BookingStatus } from "@/types";
import { Popup, Icons } from "@/ui";
import TableCell from "@/components/Table/TableCell";
import DeclineTrip from "@/components/Bookings/modals/DeclineTrip";
import AcceptTrip from "@/components/Bookings/modals/AcceptTrip";
import useBookingActions from "@/hooks/bookings/useBookingActions";

function formatDurationLabel(duration: string | undefined): string {
    if (duration == null || duration === "") return "";
    const s = String(duration).trim();
    if (/day/i.test(s)) return s;
    return `${s} days`;
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
    return (
        <tr className="block lg:table-row bg-white border-2 border-grey-200 lg:border-none hover:border-grey-300 lg:hover:bg-grey-50 rounded-xl lg:rounded-none mb-4 lg:mb-0 p-4 lg:p-0 shadow-sm lg:shadow-none transition-all">
            <TableCell title="Vehicle" content={items?.vehicleName} />
            {/* <TableCell title="Guest Name" content={items?.customerName} className="text-grey-900" /> */}
            <TableCell title="Booking ID" content={items?.bookingId} />
            <TableCell title="Booking Type" content={items?.bookingCategory} />
            <TableCell title="Duration" content={formatDurationLabel(items?.duration)} />
            {/* <TableCell
                content={
                    items?.bookingType

                }
            /> */}
            {/* <TableCell
                content={
                    items?.endDate ? format(new Date(items?.endDate), "MMM d ,yyyy") : ""
                }
            /> */}
            <TableCell title="Status" content={items?.bookingStatus} isBadge type="booking" />
            {/* <TableCell title="Price" content={`NGN ${items?.price}`} /> */}
            <td className="px-4 py-3 lg:px-6 lg:py-[26px] block lg:table-cell w-full lg:w-fit text-sm text-grey-700">
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
                                {items.bookingStatus !== BookingStatus.CONFIRMED &&
                                    (
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
            </td>
        </tr>
    );
};

export default BookingRow;
