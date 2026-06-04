import Link from "next/link";
import { VehicleInformationStepper, VehicleStatus } from "@/types";
import { Popup, MoreButton } from "@/ui";
import { TableCell, TableRow } from "@/components/Table";
import { tableCellBaseClass, tableCellValueClass, tableMobileTitleClass } from "@/components/Table/tableStyles";

function formatMakeModel(listing: VehicleInformationStepper): string {
  const make = listing.vehicleMake?.name;
  const model = listing.vehicleModel?.name;
  if (make && model) return `${make} ${model}`;
  if (make) return make;
  if (model) return model;
  return listing.vehicleTypeName ?? listing.vehicleType?.name ?? "—";
}

function formatVehicleTitle(listing: VehicleInformationStepper): string {
  if (listing.status === VehicleStatus.DRAFT) {
    return "Unfinished Listing";
  }
  return listing.name || "—";
}

function formatCity(city: string | undefined): string {
  if (!city) return "—";
  return city.charAt(0).toUpperCase() + city.slice(1);
}

type ListingTableRowProps = {
  listing: VehicleInformationStepper;
};

export default function ListingTableRow({ listing }: ListingTableRowProps) {
  const isDraft = listing.status === VehicleStatus.DRAFT;
  const detailHref = isDraft
    ? `/vehicle-onboarding?id=${listing.id}`
    : `/listings/${listing.id}`;
  const primaryActionLabel = isDraft ? "Complete Listing" : "View Details";

  return (
    <TableRow>
      <TableCell
        title="Vehicle"
        content={
          <div className="space-y-0.5">
            <span className="font-medium text-grey-900">{formatVehicleTitle(listing)}</span>
            {listing.vehicleIdentifier && (
              <span className="block font-mono text-[11px] text-grey-400">
                {listing.vehicleIdentifier}
              </span>
            )}
          </div>
        }
      />
      <TableCell title="Make & Model" content={formatMakeModel(listing)} />
      <TableCell
        title="Type"
        content={listing.vehicleTypeName ?? listing.vehicleType?.name ?? "—"}
      />
      <TableCell
        title="Year"
        content={listing.yearOfRelease ? String(listing.yearOfRelease) : "—"}
      />
      <TableCell title="City" content={formatCity(listing.city)} className="capitalize" />
      <TableCell title="License Plate" content={listing.licensePlateNumber || "—"} />
      <TableCell title="Seats" content={listing.numberOfSeats ? String(listing.numberOfSeats) : "—"} />
      <TableCell title="Status" content={listing.status} isBadge type="listing" />
      <td className={tableCellBaseClass}>
        <span className={tableMobileTitleClass}>Actions</span>
        <div className={tableCellValueClass}>
          <Popup
            align="end"
            trigger={<MoreButton className="!mx-0 lg:mx-auto" />}
            content={
              <>
                <p className="!text-xs !font-semibold text-grey-800">Actions</p>
                <ul className="mt-2 space-y-1">
                  <li>
                    <Link
                      href={detailHref}
                      className="block rounded-lg px-2 py-2 text-xs font-medium text-grey-800 transition-colors hover:bg-grey-50"
                    >
                      {primaryActionLabel}
                    </Link>
                  </li>
                  {!isDraft && listing.status === VehicleStatus.APPROVED && (
                    <li>
                      <Link
                        href={`/listings/view-as-customer/${listing.id}`}
                        className="block rounded-lg px-2 py-2 text-xs font-medium text-grey-700 transition-colors hover:bg-grey-50"
                      >
                        View as customer
                      </Link>
                    </li>
                  )}
                </ul>
              </>
            }
          />
        </div>
      </td>
    </TableRow>
  );
}
