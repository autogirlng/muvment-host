import { bookingAnalyticsTableHeadItems } from "@/utils/data";
import { BookingInformation } from "@/types";
import TableHead from "@/components/Table/TableHead";
import EmptyState from "@/components/EmptyState";
import BookingDesktopRow from "@/components/Bookings/BookingDesktopRow";
import BookingMobileRow from "@/components/Bookings/BookingMobileRow";

export default function BookingAnalyticsTable({
    items,
    emptyStateMessage,
    emptyStateTitle,
}: {
    items: BookingInformation[];
    emptyStateMessage: string;
    emptyStateTitle?: string;
}) {
    return items.length > 0 ? (
        <div className="overflow-auto">
            <table className="hidden md:block w-full min-w-full divide-y divide-grey-200 border-t border-grey-200 bg-white md:mt-7">
                <TableHead tableHeadItems={bookingAnalyticsTableHeadItems} />
                <tbody className="divide-y divide-grey-200 ">
                    {items?.map((item, index) => (
                        <BookingDesktopRow key={index} items={item} />
                    ))}
                </tbody>
            </table>
            <div className="block md:hidden border border-grey-200 rounded-xl px-8 py-6">
                {items?.map((item, index) => (
                    <BookingMobileRow key={index} items={item} />
                ))}
            </div>
        </div>
    ) : (
        <EmptyState
            title={emptyStateTitle || "No Data Yet"}
            message={emptyStateMessage}
            image="/icons/empty_booking_state.png"
        />
    );
}
