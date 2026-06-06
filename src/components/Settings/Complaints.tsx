"use client";

import { ChangeEvent, FormEvent, useMemo, useState } from "react";
import cn from "classnames";
import { format } from "date-fns";
import { toast } from "react-toastify";
import EmptyState from "@/components/EmptyState";
import { Table, TableBody, TableCell, TableHead, TableRow } from "@/components/Table";
import {
  HostBookingItem,
  useHostPerformanceBookings,
} from "@/hooks/bookings/useHostPerformanceBookings";
import { useHostComplaints } from "@/hooks/complaints/useComplaints";
import {
  Complaint,
  ComplaintCause,
  ComplaintStatus,
  ComplaintType,
  CreateComplaintPayload,
} from "@/hooks/complaints/types";
import { BlurredDialog, Button, FullPageSpinner, InputField, Pagination, SelectInput, TextArea } from "@/ui";

const complaintTableHeadItems = [
  "Title",
  "Cause",
  "Invoice",
  "Type",
  "Status",
  "Created",
  "Description",
];

const complaintTypeOptions: { option: string; value: ComplaintType }[] = [
  { option: "Complaint", value: "COMPLAINT" },
  { option: "Suggestion", value: "SUGGESTION" },
];

const complaintCauseOptions: { option: string; value: ComplaintCause }[] = [
  { option: "General", value: "GENERAL" },
  { option: "Booking", value: "BOOKING" },
];

function formatBookingOptionLabel(booking: HostBookingItem): string {
  const invoice = booking.invoiceNumber?.trim() || "Booking";
  const vehicle = booking.vehicleName?.trim();
  let dateLabel = "";

  try {
    if (booking.bookedAt) {
      dateLabel = format(new Date(booking.bookedAt), "dd MMM yyyy");
    }
  } catch {
    dateLabel = "";
  }

  return [invoice, vehicle, dateLabel].filter(Boolean).join(" · ");
}

const statusLabel: Record<ComplaintStatus, string> = {
  PENDING: "Pending",
  IN_PROGRESS: "In progress",
  RESOLVED: "Resolved",
};

function formatDate(date?: string) {
  if (!date) return "N/A";

  try {
    return format(new Date(date), "MMM dd, yyyy");
  } catch {
    return "N/A";
  }
}

function ComplaintStatusBadge({ status }: { status: ComplaintStatus }) {
  const styles =
    status === "RESOLVED"
      ? { dot: "bg-success-500", bg: "bg-success-50", text: "text-success-600" }
      : status === "IN_PROGRESS"
        ? { dot: "bg-warning-400", bg: "bg-warning-75", text: "text-warning-700" }
        : { dot: "bg-grey-400", bg: "bg-grey-90", text: "text-grey-600" };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap",
        styles.bg,
        styles.text
      )}
    >
      <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", styles.dot)} />
      {statusLabel[status]}
    </span>
  );
}

function ComplaintRow({
  complaint,
  fallbackCreatedAt,
}: {
  complaint: Complaint;
  fallbackCreatedAt?: string;
}) {
  return (
    <TableRow>
      <TableCell title="Title" content={complaint.title} className="!font-medium !text-grey-900" />
      <TableCell
        title="Cause"
        content={complaint.complaintCause?.toLowerCase() ?? "general"}
      />
      <TableCell title="Invoice" content={complaint.invoiceId || "—"} />
      <TableCell title="Type" content={complaint.type.toLocaleLowerCase()} />
      <TableCell title="Status" content={<ComplaintStatusBadge status={complaint.status} />} />
      <TableCell title="Created" content={formatDate(complaint.createdAt ?? fallbackCreatedAt)} />
      <TableCell title="Description" content={complaint.description} />
    </TableRow>
  );
}

