"use client";

import { useQuery } from "@tanstack/react-query";
import { useAppSelector } from "@/lib/hooks";
import { WalletBalance } from "@/types";
import { useHttp } from "@/hooks/useHttp";

export default function useWallet() {
  const http = useHttp();

  const { user } = useAppSelector((state) => state.user);

  const { data, isError, isLoading } = useQuery({
    queryKey: ["getWalletBalance"],

    queryFn: () => http.get<WalletBalance>(`/api/wallet`),
    enabled: !!user?.data.userId,
    retry: 1,
  });

  return {
    wallteBalance: data,
    isError,
    isLoading,
  };
}
