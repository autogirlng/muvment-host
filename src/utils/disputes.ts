import type { Dispute } from "@/hooks/disputes/types";

/** Prefer backend-generated reference (e.g. DSP191) over raw UUIDs. */
export function getDisputeDisplayId(dispute: Dispute): string {
  if (dispute.csTicketReference?.trim()) {
    return dispute.csTicketReference.trim();
  }
  return dispute.id;
}
