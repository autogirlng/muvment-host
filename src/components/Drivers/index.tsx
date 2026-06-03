"use client";

import { ChangeEvent, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useAppSelector } from "@/lib/hooks";
import {
  FullPageSpinner,
  Button,
  Icons,
  BlurredDialog,
  Popup,
  MoreButton,
  AvatarInitials,
  SearchInput,
  Pagination,
} from "@/ui";
import PageHero from "@/components/DashBoard/PageHero";
import EmptyState from "@/components/EmptyState";
import { Table, TableBody, TableHead, TableCell, TableRow } from "@/components/Table";
import { tableCellBaseClass, tableCellValueClass, tableMobileTitleClass } from "@/components/Table/tableStyles";
import DriverForm from "@/components/Drivers/DriverForm";
import AssignToVehicleModal from "@/components/Drivers/AssignToVehicleModal";
import useDrivers from "@/hooks/drivers/useDrivers";
import { driversTableHeadItems } from "@/utils/data";
import { debounce, getInitialsFromName } from "@/utils/functions";
import { DriverContent } from "@/types";

const PAGE_LIMIT = 10;

export default function Drivers() {
  const { user } = useAppSelector((state) => state.user);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const debouncedSet = useCallback(
    debounce((q: string) => setDebouncedSearch(q), 500),
    []
  );
  useEffect(() => {
    debouncedSet(search);
  }, [search, debouncedSet]);
  useEffect(() => {
    setPage(0);
  }, [debouncedSearch]);

  const {
    drivers,
    totalCount,
    isLoading,
    isError,
    createOpen,
    setCreateOpen,
    createDriver,
    toggleStatus,
    assignDriver,
    setAssignDriver,
    assignToVehicle,
  } = useDrivers({ page, size: PAGE_LIMIT, searchTerm: debouncedSearch });

  return (
    <>
      <PageHero
        firstName={user?.data?.firstName || "Host"}
        subtitle="Manage Your Drivers"
        imageSrc="/images/dashboard/hero-banner.png"
      />

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3">
        <SearchInput
          placeholder="Search drivers"
          name="driversSearch"
          value={search}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
          className="w-full max-w-[310px]"
          icon
        />
        <Button
          variant="filled"
          color="primary"
          className="flex items-center gap-2 !py-2 !px-3 md:!px-4 !text-sm 3xl:!text-base button_icon"
          onClick={() => setCreateOpen(true)}
        >
          {Icons.ic_add_circle}
          <span className="hidden md:block">Add New Driver</span>
        </Button>
      </div>

      {/* Body */}
      {isLoading ? (
        <FullPageSpinner />
      ) : isError ? (
        <p className="rounded-lg border border-error-100 bg-error-50 p-4 text-sm text-error-800">
          Failed to load drivers. Please try again.
        </p>
      ) : drivers.length === 0 ? (
        <EmptyState
          title={debouncedSearch ? "" : "No Drivers Yet"}
          message={
            debouncedSearch ? (
              `No results for "${debouncedSearch}"`
            ) : (
              <button onClick={() => setCreateOpen(true)} className="text-primary-500 hover:underline">
                Add your first driver
              </button>
            )
          }
          image={debouncedSearch ? "/icons/empty_search.png" : "/icons/empty_booking_state.png"}
        />
      ) : (
        <Table className="md:mt-7">
          <TableHead tableHeadItems={driversTableHeadItems} />
          <TableBody>
            {drivers.map((driver) => (
              <DriverRow
                key={driver.id}
                driver={driver}
                onAssign={() => setAssignDriver({ id: driver.id, name: driver.fullName })}
                onToggleStatus={() =>
                  toggleStatus.mutate({ driverId: driver.id, isActive: !driver.active })
                }
              />
            ))}
          </TableBody>
        </Table>
      )}

      {totalCount > 0 && (
        <Pagination
          currentPage={page + 1}
          totalCount={totalCount}
          pageLimit={PAGE_LIMIT}
          onPageChange={(p) => setPage(p - 1)}
        />
      )}

      {/* Create driver modal */}
      <BlurredDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        title="Add New Driver"
        description="Create a driver profile. An ID is auto-generated if you leave the identifier blank."
        width="max-w-[600px]"
        content={
          <DriverForm
            isPending={createDriver.isPending}
            submitLabel="Create Driver"
            onCancel={() => setCreateOpen(false)}
            onSubmit={(values) =>
              createDriver.mutate({
                firstName: values.firstName,
                lastName: values.lastName,
                phoneNumber: values.phoneNumber,
                driverIdentifier: values.driverIdentifier,
                licenseNumber: values.licenseNumber,
                licenseExpiryDate: values.licenseExpiryDate,
              })
            }
          />
        }
      />

      {/* Assign-to-vehicle modal */}
      <AssignToVehicleModal
        driver={assignDriver}
        open={!!assignDriver}
        onOpenChange={(o) => !o && setAssignDriver(null)}
        onAssign={(vehicleId) =>
          assignDriver && assignToVehicle.mutate({ driverId: assignDriver.id, vehicleId })
        }
        isPending={assignToVehicle.isPending}
      />
    </>
  );
}

