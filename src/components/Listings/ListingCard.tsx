import cn from "classnames";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { formatNumberWithCommas, keyAndValueInAChip } from "@/utils/functions";
import { MappedInformation, VehicleInformation, HostVehicleListingContent, VehicleStatus } from "@/types";
import { VehicleListingBadge, Popup, VerticalDivider, Chip, Icons, BlurredDialog } from "@/ui";
import DeleteListing from "@/components/Listings/modals/DeleteListing";
import { sedan } from "@/ui/assets";

type ListingCardProps = { content: HostVehicleListingContent };

const initialExtras = [
    { name: "Fuel Included", icon: Icons.ic_fuel_station, id: "fuelProvided" },
    {
        name: "Driver Available",
        icon: Icons.ic_driver_provided,
        id: "provideDriver",
    },
];

export default function ListingCard(listing: ListingCardProps) {
    const [vehicleDetails, setVehicleDetails] = useState<MappedInformation[]>([]);
    const [extras, setExtras] = useState(initialExtras);
    const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);

    const handleDeleteModal = () => {
        setOpenDeleteModal(!openDeleteModal);
    };

    useEffect(() => {
        if (listing) {
            const mappedVehicleDetails: MappedInformation[] = [
                { LicensePlateNumber: listing?.content.licensePlateNumber || "N/A" },

            ];

            setVehicleDetails(mappedVehicleDetails);

            const updatedExtras = extras.map((extra) => {
                if (extra.id === "fuelProvided") {
                    return {
                        ...extra,
                        // status: listing?.tripSettings?.fuelProvided || false,
                    };
                } else if (extra.id === "provideDriver") {
                    return {
                        ...extra,
                        // status: listing?.tripSettings?.provideDriver || false,
                    };
                }
                return extra;
            });

            setExtras(updatedExtras);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [listing]);
    return (
        <div className="flex flex-col md:flex-row items-center gap-5 px-3 md:px-0 py-5 rounded-3xl bg-grey-75 md:bg-transparent md:border-b md:border-grey-200 last:border-none relative">


            <div className="h-[200px] w-full md:w-[200px]">
                <Image
                    src={sedan}
                    alt=""
                    width={200}
                    height={200}
                    className={cn(
                        "h-full w-full rounded-2xl",

                        // listing?.VehicleImage?.frontView ? "object-cover" : "object-contain"
                        "object-contain"
                    )}
                />
            </div>
            <div className="w-full md:w-[calc(100%-220px)] flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-grey-800">
                <div className="space-y-[14px] md:max-w-[400px] 3xl:max-w-[450px]">
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-6">
                        <h5 className="text-h6 3xl:text-h5 !font-medium">

                            {
                                listing?.content.status === VehicleStatus.DRAFT
                                    ? "Unfinished Listing"
                                    : listing?.content.name}
                        </h5>
                        <VehicleListingBadge status={
                            listing?.content.status} />
                    </div>
                    {/* {listing?.content.status !== VehicleReviewStatus.DRAFT && (
                        <p className="text-base 3xl:text-xl !font-medium text-grey-700 md:text-primary-500">
                            NGN {formatNumberWithCommas(listing?.pricing?.dailyRate?.value)}
                            /day
                        </p>
                    )} */}
                    <p className="uppercase text-xs !font-semibold hidden md:block">
                        Vehicle details
                    </p>
                    {listing?.content.status === VehicleStatus.DRAFT ? (
                        <Link
                            href={`/vehicle-onboarding`}
                            className="text-sm 3xl:text-base text-primary-500 block"
                        >
                            Complete Vehicle Listing
                        </Link>
                    ) : (
                        <div className="hidden md:flex flex-wrap gap-3">
                            {vehicleDetails?.map((detail, index) => {
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
                    )}
                </div>

                {
                    // listing?.vehicleStatus !== "draft" && (
                    //     <>
                    //         <VerticalDivider className="hidden md:block" />

                    //         <div className="space-y-[14px] md:max-w-[400px] 3xl:max-w-[450px]">
                    //             <p className="uppercase text-xs !font-semibold hidden md:block">
                    //                 Extras
                    //             </p>
                    //             <div className="flex flex-wrap gap-3">
                    //                 {extras.map((detail: any, index: number) => {
                    //                     return (
                    //                         detail.status && <Chip
                    //                             key={index}
                    //                             icon={detail.icon}
                    //                             text={detail.name}
                    //                             variant="filled"
                    //                             radius="sm"
                    //                             color={"primary"}
                    //                         />
                    //                     );
                    //                 })}
                    //             </div>
                    //         </div>
                    //     </>
                    // )
                }

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
                                    {
                                        listing?.content.status === VehicleStatus.DRAFT ? (
                                            <BlurredDialog
                                                open={openDeleteModal}
                                                onOpenChange={handleDeleteModal}
                                                trigger={
                                                    <button className="!text-xs 3xl:!text-base hover:text-error-500">
                                                        Delete listing
                                                    </button>
                                                }
                                                content={
                                                    <DeleteListing
                                                        handleModal={handleDeleteModal}
                                                        id={listing?.content.id}
                                                        isDraft
                                                    />
                                                }
                                            />
                                        ) : (
                                            <Link href={`/listings/${listing?.content.id}`}>
                                                View Vehicle Details
                                            </Link>
                                        )
                                    }
                                </li>
                            </ul>
                        </>
                    }
                />
            </div>
        </div>
    )
}