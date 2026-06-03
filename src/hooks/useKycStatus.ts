"use client";

import { useMou } from "@/hooks/mou/useMou";
import useHostBankDetailsStatus from "@/hooks/useHostBankDetailsStatus";
import { useAppSelector } from "@/lib/hooks";

export type MouStatusValue = "APPROVED" | "PENDING" | "REJECTED" | "NONE";

export interface KycStatus {
  phoneVerified: boolean;
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

export function useKycStatus(): KycStatus {
  const { user } = useAppSelector((state) => state.user);
  const { useGetHostMou } = useMou();
  const mouQuery = useGetHostMou();
  const bankStatus = useHostBankDetailsStatus();

  const userData = (user?.data as any) ?? (user as any);
  const phoneVerified = Boolean(userData?.phoneVerified);
  const bankAdded = bankStatus.hasBankDetails;

  const mouList = mouQuery.data?.data ?? [];
  const mouSubmitted = mouList.length > 0;
  const latestMou = mouSubmitted ? mouList[0] : null;
  const mouStatus: MouStatusValue = latestMou
    ? ((latestMou.status as MouStatusValue) ?? "PENDING")
    : "NONE";
  const mouApproved = mouStatus === "APPROVED";

  const kycComplete = phoneVerified && bankAdded && mouSubmitted;
  const canCreateListing = phoneVerified && bankAdded && mouApproved;

  return {
    phoneVerified,
    mouStatus,
    mouSubmitted,
    mouApproved,
    bankAdded,
    kycComplete,
    canCreateListing,
    isLoading: mouQuery.isLoading || bankStatus.isLoading,
  };
}