function MakeComplaintForm({
  onClose,
}: {
  onClose: () => void;
}) {
  const { useCreateComplaint } = useHostComplaints();
  const { useGetHostBookings } = useHostPerformanceBookings();
  const createComplaint = useCreateComplaint();
  const [values, setValues] = useState<CreateComplaintPayload>({
    title: "",
    description: "",
    type: "COMPLAINT",
    complaintCause: "GENERAL",
    bookingId: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof CreateComplaintPayload, string>>>({});

  const isBookingCause = values.complaintCause === "BOOKING";
  const { data: bookingsData, isLoading: bookingsLoading } = useGetHostBookings(
    { page: 0, size: 100 },
    isBookingCause
  );

  const bookingOptions = useMemo(() => {
    const bookings = bookingsData?.data?.content?.content ?? [];
    return bookings.map((booking) => ({
      option: formatBookingOptionLabel(booking),
      value: booking.bookingId,
    }));
  }, [bookingsData]);

  const validate = () => {
    const nextErrors: Partial<Record<keyof CreateComplaintPayload, string>> = {};

    if (!values.title.trim()) nextErrors.title = "Title is required";
    if (!values.description.trim()) nextErrors.description = "Description is required";
    if (!values.type) nextErrors.type = "Type is required";
    if (!values.complaintCause) nextErrors.complaintCause = "Cause is required";
    if (values.complaintCause === "BOOKING" && !values.bookingId?.trim()) {
      nextErrors.bookingId = "Please select a booking";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) return;

    const payload: CreateComplaintPayload = {
      title: values.title.trim(),
      description: values.description.trim(),
      type: values.type,
      complaintCause: values.complaintCause,
    };

    if (values.complaintCause === "BOOKING") {
      payload.bookingId = values.bookingId?.trim();
    }

    createComplaint.mutate(payload, {
      onSuccess: (response) => {
        const invoiceId = response?.data?.invoiceId;
        toast.success(
          invoiceId
            ? `Complaint submitted. Invoice: ${invoiceId}`
            : "Complaint submitted successfully"
        );
        onClose();
        setValues({
          title: "",
          description: "",
          type: "COMPLAINT",
          complaintCause: "GENERAL",
          bookingId: "",
        });
      },
      onError: () => {
        toast.error("Could not submit complaint. Please try again.");
      },
    });
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <InputField
        id="complaintTitle"
        name="title"
        label="Title"
        placeholder="Enter complaint title"
        value={values.title}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          setValues((current) => ({ ...current, title: event.target.value }))
        }
        error={errors.title}
      />
      <SelectInput
        id="complaintCause"
        label="Cause"
        placeholder="Select cause"
        options={complaintCauseOptions}
        value={values.complaintCause}
        onChange={(value) =>
          setValues((current) => ({
            ...current,
            complaintCause: value as ComplaintCause,
            bookingId: value === "BOOKING" ? current.bookingId : "",
          }))
        }
        error={errors.complaintCause}
      />
      {values.complaintCause === "BOOKING" && (
        <div className="space-y-2">
          <SelectInput
            id="complaintBookingId"
            label="Booking"
            placeholder={
              bookingsLoading
                ? "Loading bookings..."
                : bookingOptions.length
                  ? "Select a booking"
                  : "No bookings available"
            }
            options={bookingOptions}
            value={values.bookingId || undefined}
            onChange={(value) =>
              setValues((current) => ({ ...current, bookingId: value }))
            }
            error={errors.bookingId}
            disabled={bookingsLoading || bookingOptions.length === 0}
          />
          {!bookingsLoading && bookingOptions.length === 0 && (
            <p className="text-xs text-grey-500">
              You have no bookings to attach to this complaint yet.
            </p>
          )}
        </div>
      )}
      <SelectInput
        id="complaintType"
        label="Type"
        placeholder="Select type"
        options={complaintTypeOptions}
        value={values.type}
        onChange={(value) =>
          setValues((current) => ({ ...current, type: value as ComplaintType }))
        }
        error={errors.type}
      />
      <TextArea
        id="complaintDescription"
        name="description"
        label="Description"
        placeholder="Describe the issue"
        value={values.description}
        onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
          setValues((current) => ({ ...current, description: event.target.value }))
        }
        error={errors.description}
      />
      <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
        <Button
          type="button"
          variant="outlined"
          color="transparent"
          className="!py-3 !px-6 !text-sm"
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="filled"
          color="primary"
          className="!py-3 !px-6 !text-sm"
          loading={createComplaint.isPending}
        >
          Submit Complaint
        </Button>
      </div>
    </form>
  );
}

export default function Complaints() {
  const [currentPage, setCurrentPage] = useState(1);
  const [openComplaintModal, setOpenComplaintModal] = useState(false);
  const pageLimit = 10;
  const { useGetMyComplaints } = useHostComplaints();
  const { data, isError, isLoading } = useGetMyComplaints({
    page: currentPage - 1,
    size: pageLimit,
  });

  const complaints = data?.data?.content ?? [];
  const totalCount = data?.data?.totalElements ?? 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-h6 md:text-h5 3xl:text-h4 text-grey-800">Complaints</h2>
          <p className="text-sm text-grey-500 mt-1">View and submit host complaints.</p>
        </div>
        <Button
          variant="filled"
          color="primary"
          className="!py-3 !px-5 !text-sm"
          onClick={() => setOpenComplaintModal(true)}
        >
          Make a Complaint
        </Button>
      </div>

      {isLoading ? (
        <FullPageSpinner />
      ) : isError ? (
        <p className="text-red-500 p-4 bg-red-50 rounded-lg border border-red-100">
          Failed to load complaints. Please try again.
        </p>
      ) : complaints.length === 0 ? (
        <EmptyState
          title="No Complaints Yet"
          message="Your submitted complaints will appear here."
          image="/icons/empty_booking_state.png"
        />
      ) : (
        <Table className="md:mt-7">
          <TableHead tableHeadItems={complaintTableHeadItems} />
          <TableBody>
            {complaints.map((complaint) => (
              <ComplaintRow
                key={complaint.id}
                complaint={complaint}
                fallbackCreatedAt={data?.timestamp}
              />
            ))}
          </TableBody>
        </Table>
      )}

      {totalCount > 0 && (
        <Pagination
          currentPage={currentPage}
          totalCount={totalCount}
          pageLimit={pageLimit}
          onPageChange={setCurrentPage}
        />
      )}

      <BlurredDialog
        open={openComplaintModal}
        onOpenChange={setOpenComplaintModal}
        title="Make a Complaint"
        width="max-w-[620px]"
        content={<MakeComplaintForm onClose={() => setOpenComplaintModal(false)} />}
      />
    </div>
  );
}
