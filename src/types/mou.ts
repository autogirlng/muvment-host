export interface MouItem {
  id: string;
  address: string;
  status: "APPROVED" | "PENDING" | "REJECTED"; 
  reason?: string;
  submittedAt: string;
}

export interface MouSubmitPayload {
  fullName: string;
  address: string;
  signatureBase64: string;
}