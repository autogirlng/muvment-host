import type { Dispute } from "@/hooks/disputes/types";

function formatDisputeStatus(status: string) {
  return status.replace(/_/g, " ").toLowerCase();
}

function getSupportResponse(dispute: Dispute) {
  if (dispute.resolutionNotes?.trim()) return dispute.resolutionNotes;
  return "Pending response";
}

export default function DisputeCard({ dispute }: { dispute: Dispute }) {
  return (
    <div className="rounded-2xl bg-white border border-grey-200 p-4 text-sm text-grey-700 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase text-grey-500">
            Ticket reference
          </p>
          <p className="font-semibold text-grey-900 break-words">
            {dispute.csTicketReference?.trim() || "—"}
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase text-grey-500">
            Status
          </p>
          <span className="inline-flex w-fit rounded-full bg-grey-100 px-3 py-1 text-xs font-semibold text-grey-700 capitalize">
            {formatDisputeStatus(dispute.status)}
          </span>
        </div>
      </div>
      <div className="space-y-1">
        <p className="text-xs font-semibold uppercase text-grey-500">
          Your reason
        </p>
        <p className="text-grey-800">{dispute.hostContext}</p>
      </div>
      <div className="space-y-1">
        <p className="text-xs font-semibold uppercase text-grey-500">
          Support resolution
        </p>
        <p className="text-grey-800">{getSupportResponse(dispute)}</p>
      </div>
    </div>
  );
}
