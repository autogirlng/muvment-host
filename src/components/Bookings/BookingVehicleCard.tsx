import Image from "next/image";
import { Chip } from "@/ui";
import { sedan } from "@/ui/assets";

export type BookingVehicleInfo = {
  name: string;
  photoUrl: string | null;
  status: string;
  specChips: string[];
  detailItems: { label: string; value: string }[];
  driver: {
    name: string;
    phone: string;
    license?: string;
  } | null;
  features: string[];
  description: string;
};

type BookingVehicleCardProps = {
  vehicle: BookingVehicleInfo;
  isLoadingDetails?: boolean;
};

function DetailTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-grey-90 px-4 py-3.5">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-grey-500">
        {label}
      </p>
      <p className="mt-1.5 text-sm font-semibold text-grey-900 break-words">
        {value || "—"}
      </p>
    </div>
  );
}

function formatStatusLabel(status: string): string {
  if (!status?.trim()) return "—";
  return status
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export default function BookingVehicleCard({
  vehicle,
  isLoadingDetails = false,
}: BookingVehicleCardProps) {
  const displayName =
    vehicle.name ||
    (vehicle.specChips.length >= 2
      ? `${vehicle.specChips[0]} ${vehicle.specChips[1]}`
      : vehicle.specChips[0]) ||
    "—";

  return (
    <div className="space-y-6 border-b border-dashed border-grey-300 pb-8">
      <p className="text-grey-700 text-sm 3xl:text-base uppercase !font-semibold">
        Vehicle information
      </p>

      <div className="overflow-hidden rounded-2xl border border-grey-200 bg-white">
        <div className="flex flex-col lg:flex-row">
          <div className="relative h-[220px] w-full shrink-0 bg-grey-100 lg:h-auto lg:w-[300px] xl:w-[340px]">
            {vehicle.photoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={vehicle.photoUrl}
                alt={displayName}
                className="h-full w-full object-cover"
              />
            ) : (
              <Image
                src={sedan}
                alt=""
                fill
                className="object-cover opacity-80"
              />
            )}
          </div>

          <div className="flex flex-1 flex-col gap-6 p-6 sm:p-8">
            <div className="space-y-3">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="space-y-1 min-w-0">
                  <p className="text-grey-500 text-sm 3xl:text-base">
                    Vehicle name
                  </p>
                  <h5 className="text-h6 3xl:text-h5 !font-bold text-black">
                    {displayName}
                  </h5>
                </div>
                {vehicle.status && (
                  <span className="rounded-full bg-primary-75 px-3 py-1 text-xs font-semibold text-primary-600">
                    {formatStatusLabel(vehicle.status)}
                  </span>
                )}
              </div>

              {vehicle.specChips.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {vehicle.specChips.map((chip) => (
                    <Chip
                      key={chip}
                      text={chip}
                      variant="filled"
                      radius="sm"
                      color="light"
                    />
                  ))}
                </div>
              )}
            </div>

            {isLoadingDetails ? (
              <p className="text-sm text-grey-500">Loading vehicle details…</p>
            ) : (
              <>
                {vehicle.detailItems.length > 0 && (
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    {vehicle.detailItems.map((item) => (
                      <DetailTile
                        key={item.label}
                        label={item.label}
                        value={item.value}
                      />
                    ))}
                  </div>
                )}

                {vehicle.driver && (
                  <div className="rounded-xl border border-grey-200 bg-grey-90/60 p-4 sm:p-5">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-grey-500">
                      Assigned driver
                    </p>
                    <div className="mt-3 flex flex-col gap-1 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-6 sm:gap-y-1">
                      <p className="text-sm font-semibold text-grey-900">
                        {vehicle.driver.name}
                      </p>
                      {vehicle.driver.phone && (
                        <p className="text-sm text-grey-600">
                          {vehicle.driver.phone}
                        </p>
                      )}
                      {vehicle.driver.license && (
                        <p className="text-sm text-grey-600">
                          License: {vehicle.driver.license}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {vehicle.features.length > 0 && (
                  <div className="space-y-3">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-grey-500">
                      Features
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {vehicle.features.map((feature) => (
                        <Chip
                          key={feature}
                          text={feature}
                          variant="filled"
                          radius="sm"
                          color="lighter"
                        />
                      ))}
                    </div>
                  </div>
                )}

                {vehicle.description && (
                  <div className="space-y-2 rounded-xl border border-grey-200 bg-white p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-grey-500">
                      Description
                    </p>
                    <p className="text-sm leading-relaxed text-grey-700">
                      {vehicle.description}
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
