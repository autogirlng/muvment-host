"use client";

import { useQuery } from "@tanstack/react-query";
import { useAppSelector } from "@/lib/hooks";
import { DashboardStatistics, TopRatedVehicleType } from "@/types";
import { useHttp } from "./useHttp";

/** Swagger: Host Performance */
const HOST_PERF = {
  onboardedVehicle: "/v1/host-performance/onboarded-vehicle",
  completedTrip: "/v1/host-performance/completed-trip",
  earningHistory: "/v1/host-performance/earning-history",
  pendingBalance: "/v1/host-performance/pending-balance",
  topRated: "/v1/host-performance/top-rated",
} as const;

function pickNum(
  o: Record<string, unknown>,
  camel: string,
  snake: string
): number {
  const v = o[camel] ?? o[snake];
  if (v === null || v === undefined || v === "") return 0;
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function getInnerData(payload: unknown): unknown {
  if (payload == null || typeof payload !== "object") return payload;
  const d = (payload as Record<string, unknown>).data;
  return d !== undefined ? d : payload;
}

function sumVehicleBuckets(o: Record<string, unknown>): number {
  const keys = ["approved", "drafts", "inReview", "rejected", "suspended"] as const;
  let n = 0;
  for (const k of keys) {
    const arr = o[k];
    if (Array.isArray(arr)) n += arr.length;
  }
  return n;
}

function extractCount(payload: unknown): number {
  const body = getInnerData(payload);
  if (typeof body === "number" && Number.isFinite(body)) return body;
  if (Array.isArray(body)) return body.length;
  if (body && typeof body === "object") {
    const o = body as Record<string, unknown>;
    const content = o.content ?? o.items ?? o.records;
    if (Array.isArray(content)) return content.length;
    const totalVehicles = pickNum(o, "totalVehicles", "total_vehicles");
    if (totalVehicles > 0) return totalVehicles;
    const bucketSum = sumVehicleBuckets(o);
    if (bucketSum > 0) return bucketSum;
    const fromFields =
      pickNum(o, "totalItems", "total_items") ||
      pickNum(o, "totalElements", "total_elements") ||
      pickNum(o, "totalCount", "total_count") ||
      pickNum(o, "completedTrips", "completed_trips") ||
      pickNum(o, "totalCompletedTrips", "total_completed_trips") ||
      pickNum(o, "count", "count") ||
      pickNum(o, "total", "total") ||
      pickNum(o, "totalOnboardedVehicles", "total_onboarded_vehicles");
    if (fromFields) return fromFields;
  }
  return 0;
}

function extractEarningsTotal(payload: unknown): number {
  const body = getInnerData(payload);
  if (typeof body === "number" && Number.isFinite(body)) return body;
  if (body && typeof body === "object" && !Array.isArray(body)) {
    const o = body as Record<string, unknown>;
    const direct =
      pickNum(o, "totalRevenue", "total_revenue") ||
      pickNum(o, "totalEarnings", "total_earnings") ||
      pickNum(o, "totalAmount", "total_amount");
    if (direct) return direct;
    const earningItems = o.hostEarningItems ?? o.host_earning_items;
    if (Array.isArray(earningItems)) {
      const summed = earningItems.reduce((sum, row) => {
        const r = row as Record<string, unknown>;
        return sum + pickNum(r, "amountPaid", "amount_paid");
      }, 0);
      if (summed > 0) return summed;
    }
    const content = o.content ?? o.items;
    if (Array.isArray(content)) {
      return content.reduce((sum, row) => {
        const r = row as Record<string, unknown>;
        return (
          sum +
          pickNum(r, "amount", "amount") +
          pickNum(r, "totalAmount", "total_amount") +
          pickNum(r, "earning", "earning") +
          pickNum(r, "revenue", "revenue")
        );
      }, 0);
    }
  }
  if (Array.isArray(body)) {
    return body.reduce((sum, row) => {
      const r = row as Record<string, unknown>;
      return (
        sum +
        pickNum(r, "amount", "amount") +
        pickNum(r, "totalAmount", "total_amount")
      );
    }, 0);
  }
  return 0;
}

function extractPendingBalance(payload: unknown): number {
  const body = getInnerData(payload);
  if (typeof body === "number" && Number.isFinite(body)) return body;
  if (body && typeof body === "object" && !Array.isArray(body)) {
    const o = body as Record<string, unknown>;
    const direct =
      pickNum(o, "totalAmountToPay", "total_amount_to_pay") ||
      pickNum(o, "totalAmountHostHaveMade", "total_amount_host_have_made") ||
      pickNum(o, "pendingBalance", "pending_balance") ||
      pickNum(o, "walletBalance", "wallet_balance") ||
      pickNum(o, "balance", "balance") ||
      pickNum(o, "amount", "amount") ||
      pickNum(o, "totalPaidToHost", "total_paid_to_host");
    if (direct) return direct;
  }
  return 0;
}

function normalizeTopRated(payload: unknown): TopRatedVehicleType | null {
  let body: unknown = payload;
  if (payload && typeof payload === "object" && "data" in payload) {
    body = (payload as Record<string, unknown>).data;
  }
  if (Array.isArray(body)) {
    if (body.length === 0) return null;
    body = body[0];
  }
  if (!body || typeof body !== "object") return null;
  const v = body as Record<string, unknown>;
  const vehicle =
    v.vehicle && typeof v.vehicle === "object"
      ? (v.vehicle as Record<string, unknown>)
      : v;
  if (Object.keys(vehicle).length === 0) return null;
  return {
    make: String(vehicle.make ?? ""),
    model: String(vehicle.model ?? ""),
    year: String(vehicle.year ?? ""),
    color: String(vehicle.color ?? vehicle.colour ?? ""),
    seatingCapacity: String(
      vehicle.seatingCapacity ??
        vehicle.seating_capacity ??
        vehicle.numberOfSeats ??
        ""
    ),
    totalRides: String(vehicle.totalRides ?? vehicle.total_rides ?? ""),
    totalEarnings: String(vehicle.totalEarnings ?? vehicle.total_earnings ?? ""),
  };
}

async function fetchHostPerformanceDashboard(
  http: ReturnType<typeof useHttp>
): Promise<DashboardStatistics> {
  const settled = await Promise.allSettled([
    http.get<unknown>(HOST_PERF.onboardedVehicle),
    http.get<unknown>(HOST_PERF.completedTrip),
    http.get<unknown>(HOST_PERF.earningHistory),
    http.get<unknown>(HOST_PERF.pendingBalance),
    http.get<unknown>(HOST_PERF.topRated),
  ]);

  const fulfilled = settled.filter((s) => s.status === "fulfilled").length;
  if (fulfilled === 0) {
    const firstReject = settled.find((s) => s.status === "rejected") as
      | PromiseRejectedResult
      | undefined;
    throw firstReject?.reason ?? new Error("Host performance requests failed");
  }

  const onboarded =
    settled[0].status === "fulfilled"
      ? extractCount(settled[0].value)
      : 0;
  const completed =
    settled[1].status === "fulfilled"
      ? extractCount(settled[1].value)
      : 0;
  const earnings =
    settled[2].status === "fulfilled"
      ? extractEarningsTotal(settled[2].value)
      : 0;
  const wallet =
    settled[3].status === "fulfilled"
      ? extractPendingBalance(settled[3].value)
      : 0;
  const topRated =
    settled[4].status === "fulfilled"
      ? normalizeTopRated(settled[4].value)
      : null;

  const stats: DashboardStatistics = {
    totalOnboardedVehicles: onboarded,
    totalCompletedRides: completed,
    totalEarnings: earnings,
    walletBalance: wallet,
    topRatedVehicle: topRated,
  };

  return stats;
}

export default function useDashboardStats() {
  const http = useHttp();
  const { user } = useAppSelector((state) => state.user);

  const { data, isError, isLoading, error } = useQuery({
    queryKey: ["getDashboardStats", user?.data.userId],
    queryFn: () => fetchHostPerformanceDashboard(http),
    enabled: !!user?.data.userId,
    retry: false,
  });

  return {
    isError,
    isLoading,
    error,
    dashboardStats: data,
  };
}
