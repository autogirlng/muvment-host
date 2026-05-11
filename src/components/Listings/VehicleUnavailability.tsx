"use client";

import { useState } from "react";
import { format } from "date-fns";
import { FullPageSpinner, BlurredDialog } from "@/ui";
import {
  useVehicleUnavailability,
  UnavailabilityPeriod,
  AddUnavailabilityPayload,
} from "@/hooks/listings/useVehicleUnavailability";

interface Props {
  vehicleId: string;
}

export default function VehicleUnavailability({ vehicleId }: Props) {
  const [openModal, setOpenModal] = useState(false);
  const [editingPeriod, setEditingPeriod] = useState<UnavailabilityPeriod | null>(null);

  const { periods, isLoading, isError, addUnavailability, removeUnavailability } =
    useVehicleUnavailability(vehicleId);

  const isUnavailable = periods.length > 0;

  const handleOpenAdd = () => {
    setEditingPeriod(null);
    setOpenModal(true);
  };

  const handleOpenEdit = (period: UnavailabilityPeriod) => {
    setEditingPeriod(period);
    setOpenModal(true);
  };

  const handleClose = () => {
    setOpenModal(false);
    setEditingPeriod(null);
  };

  if (isLoading) return <FullPageSpinner />;
  if (isError) return <p className="text-red-500 text-sm">Failed to load unavailability periods.</p>;

  return (
    <div className="space-y-5">
      {/* If available → show "Mark as Unavailable". If unavailable → show periods + "Make Available" */}
      {!isUnavailable ? (
        <div className="text-center py-6 space-y-4">
          <p className="text-sm text-grey-500">This vehicle is currently available.</p>
          <button
            onClick={handleOpenAdd}
            className="px-6 py-2.5 rounded-xl bg-primary-500 text-white text-sm font-semibold hover:bg-primary-600 transition-colors"
          >
            Mark as Unavailable
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {periods.map((period) => (
            <div
              key={period.id}
              className="flex items-start justify-between gap-4 p-4 rounded-2xl border border-grey-200 bg-white"
            >
              <div className="space-y-1">
                <p className="text-sm font-semibold text-grey-800">{period.reason}</p>
                <p className="text-xs text-grey-500">
                  {format(new Date(period.startDateTime), "MMM dd, yyyy HH:mm")}
                  {" — "}
                  {format(new Date(period.endDateTime), "MMM dd, yyyy HH:mm")}
                </p>
                {period.notes && (
                  <p className="text-xs text-grey-400 italic">{period.notes}</p>
                )}
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => handleOpenEdit(period)}
                  className="text-xs font-semibold text-grey-700 border border-grey-300 rounded-lg px-3 py-1.5 hover:bg-grey-50 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => removeUnavailability.mutate(period.id)}
                  disabled={removeUnavailability.isPending}
                  className="text-xs font-semibold text-primary-500 border border-primary-500 rounded-lg px-3 py-1.5 hover:bg-primary-50 transition-colors disabled:opacity-50"
                >
                  {removeUnavailability.isPending ? "..." : "Make Available"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <BlurredDialog
        open={openModal}
        onOpenChange={(open) => { if (!open) handleClose(); }}
        title={editingPeriod ? "Edit Unavailability Period" : "Mark as Unavailable"}
        width="max-w-[500px]"
        content={
          <UnavailabilityForm
            defaultValues={
              editingPeriod
                ? {
                    startDateTime: editingPeriod.startDateTime.slice(0, 16),
                    endDateTime: editingPeriod.endDateTime.slice(0, 16),
                    reason: editingPeriod.reason,
                    notes: editingPeriod.notes || "",
                  }
                : undefined
            }
            isLoading={addUnavailability.isPending}
            onClose={handleClose}
            onSubmit={(payload) =>
              addUnavailability.mutate(payload, { onSuccess: handleClose })
            }
          />
        }
      />
    </div>
  );
}

function UnavailabilityForm({
  defaultValues,
  onSubmit,
  isLoading,
  onClose,
}: {
  defaultValues?: { startDateTime: string; endDateTime: string; reason: string; notes: string };
  onSubmit: (payload: AddUnavailabilityPayload) => void;
  isLoading: boolean;
  onClose: () => void;
}) {
  const [values, setValues] = useState({
    startDateTime: defaultValues?.startDateTime ?? "",
    endDateTime: defaultValues?.endDateTime ?? "",
    reason: defaultValues?.reason ?? "MAINTENANCE",
    notes: defaultValues?.notes ?? "",
  });

  const inputClass =
    "w-full border border-grey-300 rounded-xl px-4 py-2.5 text-sm text-grey-800 focus:outline-none focus:border-primary-500 bg-white";
  const labelClass = "block text-sm font-medium text-grey-700 mb-1";

  const handleSubmit = () => {
    onSubmit({
      startDateTime: new Date(values.startDateTime).toISOString(),
      endDateTime: new Date(values.endDateTime).toISOString(),
      reason: values.reason,
      notes: values.notes || undefined,
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className={labelClass}>Start Date & Time</label>
        <input
          type="datetime-local"
          className={inputClass}
          value={values.startDateTime}
          onChange={(e) => setValues({ ...values, startDateTime: e.target.value })}
        />
      </div>
      <div>
        <label className={labelClass}>End Date & Time</label>
        <input
          type="datetime-local"
          className={inputClass}
          value={values.endDateTime}
          onChange={(e) => setValues({ ...values, endDateTime: e.target.value })}
        />
      </div>
      <div>
        <label className={labelClass}>Reason</label>
        <select
          className={inputClass}
          value={values.reason}
          onChange={(e) => setValues({ ...values, reason: e.target.value })}
        >
          <option value="MAINTENANCE">Maintenance</option>
          <option value="COMPANY_USE">Company Use</option>
          <option value="UNAVAILABLE">Unavailable</option>
        </select>
      </div>
      <div>
        <label className={labelClass}>Notes (optional)</label>
        <textarea
          className={`${inputClass} resize-none`}
          rows={3}
          placeholder="Any additional notes..."
          value={values.notes}
          onChange={(e) => setValues({ ...values, notes: e.target.value })}
        />
      </div>
      <div className="flex gap-3 pt-2">
        <button
          onClick={onClose}
          className="flex-1 py-3 rounded-xl border border-grey-300 text-sm font-semibold text-grey-700 hover:bg-grey-50 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={!values.startDateTime || !values.endDateTime || isLoading}
          className="flex-1 py-3 rounded-xl bg-primary-500 text-white text-sm font-semibold hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
}
