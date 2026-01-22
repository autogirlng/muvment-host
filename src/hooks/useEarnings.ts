"use client";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAppSelector } from "@/lib/hooks";
import { useHttp } from "@/hooks/useHttp";
import { handleFilterQuery } from "@/utils/functions";
import {
  EarningPeriod,
  MonthEarning, 
  DayEarning
} from "@/types";


// useEarnings.ts
export default function useEarnings({
  period = EarningPeriod.WEEK,
  filters = {},
  startDate,
  endDate,
}: {
  period: EarningPeriod;
  filters?: Record<string, string[]>;
  startDate?: string;
  endDate?: string;
}) {
  const http = useHttp();
  const { user } = useAppSelector((state) => state.user);

  const { data, isError, isLoading } = useQuery({
    queryKey: ["getEarnings", user?.data.userId, period, filters, startDate, endDate],
    queryFn: () =>
      http.get(
        `/api/host/earnings/?
       ${handleFilterQuery({
         filters,
         startDate,
         endDate,
       })}`
      ),
    enabled: !!user?.data.userId,
    retry: false,
  });

  // Format chart data based on period
  const chartData = useMemo(() => {
    if (!data)
      return {
        categories: [],
        amounts: [],
      };

    // @ts-ignore
    const earnings = data.earnings;

    if (period === EarningPeriod.MONTH) {
      return {
        categories: (earnings as MonthEarning[]).map((e) => e.month),
        amounts: (earnings as MonthEarning[]).map((e) => e.amount),
      };
    }

    return {
      categories: (earnings as DayEarning[]).map((e) => e.day),
      amounts: (earnings as DayEarning[]).map((e) => e.amount),
    };
  }, [data, period]);

  return {
    // @ts-ignore
    earnings: data?.earnings || [],
    // @ts-ignore
    totalEarnings: data?.totalEarnings || 0,
    // @ts-ignore
    periodStart: data?.periodStart,
    // @ts-ignore
    periodEnd: data?.periodEnd,
    chartData,
    isError,
    isLoading,
  };
}
