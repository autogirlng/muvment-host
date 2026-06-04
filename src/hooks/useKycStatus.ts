"use client";

import { useAppSelector } from "@/lib/hooks";

export type MouStatusValue = "APPROVED" | "PENDING" | "REJECTED" | "NONE";

export interface KycStatus {
  phoneVerified: boolean;
  emailVerified: boolean;
  mouStatus: MouStatusValue;
  mouSubmitted: boolean;
  mouApproved: boolean;
  bankAdded: boolean;
  /** phone + bank + MOU submitted (not necessarily approved) */
  kycComplete: boolean;
  /** phone + bank + MOU APPROVED — required to create a listing */
  canCreateListing: boolean;
  isLoading: boolean;
}

/**
 * Single source of truth from GET /users/me, which now returns
 * phoneVerified, emailVerified, bankVerified and mouStatus.
 */
export function useKycStatus(): KycStatus {
  const { user, isLoading } = useAppSelector((state) => state.user);
  const userData = (user?.data as any) ?? (user as any);

  const phoneVerified = Boolean(userData?.phoneVerified);
  const emailVerified = Boolean(userData?.emailVerified);
  const bankAdded = Boolean(userData?.bankVerified);

  const raw = String(userData?.mouStatus ?? "NONE").toUpperCase();
  const mouStatus: MouStatusValue =
    raw === "APPROVED" ? "APPROVED"
    : raw === "PENDING" ? "PENDING"
    : raw === "REJECTED" ? "REJECTED"
    : "NONE";
  const mouSubmitted = mouStatus !== "NONE";
  const mouApproved = mouStatus === "APPROVED";

  const kycComplete = phoneVerified && bankAdded && mouSubmitted;
  const canCreateListing = phoneVerified && bankAdded && mouApproved;

  return {
    phoneVerified,
    emailVerified,
    mouStatus,
    mouSubmitted,
    mouApproved,
    bankAdded,
    kycComplete,
    canCreateListing,
    // Loading until the user profile is available
    isLoading: Boolean(isLoading) || !userData?.userId,
  };
}
