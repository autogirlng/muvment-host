import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Spinner } from "@/ui";
import {
  formatLocaleCount,
  formatNgnAmount,
  parseLooseNumber,
} from "@/utils/formatters";
import { TopRatedVehicleProps } from "./props";

function formatTagValue(raw: string, kind: "count" | "money" | "text"): string {
  if (!raw.trim()) return raw;
  if (kind === "text") return raw;
  const n = parseLooseNumber(raw);
  if (n === null) return raw;
  if (kind === "money") return `₦${formatNgnAmount(n)}`;
  return formatLocaleCount(n);
}

const Tag = ({
  value,
  title,
  format,
}: {
  value: string;
  title: string;
  format?: "count" | "money" | "text";
}) => (
  <p className="rounded-lg bg-primary-50 px-3 py-2 text-2xs text-grey-500 2xl:text-xs">
    {title}{" "}
    <span className="text-xs text-grey-800 2xl:text-sm">
      {formatTagValue(value, format ?? "text")}
    </span>
  </p>
);

export default function TopRatedVehicle({
  topRatedVehicle,
  isLoading,
}: TopRatedVehicleProps) {
  const hasVehicle = Object.keys(topRatedVehicle || {}).length > 0;

  return (
    <div className="flex h-full min-h-[220px] flex-col rounded-2xl border border-grey-200 bg-white px-4 py-5 text-grey-500 sm:min-h-[260px] sm:px-5 sm:py-6 lg:min-h-full">
      <p className="text-xs text-grey-500 sm:text-sm">Top Rated Vehicle</p>

      {isLoading ? (
        <div className="flex flex-1 items-center justify-center py-8">
          <Spinner />
        </div>
      ) : hasVehicle ? (
        <div className="mt-4 flex flex-1 flex-col gap-4 sm:flex-row sm:gap-5">
          <div className="space-y-4 sm:w-7/12">
            <h6 className="text-lg font-medium text-grey-800 sm:text-xl 2xl:text-h6">
              {`${topRatedVehicle?.make} ${topRatedVehicle?.model} ${topRatedVehicle?.year || ""}`}
            </h6>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              <Tag value={topRatedVehicle?.make || ""} title="Make" />
              <Tag
                value={topRatedVehicle?.color || topRatedVehicle?.colour || ""}
                title="Colour"
              />
              <Tag
                value={topRatedVehicle?.seatingCapacity || ""}
                title="Seating Capacity"
                format="count"
              />
              <Tag
                value={topRatedVehicle?.totalRides || ""}
                title="Total Rides"
                format="count"
              />
              <Tag
                value={topRatedVehicle?.totalEarnings || ""}
                title="Total Earnings"
                format="money"
              />
            </div>
          </div>
          <div className="relative min-h-[160px] flex-1 sm:min-h-0">
            <Image
              src="/icons/top_rated.png"
              alt=""
              width={100}
              height={100}
              className="absolute -left-6 -top-4 hidden sm:block"
            />
            <Image
              src="/images/top_rated_vehicle.png"
              alt=""
              width={306}
              height={300}
              className="h-full w-full rounded-2xl border-[3px] border-primary-50 object-cover"
            />
          </div>
        </div>
      ) : (
        <div className="flex flex-1 items-center py-6 sm:py-8">
          <p className="text-base font-medium leading-relaxed text-grey-800 sm:text-lg 2xl:text-h6">
            You have no vehicles listed.{" "}
            <Link href="/vehicle-onboarding" className="text-primary-500 hover:underline">
              onboard a vehicle
            </Link>
          </p>
        </div>
      )}
    </div>
  );
}
