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
  const token = session?.user?.accessToken ?? userToken ?? "";

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
    enabled: !!token,
    retry: false,
  });

  return {
    ...query,
    hasBankDetails: query.data?.hasBankDetails ?? false,
  };
}
