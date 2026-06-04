"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useAppSelector } from "@/lib/hooks";
import { baseAPIURL } from "@/utils/constants";

type BankDetailsStatus = {
  hasBankDetails: boolean;
};

function hasUsableBankDetails(data: unknown): boolean {
  if (!data || typeof data !== "object" || Array.isArray(data)) return false;

  const details = data as Record<string, unknown>;
  return (
    typeof details.accountNumber === "string" &&
    details.accountNumber.length > 0 &&
    typeof details.bankCode === "string" &&
    details.bankCode.length > 0
  );
}

export default function useHostBankDetailsStatus() {
  const { data: session } = useSession();
  const userToken = useAppSelector((state) => state.user.userToken);
  const user = useAppSelector((state) => state.user.user);
  const token = session?.user?.accessToken ?? userToken ?? "";

  // Prefer the authoritative `bankVerified` flag now returned by /users/me.
  // Falls back to the bank-details lookup only when that flag is absent.
  const bankVerified = (user?.data as any)?.bankVerified;
  const hasFlag = typeof bankVerified === "boolean";

  const query = useQuery({
    queryKey: ["hostBankDetailsStatus", token],
    queryFn: async (): Promise<BankDetailsStatus> => {
      if (!baseAPIURL) return { hasBankDetails: false };

      const response = await fetch(`${baseAPIURL}/hosts/me/bank-details`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 404) {
        return { hasBankDetails: false };
      }

      const body = (await response.json().catch(() => null)) as {
        data?: unknown;
      } | null;

      if (!response.ok) {
        return { hasBankDetails: false };
      }

      return { hasBankDetails: hasUsableBankDetails(body?.data) };
    },
    // Skip the network call entirely when the user flag already answers it.
    enabled: !!token && !hasFlag,
    retry: false,
  });

  return {
    ...query,
    isLoading: hasFlag ? false : query.isLoading,
    hasBankDetails: hasFlag ? Boolean(bankVerified) : query.data?.hasBankDetails ?? false,
  };
}
