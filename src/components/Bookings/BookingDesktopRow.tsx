import Link from "next/link";
import { BookingSegmentContent } from "@/types";
import { Popup, MoreButton } from "@/ui";
import { TableCell, TableRow } from "@/components/Table";
import { getBookingDisplayId } from "@/utils/displayIds";
import { formatNgnAmount } from "@/utils/formatters";

function formatDurationLabel(duration: string | undefined): string {
  if (duration == null || duration === "") return "";
  const s = String(duration).trim();
  if (/day/i.test(s)) return s;
  return `${s} days`;
}

const BookingDesktopRow = ({ items }: { items: BookingSegmentContent }) => {
  return (
    <TableRow className="lg:hover:bg-grey-50/80">
      <TableCell
        content={items?.customerName}
        className="!font-semibold !text-grey-900"
      />
      <TableCell
        content={getBookingDisplayId(items)}
        className="!text-grey-600"
      />
      <TableCell content={items?.bookingCategory} className="!text-grey-600" />
      <TableCell
        content={formatDurationLabel(items?.duration)}
        className="!text-grey-600"
      />
      <TableCell content={items?.vehicleName} className="!text-grey-600" />
      <TableCell content="" className="!text-grey-600" />
      <TableCell content="" className="!text-grey-600" />
      <TableCell content={items?.bookingStatus} isBadge type="booking" />
      <TableCell
        content={`NGN ${formatNgnAmount(Number(items?.price) || 0)}`}
        className="!text-grey-600"
      />
      <td className="px-5 py-4">
        <Popup
          trigger={<MoreButton />}
          content={
            <>
              <p className="!text-xs !font-semibold 3xl:!text-base">Actions</p>
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
      </td>
    </TableRow>
  );
};

export default BookingDesktopRow;
