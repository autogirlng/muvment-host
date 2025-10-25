import { keyAndValueInAChip } from "@/utils/functions";
import { Chip } from "@/ui";
import { ListingDetailsVehicleDetailsProps } from "./props";



export default function ListingDetailsVehicleDetails({
    vehicleDetails,
    extras,
}: ListingDetailsVehicleDetailsProps) {
    return (
        <div className="space-y-7">
            <p className="text-base 3xl:text-xl text-grey-700 font-medium">
                Vehicle Details
            </p>
            <div className="flex flex-wrap gap-3">
                {vehicleDetails?.map((detail, index) => {
                    const [key, value] = Object.entries(detail)[0];
                    return (
                        <Chip
                            key={index}
                            text={keyAndValueInAChip(key, value)}
                            variant="filled"
                            radius="sm"
                            color="light"
                        />
                    );
                })}
                {extras.map(
                    (detail: any, index: number) =>
                        detail.status && (
                            <Chip
                                key={index}
                                icon={detail.icon}
                                text={detail.name}
                                variant="filled"
                                radius="sm"
                                color="primary"
                            />
                        )
                )}
            </div>
        </div>
    );
}
