import Link from "next/link";
import { BookingSegmentContent } from "@/types";
import { Popup, MoreButton } from "@/ui";
import { TableCell, TableRow } from "@/components/Table";
import { getBookingDisplayId } from "@/utils/displayIds";

function formatDurationLabel(duration: string | undefined): string {
    if (duration == null || duration === "") return "";
    const s = String(duration).trim();
    if (/day/i.test(s)) return s;
    return `${s} days`;
}

function BookingActionsMenu({ items }: { items: BookingSegmentContent }) {
    return (
        <Popup
            trigger={<MoreButton className="!mx-0" />}
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
    );
}

const BookingRow = ({ items }: { items: BookingSegmentContent }) => {
    return (
        <TableRow>
            <td className="order-first mb-2 flex w-full justify-end border-0 px-0 py-0 lg:hidden">
                <BookingActionsMenu items={items} />
            </td>
            <TableCell title="Vehicle" content={items?.vehicleName} />
            <TableCell
                title="Invoice Number"
                content={getBookingDisplayId(items)}
            />
            <TableCell title="Booking Type" content={items?.bookingCategory} />
            <TableCell title="Duration" content={formatDurationLabel(items?.duration)} />
            <TableCell title="Status" content={items?.bookingStatus} isBadge type="booking" />
            <td className="hidden px-5 py-4 lg:table-cell lg:w-fit">
                <BookingActionsMenu items={items} />
            </td>
        </TableRow>
    );
};

export default BookingRow;
