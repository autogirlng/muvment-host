"use client";

import { useState } from "react";
import { AvatarInitials, FullPageSpinner, BlurredDialog, Button, SelectInput } from "@/ui";
import { getInitialsFromName } from "@/utils/functions";
import DriverForm from "@/components/Drivers/DriverForm";
import useListingDrivers from "@/hooks/listings/useListingDrivers";
import { DriverDetailsProps } from "./props";
import type { VehicleAssignedDriver } from "@/types";

export default function DriversDetails({
  id,
  assignedDriver,
  vehicleName,
}: DriverDetailsProps) {
  const {
    isLoading,
    assignedDriver: vehicleDriver,
    hostDrivers,
    showAddDriver,
    showAssignDriver,
    createOpen,
    setCreateOpen,
    assignPromptOpen,
    setAssignPromptOpen,
    assignPickerOpen,
    setAssignPickerOpen,
    createDriver,
    assignToVehicle,
    unassignFromVehicle,
    handleAssignPromptYes,
    handleAssignPromptNo,
  } = useListingDrivers(id, assignedDriver);

  const [selectedDriverId, setSelectedDriverId] = useState("");

  if (isLoading) {
    return <FullPageSpinner />;
  }

  const driverOptions = hostDrivers.map((driver) => ({
    option: driver.fullName,
    value: driver.id,
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h5 className="text-h6 3xl:text-h5 !font-semibold text-black">Drivers</h5>
        <div className="flex flex-wrap gap-2">
          {showAddDriver && (
            <Button
              className="!text-xs 3xl:!text-base text-primary-500 !bg-primary-75 rounded-[31px] !py-1.5 3xl:!py-2 !px-3 3xl:!px-4"
              onClick={() => setCreateOpen(true)}
            >
              Add New Driver
            </Button>
          )}
          {showAssignDriver && (
            <Button
              variant="outlined"
              className="!text-xs 3xl:!text-base rounded-[31px] !py-1.5 3xl:!py-2 !px-3 3xl:!px-4"
              onClick={() => setAssignPickerOpen(true)}
            >
              Assign Driver
            </Button>
          )}
        </div>
      </div>

      {vehicleDriver ? (
        <AssignedDriverCard
          driver={vehicleDriver}
          onUnassign={() => unassignFromVehicle.mutate()}
          isUnassigning={unassignFromVehicle.isPending}
        />
      ) : (
        <div className="rounded-2xl border border-grey-200 bg-grey-50 px-6 py-10 text-center text-sm text-grey-600">
          No driver is assigned to this vehicle yet.
        </div>
      )}

      <BlurredDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        title="Add New Driver"
        width="max-w-[560px]"
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
                licenseNumber: values.licenseNumber,
                licenseExpiryDate: values.licenseExpiryDate,
              })
            }
          />
        }
      />

      <BlurredDialog
        open={assignPromptOpen}
        onOpenChange={setAssignPromptOpen}
        title="Assign driver to vehicle?"
        description={
          vehicleName
            ? `Would you like to assign this driver to ${vehicleName}?`
            : "Would you like to assign this driver to this vehicle?"
        }
        width="max-w-[440px]"
        content={
          <div className="flex gap-3">
            <Button
              fullWidth
              variant="filled"
              color="white"
              className="!bg-grey-90 !text-grey-700"
              onClick={handleAssignPromptNo}
              disabled={assignToVehicle.isPending}
            >
              Not now
            </Button>
            <Button
              fullWidth
              variant="filled"
              color="primary"
              loading={assignToVehicle.isPending}
              disabled={assignToVehicle.isPending}
              onClick={handleAssignPromptYes}
            >
              Yes, assign
            </Button>
          </div>
        }
      />

      <BlurredDialog
        open={assignPickerOpen}
        onOpenChange={(open) => {
          setAssignPickerOpen(open);
          if (!open) setSelectedDriverId("");
        }}
        title="Assign driver"
        description="Select a driver to assign to this vehicle."
        width="max-w-[460px]"
        content={
          <div className="space-y-5">
            <SelectInput
              id="listingAssignDriverId"
              label="Driver"
              placeholder="Select a driver"
              variant="outlined"
              options={driverOptions}
              value={selectedDriverId}
              onChange={(value: string) => setSelectedDriverId(value)}
            />
            <div className="flex gap-3">
              <Button
                fullWidth
                variant="filled"
                color="white"
                className="!bg-grey-90 !text-grey-700"
                onClick={() => setAssignPickerOpen(false)}
              >
                Cancel
              </Button>
              <Button
                fullWidth
                variant="filled"
                color="primary"
                loading={assignToVehicle.isPending}
                disabled={!selectedDriverId || assignToVehicle.isPending}
                onClick={() => assignToVehicle.mutate(selectedDriverId)}
              >
                Assign
              </Button>
            </div>
          </div>
        }
      />
    </div>
  );
}

function AssignedDriverCard({
  driver,
  onUnassign,
  isUnassigning,
}: {
  driver: VehicleAssignedDriver;
  onUnassign: () => void;
  isUnassigning: boolean;
}) {
  const nameParts = driver.fullName?.split(" ") ?? ["", ""];
  const firstName = nameParts[0] ?? "";
  const lastName = nameParts.slice(1).join(" ") || "";

  return (
    <div className="p-6 bg-grey-90 rounded-[32px] flex items-center justify-between gap-4">
      <div className="flex gap-3 items-center min-w-0">
        {driver.profilePictureUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={driver.profilePictureUrl}
            alt=""
            className="h-12 w-12 rounded-full object-cover shrink-0"
          />
        ) : (
          <AvatarInitials
            initials={getInitialsFromName(firstName, lastName)}
          />
        )}
        <div className="space-y-[2px] min-w-0">
          {driver.driverIdentifier && (
            <p className="text-grey-500 text-xs 3xl:text-sm">
              ID {driver.driverIdentifier}
            </p>
          )}
          <p className="text-grey-700 text-sm 3xl:text-base font-medium truncate">
            {driver.fullName}
          </p>
          <p className="text-primary-500 text-xs 3xl:text-sm">
            {driver.phoneNumber}
          </p>
        </div>
      </div>
      <Button
        variant="outlined"
        className="shrink-0 !text-xs 3xl:!text-sm !py-2 !px-4 text-error-800 border-error-200 hover:bg-error-50"
        loading={isUnassigning}
        disabled={isUnassigning}
        onClick={onUnassign}
      >
        Unassign
      </Button>
    </div>
  );
}
