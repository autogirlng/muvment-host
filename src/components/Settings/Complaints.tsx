"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import cn from "classnames";
import { format } from "date-fns";
import { toast } from "react-toastify";
import EmptyState from "@/components/EmptyState";
import TableCell from "@/components/Table/TableCell";
import TableHead from "@/components/Table/TableHead";
import { useHostComplaints } from "@/hooks/complaints/useComplaints";
import {
  Complaint,
  ComplaintStatus,
  ComplaintType,
  CreateComplaintPayload,
} from "@/hooks/complaints/types";
import { BlurredDialog, Button, FullPageSpinner, InputField, Pagination, SelectInput, TextArea } from "@/ui";

const complaintTableHeadItems = ["Title", "Type", "Status", "Created", "Description"];

const complaintTypeOptions: { option: string; value: ComplaintType }[] = [
  { option: "Complaint", value: "COMPLAINT" },
  { option: "Suggestion", value: "SUGGESTION" },
];

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
  const badgeColor =
    status === "RESOLVED"
      ? "bg-success-500"
      : status === "IN_PROGRESS"
        ? "bg-warning-500"
        : "bg-grey-500";

  return (
    <span className={cn("px-3 py-[2px] text-sm font-medium text-white rounded-xl w-fit", badgeColor)}>
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
    <tr className="block lg:table-row bg-white border-2 border-grey-200 lg:border-none hover:border-grey-300 lg:hover:bg-grey-50 rounded-xl lg:rounded-none mb-4 lg:mb-0 p-4 lg:p-0 shadow-sm lg:shadow-none transition-all">
      <TableCell title="Title" content={complaint.title} className="!text-grey-900 !font-medium" />
      <TableCell title="Type" content={complaint.type.toLocaleLowerCase()} />
      <TableCell title="Status" content={<ComplaintStatusBadge status={complaint.status} />} />
      <TableCell title="Created" content={formatDate(complaint.createdAt ?? fallbackCreatedAt)} />
      <TableCell title="Description" content={complaint.description} />
    </tr>
  );
}

function MakeComplaintForm({
  onClose,
}: {
  onClose: () => void;
}) {
  const { useCreateComplaint } = useHostComplaints();
  const createComplaint = useCreateComplaint();
  const [values, setValues] = useState<CreateComplaintPayload>({
    title: "",
    description: "",
    type: "COMPLAINT",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof CreateComplaintPayload, string>>>({});

  const validate = () => {
    const nextErrors: Partial<Record<keyof CreateComplaintPayload, string>> = {};

    if (!values.title.trim()) nextErrors.title = "Title is required";
    if (!values.description.trim()) nextErrors.description = "Description is required";
    if (!values.type) nextErrors.type = "Type is required";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) return;

    createComplaint.mutate(
      {
        title: values.title.trim(),
        description: values.description.trim(),
        type: values.type,
      },
      {
        onSuccess: () => {
          toast.success("Complaint submitted successfully");
          onClose();
          setValues({ title: "", description: "", type: "COMPLAINT" });
        },
        onError: () => {
          toast.error("Could not submit complaint. Please try again.");
        },
      }
    );
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
        <div className="overflow-auto bg-grey-50 lg:bg-white rounded-xl lg:rounded-none p-4 lg:p-0">
          <table className="block lg:table w-full min-w-full lg:divide-y divide-grey-200 lg:border-t border-grey-200 bg-white md:mt-7">
            <TableHead tableHeadItems={complaintTableHeadItems} />
            <tbody className="block lg:table-row-group lg:divide-y divide-grey-200">
              {complaints.map((complaint) => (
                <ComplaintRow
                  key={complaint.id}
                  complaint={complaint}
                  fallbackCreatedAt={data?.timestamp}
                />
              ))}
            </tbody>
          </table>
        </div>
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
