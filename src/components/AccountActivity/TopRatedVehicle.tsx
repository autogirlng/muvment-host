import cn from "classnames";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Spinner } from "@/ui";
import { TopRatedVehicleProps } from "./props";


const Tag = ({ value, title }: { value: string; title: string }) => (
    <p className="bg-primary-50 rounded-lg py-2 px-3 text-2xs 2xl:text-xs text-grey-500">
        {title} <span className="text-xs 2xl:text-sm text-grey-800">{value}</span>
    </p>
);

export default function TopRatedVehicle({ topRatedVehicle, isLoading }: TopRatedVehicleProps) {
    return (
        <div className="rounded-xl px-4 py-6 space-y-4 bg-white border border-grey-200 text-grey-500 min-h-[250px]">
            <div className="flex gap-4 2xl:gap-0">
                <div
                    className={cn(
                        "space-y-4",
                        Object.keys(topRatedVehicle || {}).length > 0 ? "w-7/12" : ""
                    )}
                >
                    <p className="text-xs 2xl:text-sm">Top Rated Vehicle</p>
                    {isLoading ? (
                        <Spinner />
                    ) : Object.keys(topRatedVehicle || {}).length > 0 ? (
                        <div className="space-y-10">
                            <h6 className="text-grey-800 text-xl 2xl:text-h6 font-medium">
                                {`${topRatedVehicle?.make} ${topRatedVehicle?.model} ${topRatedVehicle?.year || ''}`}
                            </h6>
                            <div className="flex flex-wrap gap-3">
                                <Tag value={topRatedVehicle?.make || ""} title="Make" />
                                <Tag value={topRatedVehicle?.color || ""} title="Colour" />
                                <Tag
                                    value={topRatedVehicle?.seatingCapacity || ""}
                                    title="Seating Capacity"
                                />
                                <Tag
                                    value={topRatedVehicle?.totalRides || ""}
                                    title="Total Rides"
                                />
                                <Tag
                                    value={topRatedVehicle?.totalEarnings || ""}
                                    title="Total Earnings"
                                />
                            </div>
                        </div>
                    ) : (
                        <h6 className="text-grey-800 text-xl 2xl:text-h6 font-medium">
                            You have no vehicles listed.{" "}
                            <Link href="/vehicle-onboarding" className="text-primary-500">
                                onboard a vehicle
                            </Link>
                        </h6>
                    )}
                </div>
                {Object.keys(topRatedVehicle || {}).length > 0 && (
                    <div className="relative w-6/12 min-w-5/12">
                        <Image
                            src="/icons/top_rated.png"
                            alt=""
                            width={100}
                            height={100}
                            className="absolute -top-[19px] -left-10"
                        />

                        <Image
                            src="/images/top_rated_vehicle.png"
                            alt=""
                            width={306}
                            height={300}
                            className="w-full h-full object-cover border-[3px] border-primary-50 rounded-2xl"
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
