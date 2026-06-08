export type ComplaintType = "COMPLAINT" | "SUGGESTION";
export type ComplaintStatus = "PENDING" | "IN_PROGRESS" | "RESOLVED";
export type ComplaintCause = "GENERAL" | "BOOKING";

export interface ComplaintUser {
  id: string;
  name: string;
  email: string;
}

export interface Complaint {
  id: string;
  title: string;
  description: string;
  type: ComplaintType;
  status: ComplaintStatus;
  /** API may return `cause` or `complaintCause` depending on endpoint version. */
  cause?: ComplaintCause;
  complaintCause?: ComplaintCause;
  bookingId?: string;
  invoiceId?: string | null;
  /** Admin resolution text returned on GET /complaints and GET /complaints/{id}. */
  resolutionNote?: string;
  complaintUser?: ComplaintUser;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateComplaintPayload {
  title: string;
  description: string;
  type: ComplaintType;
  complaintCause: ComplaintCause;
  bookingId?: string;
}

export interface UpdateComplaintPayload {
  status: ComplaintStatus;
  resolutionNote?: string;
}

export interface ComplaintsFilterParams {
  page: number;
  size?: number;
}
