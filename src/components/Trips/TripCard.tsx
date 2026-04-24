import cn from "classnames";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { formatNumberWithCommas, keyAndValueInAChip } from "@/utils/functions";
import { HostTripItem } from "@/types";
import { VehicleListingBadge, BookingBadge, Popup, VerticalDivider, Chip, Icons } from "@/ui";
import { sedan } from "@/ui/assets";
import { BookingBadgeStatus } from "@/types";

type TripCardProps = { content: HostTripItem };

export default function TripCard({ content: trip }: TripCardProps) {
    const tripDetails = [
        { "Trip ID": trip.bookingId || "N/A" },
        { "Customer": trip.driverName || "N/A" },
        { "Start Date": trip.startDateTime ? format(new Date(trip.startDateTime), "MMM dd, yyyy HH:mm") : "N/A" },
        { "End Date": trip.endDateTime ? format(new Date(trip.endDateTime), "MMM dd, yyyy HH:mm") : "N/A" },
        { "Pickup": trip.pickupLocation || trip.city || "N/A" }
    ];

    return (
        <div className="flex flex-col md:flex-row items-center gap-5 px-3 md:px-0 py-5 rounded-3xl bg-grey-75 md:bg-transparent md:border-b md:border-grey-200 last:border-none relative">
            <div className="h-[200px] w-full md:w-[200px]">
                <Image
                    src={sedan} // Ideally replace with actual vehicle image from trip if available
                    alt="Vehicle"
                    width={200}
                    height={200}
                    className="h-full w-full rounded-2xl object-cover"
                />
            </div>
            <div className="w-full md:w-[calc(100%-220px)] flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-grey-800">
                <div className="space-y-[14px] md:max-w-[500px] 3xl:max-w-[550px]">
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-6">
                        <h5 className="text-h6 3xl:text-h5 !font-medium">
                            {trip.vehicleName || trip.vehicleIdentifier || "Vehicle"}
                        </h5>
                        <div className="flex items-center gap-2">
                            <VehicleListingBadge status={trip.tripStatus as any} />
                            <BookingBadge status={trip.bookingStatus as BookingBadgeStatus} />
                        </div>
                    </div>
                    
                    <p className="text-base 3xl:text-xl !font-medium text-grey-700 md:text-primary-500">
                        NGN {formatNumberWithCommas(trip.totalPrice ?? 0)}
                    </p>
                    
                    <p className="uppercase text-xs !font-semibold hidden md:block">
                        Trip Details
                    </p>
                    
                    <div className="hidden md:flex flex-wrap gap-3">
                        {tripDetails?.map((detail, index) => {
                            const [key, value] = Object.entries(detail)[0];
                            return (
                                <Chip
                                    key={index}
                                    text={keyAndValueInAChip(key, value)}
                                    variant="filled"
                                    radius="sm"
                                    color="lighter"
                                />
                            );
                        })}
                    </div>
                </div>

                <VerticalDivider className="hidden md:block" />
                <Popup
                    trigger={
                        <button
                            className={
                                "block border border-grey-200 bg-white text-black rounded-lg p-2 w-fit absolute right-6 top-7 md:relative md:top-0 md:right-0"
                            }
                        >
                            {Icons.ic_more}
                        </button>
                    }
                    content={
                        <>
                            <p className="!text-xs 3xl:!text-base text-grey-700 !font-bold">
                                Actions
                            </p>
                            <ul className="space-y-2 *:py-2">
                                <li className="!text-xs 3xl:!text-base">
                                    <Link href={`/bookings/${trip.id}`}>
                                        View Booking Details
                                    </Link>
                                </li>
                            </ul>
                        </>
                    }
                />
            </div>
        </div>
    );
}