function DriverRow({
  driver,
  onAssign,
  onToggleStatus,
}: {
  driver: DriverContent;
  onAssign: () => void;
  onToggleStatus: () => void;
}) {
  const [first, last] = driver.fullName?.split(" ") ?? ["", ""];
  const isAssigned = !!driver.assignedVehicleId;

  return (
    <TableRow>
      <TableCell
        title="Driver"
        content={
          <Link href={`/drivers/${driver.id}`} className="flex items-center gap-3 hover:opacity-80">
            {driver.profilePictureUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={driver.profilePictureUrl} alt="" className="h-9 w-9 rounded-full object-cover" />
            ) : (
              <AvatarInitials initials={getInitialsFromName(first || "", last || "")} />
            )}
            <span className="font-medium text-grey-900">{driver.fullName}</span>
          </Link>
        }
      />
      <TableCell title="Driver ID" content={driver.driverIdentifier || "—"} />
      <TableCell title="Phone Number" content={driver.phoneNumber || "—"} />
      <TableCell
        title="Assigned Vehicle"
        content={driver.assignedVehicleName || driver.assignedVehicleIdentifier || "—"}
      />
      <TableCell
        title="Status"
        content={
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
              driver.active ? "bg-success-50 text-success-600" : "bg-grey-90 text-grey-500"
            }`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${driver.active ? "bg-success-500" : "bg-grey-400"}`} />
            {driver.active ? "Active" : "Disabled"}
          </span>
        }
      />
      <td className={tableCellBaseClass}>
        <span className={tableMobileTitleClass}>Actions</span>
        <div className={tableCellValueClass}>
          <Popup
            align="end"
            trigger={<MoreButton className="!mx-0 ml-auto lg:mx-auto" />}
            content={
              <ul className="min-w-[190px] space-y-1">
                <li>
                  <Link
                    href={`/drivers/${driver.id}`}
                    className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-medium text-grey-800 transition-colors hover:bg-grey-50"
                  >
                    <span className="shrink-0 text-primary-500">{Icons.ic_user_account}</span>
                    View Details
                  </Link>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={onAssign}
                    className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs font-medium text-grey-800 transition-colors hover:bg-grey-50"
                  >
                    <span className="shrink-0 text-primary-500">{Icons.ic_car}</span>
                    {isAssigned ? "Reassign Vehicle" : "Assign to Vehicle"}
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={onToggleStatus}
                    className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs font-medium transition-colors hover:bg-grey-50 ${
                      driver.active ? "text-error-800" : "text-success-600"
                    }`}
                  >
                    {driver.active ? "Disable Driver" : "Enable Driver"}
                  </button>
                </li>
              </ul>
            }
          />
        </div>
      </td>
    </TableRow>
  );
}
