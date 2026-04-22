import { useMemo } from "react";
import { useHostPerformance } from "./useHostPerformance";

export function useHostDashboardStats() {
  const {
    useGetCompletedTrip,
    useGetEarningHistory,
    useGetOnboardedVehicle,
    useGetTopRated,
  } = useHostPerformance();

  const completedTripsQuery = useGetCompletedTrip({ page: 0, size: 100 });
  const earningHistoryQuery = useGetEarningHistory({ page: 0, size: 100 });
  const onboardedVehiclesQuery = useGetOnboardedVehicle({ page: 0, size: 100 });
  const topRatedQuery = useGetTopRated({ page: 0, size: 5 });

  const isLoading =
    completedTripsQuery.isLoading ||
    earningHistoryQuery.isLoading ||
    onboardedVehiclesQuery.isLoading ||
    topRatedQuery.isLoading;

  const isError =
    completedTripsQuery.isError ||
    earningHistoryQuery.isError ||
    onboardedVehiclesQuery.isError ||
    topRatedQuery.isError;

  const dashboardStats = useMemo(() => {
    if (isLoading || isError) {
      console.log("trigger");
      return {
        totalEarnings: 0,
        totalCompletedRides: 0,
        totalOnboardedVehicles: 0,
        topRatedVehicle: null,
        walletBalance: 0,
      };
    }

    const totalEarnings = earningHistoryQuery.data?.data?.totalEarnings || 0;
    const totalCompletedRides = completedTripsQuery.data?.data?.length || 0;
    const totalOnboardedVehicles =
      onboardedVehiclesQuery.data?.data?.totalVehicles || 0;
    const topRatedVehicle = topRatedQuery.data?.data?.[0] || null;
    const walletBalance = totalEarnings;

    return {
      totalEarnings,
      totalCompletedRides,
      totalOnboardedVehicles,
      topRatedVehicle,
      walletBalance,
    };
  }, [
    isLoading,
    isError,
    earningHistoryQuery.data,
    completedTripsQuery.data,
    onboardedVehiclesQuery.data,
    topRatedQuery.data,
  ]);

  return {
    dashboardStats,
    isLoading,
    isError,
    refetch: () => {
      completedTripsQuery.refetch();
      earningHistoryQuery.refetch();
      onboardedVehiclesQuery.refetch();
      topRatedQuery.refetch();
    },
  };
}
