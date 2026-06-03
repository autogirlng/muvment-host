import Link from "next/link";
import { useState } from "react";
import { VehicleListingBadge, BlurredDialog, Popup, Icons } from "@/ui";
import BackLink from "@/components/BackLink";
import DeleteListing from "@/components/Listings/modals/DeleteListing";
import DeactivateListing from "@/components/Listings/modals/DeactivateListing";
import VehicleUnavailability from "@/components/Listings/VehicleUnavailability";
import { ListingDetailHeaderProps } from "./props";


export default function ListingDetailsHeader({ name, status, id }: ListingDetailHeaderProps) {
    const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
    const [openDeactivateModal, setOpenDeactivateModal] = useState<boolean>(false);
    const [openUnavailabilityModal, setOpenUnavailabilityModal] = useState<boolean>(false);

    return (
        <div className="space-y-5">
            <div className="flex justify-between gap-2">
                <BackLink backLink="/listings" />
                <div className="flex items-center gap-3">
                    <div className="flex lg:hidden items-center justify-center w-10 h-10 rounded-full bg-primary-50 text-primary-500 ">
                        {Icons.ic_calendar}
                    </div>
                    <Popup
                        trigger={
                            <button
                                className={
                                    "block border border-grey-200 bg-white text-black rounded-lg p-2 w-fit"
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
                                    <li>
                                        <Link
                                            href={`/vehicle-onboarding?id=${id}`}
                                            className="!text-xs 3xl:!text-base"
                                        >
                                            Edit listing
                                        </Link>
                                    </li>
                                    <li>
                                        <BlurredDialog
                                            open={openDeleteModal}
                                            onOpenChange={setOpenDeleteModal}
                                            trigger={
                                                <button className="!text-xs 3xl:!text-base hover:text-error-500">
                                                    Delete listing
                                                </button>
                                            }
                                            content={
                                                <DeleteListing
                                                    handleModal={() => setOpenDeleteModal(false)}
                                                    id={id}
                                                />
                                            }
                                        />
                                    </li>
                                    <li>
                                        <BlurredDialog
                                            open={openDeactivateModal}
                                            onOpenChange={setOpenDeactivateModal}
                                            trigger={
                                                <button className="!text-xs 3xl:!text-base hover:text-primary-500">
                                                    Deactivate listing
                                                </button>
                                            }
                                            content={
                                                <DeactivateListing
                                                    handleModal={() => setOpenDeactivateModal(false)}
                                                    id={id}
                                                />
                                            }
                                        />
                                    </li>
                                    <li>
                                        <button
                                            onClick={() => setOpenUnavailabilityModal(true)}
                                            className="!text-xs 3xl:!text-base hover:text-primary-500 text-left w-full"
                                        >
                                            Manage Unavailability
                                        </button>
                                    </li>
                                    <li>
                                        <Link
                                            href={`/listings/view-as-customer/${id}`}
                                            className="!text-xs 3xl:!text-base"
                                        >
                                            View as customer
                                        </Link>
                                    </li>
                                </ul>
                            </>
                        }
                    />
                </div>
            </div>

            <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-6">
                <h5 className="text-h6 sm:text-4xl 3xl:text-h2 !font-bold text-left">
                    {name || ""}
                </h5>
                <VehicleListingBadge status={status} />
            </div>

            <BlurredDialog
                open={openUnavailabilityModal}
                onOpenChange={setOpenUnavailabilityModal}
                title="Manage Unavailability"
                width="max-w-[540px]"
                content={<VehicleUnavailability vehicleId={id || ""} />}
            />
        </div>
    );
}
