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

const BookingDesktopRow = ({ items }: { items: BookingSegmentContent }) => {
  const {
    openAcceptModal,
    handleAcceptModal,
    acceptBooking,
    openDeclineModal,
    handleDeclineModal,
    declineBooking,
  } = useBookingActions({ id: items.bookingId });

  return (
    <tr className="hover:bg-grey-50">
      <TableCell
        content={items?.customerName}
        className="!font-semibold !text-grey-900"
      />
      <TableCell content={items?.bookingId} className="!text-grey-600" />
      <TableCell content={items?.bookingCategory} className="!text-grey-600" />
      <TableCell
        content={formatDurationLabel(items?.duration)}
        className="!text-grey-600"
      />
      <TableCell content={items?.vehicleName} className="!text-grey-600" />
      <TableCell content="" className="!text-grey-600" />
      <TableCell content="" className="!text-grey-600" />
      <TableCell content={items?.bookingStatus} isBadge type="booking" />
      <TableCell content={`NGN ${items?.price}`} className="!text-grey-600" />
      <td className="px-6 py-[26px]">
        <Popup
          trigger={
            <button className="mx-auto block w-fit rounded-lg border border-grey-200 bg-white p-2 text-black">
              {Icons.ic_more}
            </button>
          }
          content={
            <>
              <p className="!text-xs !font-semibold 3xl:!text-base">Actions</p>
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
      </td>
    </tr>
  );
};

export default BookingDesktopRow;
