import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import Image from "next/image";
import cn from "classnames";
import { useState } from "react";
import { Chip, Icons, Button, BlurredDialog } from "@/ui";
import {
    addSpaceBeforeUppercase,
    formatNumberWithCommas,
    keyAndValueInAChip,
} from "@/utils/functions";
import useVehicleSummary from "@/hooks/vehicle/useVehicleSummary";
import { VehicleInformation, VehicleInformationStepper } from "@/types";

type Props = { vehicle: VehicleInformation | null, vehicleInfo?: VehicleInformationStepper };

export default function ViewAsCustomer({ vehicle, vehicleInfo }: Props) {
    const { perks, vehicleDetails, vehicleImages } = useVehicleSummary({
        vehicle,
    });

    const [openCancellationModal, setOpenCancellationModal] = useState(false);

    const handleOpenCancellationModal = () => {
        setOpenCancellationModal((prev) => !prev); // Use functional update for state
    };

    console.log(vehicleInfo)
    return (
        <>
            <div className="space-y-11">
                <div className="space-y-6 md:space-y-8">
                    {/* Slider */}
                    <Swiper
                        pagination={{
                            type: "fraction",
                        }}
                        navigation={true}
                        modules={[Pagination, Navigation, Autoplay]}
                        autoplay={{
                            delay: 5000,
                            pauseOnMouseEnter: true,
                        }}
                        loop={true}
                        className="vehicle-summary-swiper"
                    >
                        {vehicleInfo?.photos.map((image, index) => (
                            <SwiperSlide key={index}>
                                <Image
                                    src={image.cloudinaryUrl}
                                    alt={`Vehicle image ${index + 1}`} // Add more descriptive alt text
                                    width={1120}
                                    height={460}
                                    className="w-full h-[218px] md:h-[460px] rounded-[42px] object-cover"
                                />
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    {/* Name of car */}
                    <h2 className="text-h5 md:text-h3 3xl:text-4xl">
                        {vehicleInfo?.name ?? ""}
                    </h2>

                    {/* Car preview */}
                    <div className="flex items-center gap-1 md:gap-7 3xl:gap-[41px]">
                        {vehicleInfo?.photos.map((image, index) => (
                            <Image
                                key={index}
                                src={image.cloudinaryUrl}
                                alt={`Thumbnail image ${index + 1}`} // Add more descriptive alt text
                                width={152}
                                height={90}
                                className="w-full h-[44px] sm:h-[90px] rounded-lg sm:rounded-[18px] object-cover"
                            />
                        ))}
                    </div>
                </div>

                {/* Advance Notice */}
                <div className="bg-grey-75 p-3 flex gap-3 items-center rounded-[18px]">
                    {/* <div className="bg-warning-75 border border-warning-400 text-warning-400 h-[50px] w-[50px] flex justify-center items-center rounded-xl">
                        {Icons.ic_notification}
                    </div>
                    <h6 className="text-grey-700 text-xs md:text-base 3xl:text-h6 !font-medium">
                        {vehicle?.tripSettings.advanceNotice} advance notice required before
                        booking
                    </h6> */}
                    {/* <SectionTitle text="" /> - This component was here but 'text' prop was empty. Removed if not needed. */}
                </div>

                <div className="flex flex-col md:flex-row items-start gap-10 ">
                    <div className="w-full md:w-[62%] space-y-10">
                        {/* Vehicle Details */}
                        {/* <div className="space-y-5">
                            <SectionTitle text="Vehicle Details" />
                            <div className="flex flex-wrap gap-3">
                                {vehicleDetails.map((detail, index) => {
                                    const [key, value] = Object.entries(detail)[0];
                                    return (
                                        <Chip
                                            key={index}
                                            text={keyAndValueInAChip(key, value)}
                                            variant="filled"
                                            radius="sm"
                                            color="dark"
                                        />
                                    );
                                })}
                            </div>
                        </div> */}

                        {/* Vehicle Description */}

                        <div className="space-y-5">
                            <SectionTitle text="Description" className="text-black" />
                            <p className="text-xs md:text-base 3xl:text-xl max-w-[535px]">
                                {vehicleInfo?.description}
                            </p>
                        </div>

                        {/* Vehicle Features */}
                        <div className="space-y-5">
                            <SectionTitle text="Features" />
                            <div className="flex flex-wrap gap-3">
                                {vehicleInfo?.features.map((feature, index) => (
                                    <Chip
                                        key={index}
                                        text={addSpaceBeforeUppercase(feature.name)}
                                        variant="outlined"
                                        radius="md"
                                        color="light"
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="space-y-5">
                            <SectionTitle text="Supported Booking Types" />
                            <div className="flex flex-wrap gap-3">
                                {vehicleInfo?.supportedBookingTypes.map((type, index) => (
                                    <Chip
                                        key={index}
                                        text={addSpaceBeforeUppercase(type.name)}
                                        variant="outlined"
                                        radius="md"
                                        color="light"
                                    />
                                ))}
                            </div>
                        </div>
                        <div className="space-y-5">
                            <SectionTitle text="Address" className="text-black" />
                            <p className="text-xs md:text-base 3xl:text-xl max-w-[535px]">
                                {String(vehicleInfo?.address ?? "")}

                            </p>
                        </div>

                        <div className="space-y-5">
                            <SectionTitle text="Number Of Seats" className="text-black" />
                            <p className="text-xs md:text-base 3xl:text-xl max-w-[535px]">
                                {String(vehicleInfo?.numberOfSeats ?? "")}
                            </p>
                        </div>

                        <div className="space-y-5">
                            <SectionTitle text="License Plate Number" className="text-black" />
                            <p className="text-xs md:text-base 3xl:text-xl max-w-[535px]">
                                {String(vehicleInfo?.licensePlateNumber ?? "")}

                            </p>

                        </div>


                        <div className="space-y-5">
                            <SectionTitle text="Advanced Notice" className="text-black" />
                            <p className="text-xs md:text-base 3xl:text-xl max-w-[535px]">
                                {String(vehicleInfo?.advanceNoticeValue ?? "")}

                            </p>

                        </div>
                        {/* Vehicle Perks */}
                        {/* <div className="space-y-5">
                            <SectionTitle text="Perks" />
                            <div className="flex flex-wrap gap-3">
                                {perks.map(
                                    (perk, index) =>
                                        perk.status && (
                                            <Chip
                                                key={index}
                                                text={perk.name}
                                                icon={perk.icon}
                                                variant="outlined"
                                                radius="md"
                                                color="light"
                                            />
                                        )
                                )}
                                <button
                                    onClick={handleOpenCancellationModal}
                                    className="block w-full text-primary-500 text-base 3xl:text-xl hover:underline cursor-pointer bg-transparent border-none p-0 text-left"
                                >
                                    Learn more about our free cancellation
                                </button>
                            </div>
                        </div> */}




                        <div className="space-y-5">
                            <SectionTitle text="Others" className="text-black" />
                            <p className="text-xs md:text-base 3xl:text-xl max-w-[535px]">
                                Max Trip Duration: {vehicleInfo?.maxTripDurationValue} days <br></br>
                                Advanced Notice: {vehicleInfo?.advanceNoticeValue} days <br></br>
                                Providing Driver: {vehicleInfo?.willProvideDriver ? "Yes" : "No"} <br></br>
                                Providing at least 20 litres of Fuel: {vehicleInfo?.willProvideFuel ? "Yes" : "No"} <br></br>
                            </p>

                        </div>
                        {/* Outskirt Locations */}
                        {/* <div className="space-y-5">
                            <SectionTitle text="Outskirt Locations" />
                            <div className="flex flex-wrap gap-y-8 gap-x-[18px]">
                                {vehicle?.outskirtsLocation?.map((location, index) => (
                                    <p
                                        key={index}
                                        className="text-sm md:text-base 3xl:text-xl !font-medium text-black flex items-center gap-[14px] w-[170px]"
                                    >
                                        {Icons.ic_location}
                                        <span>{location}</span>
                                    </p>
                                ))}
                            </div>
                        </div> */}
                    </div>

                    {/* Pricing */}
                    {/* <div className="w-full md:w-[38%] md:border md:border-grey-200 md:rounded-[42px]">
                        <div className="md:p-8 divide-y divide-grey-200 text-grey-800 !font-medium text-base 3xl:text-xl">
                            <h4 className="text-h5 3xl:text-h4 !font-medium pb-[22px]">
                                Pricing
                            </h4>
                            <div className="py-[22px] flex divide-x divide-grey-200">
                                <div className="pr-6">
                                    <PricingTitle text="Daily (12 hrs)" />
                                    <PricingDescription
                                        text={`NGN ${formatNumberWithCommas(vehicle?.pricing?.dailyRate?.value || "")}/day`}
                                    />
                                </div>
                                <div className="pl-6">
                                    <PricingTitle text="Extra Hours" />
                                    <PricingDescription
                                        text={`NGN ${formatNumberWithCommas(vehicle?.pricing?.extraHoursFee || "")}/hr`}
                                    />
                                </div>
                            </div>
                            <div className="py-[22px]">
                                <PricingTitle text="Trip Duration" />
                                <PricingDescription
                                    text={`Min: 1 day | Max: ${vehicle?.tripSettings?.maxTripDuration}`}
                                />
                            </div>
                            {vehicle?.pricing?.discounts &&
                                vehicle?.pricing?.discounts?.length > 0 && (
                                    <div className="py-[22px] space-y-2">
                                        <PricingTitle text="Discounts" />
                                        {vehicle.pricing.discounts.map((discount, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center justify-between gap-2 max-w-[150px] md:max-w-[210px] bg-grey-75 border border-grey-300 p-2 rounded-lg text-sm md:text-xl md:text-h6"
                                            >
                                                <p>{discount?.durationInDays}+ days</p>
                                                <p className="text-success-500">
                                                    {discount.percentage || 0}% off
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            {vehicle?.pricing?.airportPickupFee && (
                                <div className="py-[22px]">
                                    <PricingTitle text="Airport Pickups & dropoffs" />
                                    <PricingDescription
                                        text={`NGN ${formatNumberWithCommas(vehicle?.pricing?.airportPickupFee || "")}/hr`}
                                    />
                                </div>
                            )}
                        </div>
                    </div> */}
                </div>
            </div>

            {/* Cancellation Policy Modal */}
            <BlurredDialog
                open={openCancellationModal}
                onOpenChange={handleOpenCancellationModal}
                trigger={<button className="hidden" />}
                title={
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="text-red-500"
                            >
                                <path
                                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
                                    fill="currentColor"
                                />
                            </svg>
                        </div>
                        <p className="text-xl font-semibold text-gray-900">
                            Understand Our Cancellation & Refund Policy
                        </p>
                    </div>
                }
                content={<CancellationPolicyModal onClose={() => setOpenCancellationModal(false)} />}
            />
        </>
    );
}

type CancellationPolicyModalProps = {
    onClose: () => void;
};

const CancellationPolicyModal = ({ onClose }: CancellationPolicyModalProps) => {
    return (
        <div className="space-y-6 py-4">
            {/* Modal Title and Introduction */}
            <div>
                <h2 className="font-bold text-gray-900 text-lg mb-2">
                    Understand Our Cancellation & Refund Policy
                </h2>
                <p className="text-gray-600 text-sm">
                    A cancellation fee is a charge applied when a customer cancels a confirmed booking, especially close to the scheduled start time. At Muvment, our cancellation policy is designed to protect both hosts and
                    **customer&apos;s** by ensuring fairness, transparency, and accountability.
                </p>
            </div>

            {/* Cancellation Notice Period */}
            <div className="space-y-2">
                <h3 className="font-semibold text-gray-900 text-base">
                    Cancellation Notice Period
                </h3>
                <p className="text-gray-600 text-sm">
                    <span className="font-medium text-gray-800">
                        More than 72 hours before the booking start time:
                    </span>
                    <br />
                    The customer forfeits 50% of the total booking fee. The remaining 50% will be refunded or can be converted into booking credit for future use.
                </p>
                <p className="text-gray-600 text-sm">
                    <span className="font-medium text-gray-800">
                        Less than 72 hours before the booking start time:
                    </span>
                    <br />
                    No refund will be issued. The full booking amount is retained by the host.
                </p>
            </div>

            {/* Peak Period Bookings (e.g., December) */}
            <div className="space-y-2">
                <h3 className="font-semibold text-gray-900 text-base">
                    Peak Period Bookings (e.g., December)
                </h3>
                <p className="text-gray-600 text-sm">
                    All bookings during festive and high-demand periods are considered final. These are **non-cancellable** and **non-refundable**. Customers should ensure their travel plans are confirmed before booking during such periods.
                </p>
            </div>

            {/* Faulty Vehicle Reporting */}
            <div className="space-y-2">
                <h3 className="font-semibold text-gray-900 text-base">
                    Faulty Vehicle Reporting
                </h3>
                <p className="text-gray-600 text-sm">
                    If you discover a mechanical or safety issue with the vehicle, it must be reported to Muvment within **1 hour of starting the trip**. If verified, you may be eligible for a full or partial refund.
                </p>
            </div>

            {/* Cancellation Process */}
            <div className="space-y-2">
                <h3 className="font-semibold text-gray-900 text-base">
                    Cancellation Process
                </h3>
                <p className="text-gray-600 text-sm">
                    All cancellations must be submitted **before the trip start time** through Muvment customer support. You are required to state the reason for cancellation. If a cancellation isn&apos;t communicated properly via approved channels, the booking is considered active and will proceed as planned.
                </p>
            </div>

            {/* Additional Terms */}
            <div className="space-y-2">
                <h3 className="font-semibold text-gray-900 text-base">
                    Additional Terms
                </h3>
                <p className="text-gray-600 text-sm">
                    Muvment reserves the right to review all cancellation and refund requests on a case-by-case basis. Hosts are notified immediately when a cancellation request is submitted. Incomplete vehicle information, non-responsiveness, or misleading details from the host may also qualify for trip cancellation or refund to the customer.
                </p>
            </div>

            {/* Need More Support? */}
            <div className="space-y-2">
                <h3 className="font-semibold text-gray-900 text-base">
                    Need More Support?
                </h3>
                <p className="text-gray-600 text-sm">
                    Feel free to reach out to the Muvment team anytime—**we&apos;re** here to assist!
                </p>
            </div>

            {/* Action Button */}
            <div className="pt-4">
                <Button
                    color="primary"
                    rounded="full"
                    fullWidth
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={onClose}
                >
                    Okay, Got it 👍
                </Button>
            </div>
        </div>
    );
};

const SectionBlock = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="mb-2">
        <h3 className="font-semibold text-gray-900 text-base md:text-lg mb-1 flex items-center gap-2">
            <span className="inline-block w-1.5 h-4 bg-blue-500 rounded-sm mr-2" />
            {title}
        </h3>
        {children}
    </div>
);

const SectionTitle = ({
    text,
    className,
}: {
    text: string;
    className?: string;
}) => (
    <h6
        className={cn("text-grey-700 text-xl 3xl:text-h6 !font-medium", className)}
    >
        {text}
    </h6>
);

const PricingTitle = ({
    text,
    className,
}: {
    text: string;
    className?: string;
}) => (
    <p className={cn("text-xs md:text-base 3xl:text-xl", className)}>{text}</p>
);

const PricingDescription = ({
    text,
    className,
}: {
    text: string;
    className?: string;
}) => (
    <p className={cn("text-sm md:text-xl 3xl:text-h6 !font-medium", className)}>
        {text}
    </p>
);