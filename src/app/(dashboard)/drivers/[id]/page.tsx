"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { format, startOfWeek, addWeeks } from "date-fns";
import {
  FullPageSpinner,
  Button,
  BlurredDialog,
  SelectInput,
  AvatarInitials,
} from "@/ui";
import BackLink from "@/components/BackLink";
import { Table, TableBody, TableHead, TableCell, TableRow } from "@/components/Table";
import DriverForm from "@/components/Drivers/DriverForm";
import useDriver from "@/hooks/drivers/useDriver";
import { getInitialsFromName } from "@/utils/functions";
import { DRIVER_SHIFT_OPTIONS, DriverShift, DriverSchedule } from "@/types";

const DAYS: { key: keyof Omit<DriverSchedule, "id" | "weekStartDate">; label: string }[] = [
  { key: "mondayShift", label: "Monday" },
  { key: "tuesdayShift", label: "Tuesday" },
  { key: "wednesdayShift", label: "Wednesday" },
  { key: "thursdayShift", label: "Thursday" },
  { key: "fridayShift", label: "Friday" },
  { key: "saturdayShift", label: "Saturday" },
  { key: "sundayShift", label: "Sunday" },
];

function SectionCard({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-grey-200 bg-white p-6 space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-xs font-bold uppercase tracking-widest text-grey-400">{title}</h3>
        {action}
      </div>
      {children}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-grey-100 py-3 last:border-0">
      <span className="text-sm text-grey-500">{label}</span>
      <span className="text-sm font-semibold text-grey-800 text-right">{value}</span>
    </div>
  );
}

