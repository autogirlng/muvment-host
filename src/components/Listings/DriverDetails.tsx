import { AvatarInitials, FullPageSpinner, BlurredDialog, Button } from "@/ui";
import { getInitialsFromName } from "@/utils/functions";
import AssignDriverForm from "@/components/Listings/modals/AssignDriverForm";
import useListingDrivers from "@/hooks/listings/useListingDrivers";
import { DriverDetailsProps } from "./props";
import { DriverContent } from "@/types";

export default function DriversDetails({ id }: DriverDetailsProps) {
    const { isLoading, assignNewDriver, openModal, handleModal, drivers } = useListingDrivers(id);

    if (isLoading) {
        return <FullPageSpinner />;
    }

    return (
        <div className="space-y-10">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-5">
                <h5 className="text-h6 3xl:text-h5 !font-semibold text-black">
                    Drivers
                </h5>
                <BlurredDialog
                    open={openModal}
                    onOpenChange={handleModal}
                    title="Assign New Driver"
                    trigger={
                        <Button className="!text-xs 3xl:!text-base text-primary-500 !bg-primary-75 rounded-[31px] !py-1.5 3xl:!py-2 !px-3 3xl:!px-4">
                            Add New Driver
                        </Button>
                    }
                    content={
                        <AssignDriverForm
                            handleModal={handleModal}
                            assignNewDriver={(values) => assignNewDriver.mutate(values)}
                            isPending={assignNewDriver.isPending}
                            vehicleId={id}
                        />
                    }
                />
            </div>
            {
            drivers && drivers.data.content.length >= 0 && drivers?.data.content.map((driver, index) => (
                <DriverCard key={index} driver={driver} />
            ))
            }


        </div>
    );
}

const DriverCard = ({ driver }: { driver: DriverContent }) => {
    return (
        <div className="p-6 bg-grey-90 rounded-[32px] flex gap-3 items-center">
            <AvatarInitials
                initials={getInitialsFromName(driver.fullName.split(" ")[0], driver.fullName.split(" ")[1])}
            />
            <div className="space-y-[2px]">
                <p className="text-grey-500 text-xs 3xl:text-sm">
                    ID {driver.driverIdentifier} 
                </p>
                <p className="text-grey-700 text-sm 3xl:text-base">
                    {driver.fullName}
                </p>
                <p className="text-primary-500 text-xs 3xl:text-sm">
                    {driver.phoneNumber}
                </p>
            </div>
        </div>
    );
};
