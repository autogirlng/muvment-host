import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import Image from "next/image";
import cn from "classnames";
import { useState } from "react";
import { Chip, Button, BlurredDialog } from "@/ui";
import { addSpaceBeforeUppercase } from "@/utils/functions";
import { VehicleInformationStepper } from "@/types";

type ViewAsCustomerProps = { vehicleInfo?: VehicleInformationStepper };

export default function ViewAsCustomer({ vehicleInfo }: ViewAsCustomerProps) {

    const [openCancellationModal, setOpenCancellationModal] = useState(false);

    const handleOpenCancellationModal = () => {
        setOpenCancellationModal((prev) => !prev); // Use functional update for state
    };

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



                <div className="flex flex-col md:flex-row items-start gap-10 ">
                    <div className="w-full md:w-[62%] space-y-10">

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

                        <div className="space-y-5">
                            <SectionTitle text="Others" className="text-black" />
                            <p className="text-xs md:text-base 3xl:text-xl max-w-[535px]">
                                Max Trip Duration: {vehicleInfo?.maxTripDurationValue} days <br></br>
                                Advanced Notice: {vehicleInfo?.advanceNoticeValue} days <br></br>
                                Providing Driver: {vehicleInfo?.willProvideDriver ? "Yes" : "No"} <br></br>
                                Providing at least 20 litres of Fuel: {vehicleInfo?.willProvideFuel ? "Yes" : "No"} <br></br>
                            </p>

                        </div>

                    </div>


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