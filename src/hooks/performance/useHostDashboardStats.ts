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

  const dashboardStats = useMemo(() => {
    // Safely extract the data directly based on your API types
    const totalEarnings = Number(earningHistoryQuery.data?.data?.totalEarnings || 0);
    
    // Fallbacks for the other arrays depending on how the backend sends them
    const totalCompletedRides = completedTripsQuery.data?.data?.length || 0;
    const totalOnboardedVehicles = onboardedVehiclesQuery.data?.data?.totalVehicles || 0;
    const topRatedVehicle = Array.isArray(topRatedQuery.data?.data) 
      ? topRatedQuery.data?.data[0] 
      : null;

    return {
      totalEarnings,
      totalCompletedRides,
      totalOnboardedVehicles,
      topRatedVehicle,
      walletBalance: totalEarnings, // Ensure wallet balance matches earnings
    };
  }, [
    earningHistoryQuery.data,
    completedTripsQuery.data,
    onboardedVehiclesQuery.data,
    topRatedQuery.data,
  ]);

  return {
    dashboardStats,
    // Bulletproof loading states: If we have the number, it is NOT loading. Period.
    loadingStates: {
      earnings: dashboardStats.totalEarnings === 0 && earningHistoryQuery.isPending,
      trips: dashboardStats.totalCompletedRides === 0 && completedTripsQuery.isPending,
      vehicles: dashboardStats.totalOnboardedVehicles === 0 && onboardedVehiclesQuery.isPending,
      topRated: !dashboardStats.topRatedVehicle && topRatedQuery.isPending,
    },
    errorStates: {
      earnings: earningHistoryQuery.isError,
      trips: completedTripsQuery.isError,
      vehicles: onboardedVehiclesQuery.isError,
      topRated: topRatedQuery.isError,
    },
    refetch: () => {
      completedTripsQuery.refetch();
      earningHistoryQuery.refetch();
      onboardedVehiclesQuery.refetch();
      topRatedQuery.refetch();
    },
  };
}