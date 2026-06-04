"use client";

import { useState } from "react";
import { BlurredDialog } from "@/ui/dialog";
import { SelectInput, Button } from "@/ui";
import useListings from "@/hooks/listings/useListings";

export default function AssignToVehicleModal({
  driver,
  open,
  onOpenChange,
  onAssign,
  isPending,
}: {
  driver: { id: string; name: string } | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAssign: (vehicleId: string) => void;
  isPending: boolean;
}) {
  const [vehicleId, setVehicleId] = useState("");
  const { listings, isLoading } = useListings({ currentPage: 0, pageLimit: 100 });

  const vehicleOptions = listings.map((v) => ({
    option: v.name
      ? `${v.name}${v.licensePlateNumber ? ` · ${v.licensePlateNumber}` : ""}`
      : v.vehicleIdentifier || v.id,
    value: v.id,
  }));

  const handleSubmit = () => {
    if (!vehicleId) return;
    onAssign(vehicleId);
  };

  return (
    <BlurredDialog
      open={open}
      onOpenChange={(o) => {
        if (!o) setVehicleId("");
        onOpenChange(o);
      }}
      title="Assign Driver to Vehicle"
      description={driver ? `Assign ${driver.name} to one of your vehicles` : ""}
      width="max-w-[460px]"
      content={
        <div className="space-y-6">
          <SelectInput
            id="vehicleId"
            label="Select Vehicle"
            placeholder={isLoading ? "Loading vehicles…" : "Choose a vehicle"}
            variant="outlined"
            options={vehicleOptions}
            value={vehicleId}
            onChange={(value: string) => setVehicleId(value)}
          />

          <div className="flex gap-4">
            <Button
              fullWidth
              variant="filled"
              color="white"
              className="!bg-grey-90 !text-grey-700"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              fullWidth
              variant="filled"
              color="primary"
              onClick={handleSubmit}
              loading={isPending}
              disabled={isPending || !vehicleId}
            >
              Assign Driver
            </Button>
          </div>
        </div>
      }
    />
  );
}