export default function DriverDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [weekStart, setWeekStart] = useState(() =>
    format(startOfWeek(new Date(), { weekStartsOn: 1 }), "yyyy-MM-dd")
  );
  const [editOpen, setEditOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    driver,
    isLoading,
    isError,
    schedule,
    trips,
    tripsLoading,
    editDriver,
    updateProfilePicture,
    saveSchedule,
  } = useDriver(id, weekStart);

  // Local editable schedule state
  const emptyShifts = DAYS.reduce(
    (acc, d) => ({ ...acc, [d.key]: "NONE" as DriverShift }),
    {} as Record<string, DriverShift>
  );
  const [shifts, setShifts] = useState<Record<string, DriverShift>>(emptyShifts);

  useEffect(() => {
    if (schedule) {
      setShifts({
        mondayShift: schedule.mondayShift ?? "NONE",
        tuesdayShift: schedule.tuesdayShift ?? "NONE",
        wednesdayShift: schedule.wednesdayShift ?? "NONE",
        thursdayShift: schedule.thursdayShift ?? "NONE",
        fridayShift: schedule.fridayShift ?? "NONE",
        saturdayShift: schedule.saturdayShift ?? "NONE",
        sundayShift: schedule.sundayShift ?? "NONE",
      });
    } else {
      setShifts(emptyShifts);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schedule, weekStart]);

  if (isLoading || !driver) {
    if (isError) {
      return (
        <div className="flex min-h-[400px] flex-col items-center justify-center gap-3">
          <p className="text-base font-medium text-grey-700">Could not load this driver.</p>
          <button
            onClick={() => router.push("/drivers")}
            className="rounded-full bg-primary-500 px-5 py-2 text-sm font-semibold text-white hover:bg-primary-600"
          >
            Back to Drivers
          </button>
        </div>
      );
    }
    return <FullPageSpinner />;
  }

  const [first, last] = driver.fullName?.split(" ") ?? ["", ""];
  let licenseExpiry = driver.licenseExpiryDate || "—";
  try {
    if (driver.licenseExpiryDate) licenseExpiry = format(new Date(driver.licenseExpiryDate), "dd MMM yyyy");
  } catch {}

  const handleSaveSchedule = () => {
    saveSchedule.mutate({ weekStartDate: weekStart, ...(shifts as any) } as DriverSchedule);
  };

  return (
    <main className="py-[56px] space-y-6">
      <BackLink backLink="/drivers" />

      {/* Header */}
      <div className="flex flex-col gap-4 rounded-2xl border border-grey-200 bg-white p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            {driver.profilePictureUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={driver.profilePictureUrl} alt="" className="h-16 w-16 rounded-full object-cover" />
            ) : (
              <AvatarInitials initials={getInitialsFromName(first || "", last || "")} />
            )}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary-500 text-white shadow hover:bg-primary-600"
              title="Change photo"
              disabled={updateProfilePicture.isPending}
            >
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                <path d="M8 4v8M4 8h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) updateProfilePicture.mutate(file);
              }}
            />
          </div>
          <div>
            <h1 className="text-xl font-bold text-grey-900">{driver.fullName}</h1>
            <p className="font-mono text-xs text-grey-400">{driver.driverIdentifier}</p>
            <span
              className={`mt-1 inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                driver.active ? "bg-success-50 text-success-600" : "bg-grey-90 text-grey-500"
              }`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${driver.active ? "bg-success-500" : "bg-grey-400"}`} />
              {driver.active ? "Active" : "Disabled"}
            </span>
          </div>
        </div>
        <Button variant="outlined" color="primary" onClick={() => setEditOpen(true)} className="!text-sm">
          Edit Details
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Driver info */}
        <SectionCard title="Driver Information">
          <div>
            <InfoRow label="Full Name" value={driver.fullName} />
            <InfoRow label="Driver ID" value={driver.driverIdentifier || "—"} />
            <InfoRow label="Phone Number" value={driver.phoneNumber || "—"} />
            <InfoRow label="License Number" value={driver.licenseNumber || "—"} />
            <InfoRow label="License Expiry" value={licenseExpiry} />
            <InfoRow label="Owner" value={driver.ownerName || driver.ownerType || "—"} />
            <InfoRow
              label="Assigned Vehicle"
              value={driver.assignedVehicleName || driver.assignedVehicleIdentifier || "Unassigned"}
            />
          </div>
        </SectionCard>

        {/* Weekly schedule */}
        <SectionCard
          title="Weekly Schedule"
          action={
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() =>
                  setWeekStart(format(addWeeks(new Date(weekStart), -1), "yyyy-MM-dd"))
                }
                className="rounded-md px-2 py-1 text-xs text-grey-500 hover:bg-grey-50"
              >
                ‹ Prev
              </button>
              <span className="text-xs font-medium text-grey-600">
                {format(new Date(weekStart), "dd MMM")}
              </span>
              <button
                type="button"
                onClick={() =>
                  setWeekStart(format(addWeeks(new Date(weekStart), 1), "yyyy-MM-dd"))
                }
                className="rounded-md px-2 py-1 text-xs text-grey-500 hover:bg-grey-50"
              >
                Next ›
              </button>
            </div>
          }
        >
          <div className="space-y-3">
            {DAYS.map((day) => (
              <div key={day.key} className="flex items-center justify-between gap-3">
                <span className="text-sm text-grey-600">{day.label}</span>
                <div className="w-[160px]">
                  <SelectInput
                    id={day.key}
                    label=""
                    placeholder="None"
                    variant="outlined"
                    options={DRIVER_SHIFT_OPTIONS}
                    value={shifts[day.key]}
                    onChange={(value: string) =>
                      setShifts((prev) => ({ ...prev, [day.key]: value as DriverShift }))
                    }
                  />
                </div>
              </div>
            ))}
            <Button
              fullWidth
              variant="filled"
              color="primary"
              className="!mt-2 !text-sm"
              loading={saveSchedule.isPending}
              disabled={saveSchedule.isPending}
              onClick={handleSaveSchedule}
            >
              Save Schedule
            </Button>
          </div>
        </SectionCard>
      </div>

      {/* Trips */}
      <SectionCard title="Driver Trips">
        {tripsLoading ? (
          <div className="py-8"><FullPageSpinner className="!min-h-[120px]" /></div>
        ) : trips.length === 0 ? (
          <p className="py-6 text-center text-sm text-grey-500">No trips assigned to this driver yet.</p>
        ) : (
          <Table>
            <TableHead tableHeadItems={["Vehicle", "Customer", "Start", "End", "Booking Status", "Trip Status"]} />
            <TableBody>
              {trips.map((trip) => {
                const fmt = (d: string) => {
                  try { return format(new Date(d), "MMM dd, yyyy"); } catch { return "—"; }
                };
                return (
                  <TableRow key={trip.id}>
                    <TableCell title="Vehicle" content={trip.vehicleName || trip.vehicleIdentifier || "—"} />
                    <TableCell title="Customer" content={trip.customerName || "—"} />
                    <TableCell title="Start" content={fmt(trip.startDateTime)} />
                    <TableCell title="End" content={fmt(trip.endDateTime)} />
                    <TableCell title="Booking Status" content={trip.bookingStatus} isBadge type="booking" />
                    <TableCell title="Trip Status" content={trip.tripStatus} isBadge type="booking" />
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </SectionCard>

      {/* Edit modal */}
      <BlurredDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        title="Edit Driver Details"
        width="max-w-[600px]"
        content={
          <DriverForm
            isPending={editDriver.isPending}
            submitLabel="Save Changes"
            initialValues={{
              firstName: first,
              lastName: last,
              phoneNumber: driver.phoneNumber,
              driverIdentifier: driver.driverIdentifier,
              licenseNumber: driver.licenseNumber,
              licenseExpiryDate: driver.licenseExpiryDate,
            }}
            onCancel={() => setEditOpen(false)}
            onSubmit={(values) =>
              editDriver.mutate(
                {
                  firstName: values.firstName,
                  lastName: values.lastName,
                  phoneNumber: values.phoneNumber,
                  driverIdentifier: values.driverIdentifier,
                  licenseNumber: values.licenseNumber,
                  licenseExpiryDate: values.licenseExpiryDate,
                },
                { onSuccess: () => setEditOpen(false) }
              )
            }
          />
        }
      />
    </main>
  );
}
