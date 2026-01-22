"use client";

import { useQuery } from "@tanstack/react-query";
import { Transaction } from "@/types";
import { useAppSelector } from "@/lib/hooks";
import { useHttp } from "@/hooks/useHttp";
import { handleFilterQuery } from "@/utils/functions";

type TransactionDataType = {
  data: Transaction[];
  totalCount: number;
};

export default function useTransactions({
  currentPage = 1,
  pageLimit = 10,
  filters = {},
}: {
  currentPage: number;
  pageLimit: number;
  filters?: Record<string, string[]>;
}) {
  const http = useHttp();
  const { user } = useAppSelector((state) => state.user);

  const { data, isError, error, isLoading } = useQuery({
    queryKey: ["getTransactions", currentPage, filters],

    queryFn: () =>
      http.get<TransactionDataType>(
        `/api/transactions?page=${currentPage}&limit=${pageLimit}&${handleFilterQuery({filters})}`
      ),
    enabled: !!user?.data.userId,
    retry: false,
  });

  return {
    transactions: data?.data ?? [],
    totalCount: data?.totalCount ?? 0,
    isError,
    error,
    isLoading,
  };
}
