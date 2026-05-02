// app/account-activity/index.tsx
import React from "react";
import ActivityCard from "@/components/ActivityCard";
import TopRatedVehicle from "@/components/AccountActivity/TopRatedVehicle";
import DashboardSectionTitle from "@/components/DashBoard/SectionTitle";
import { Icons } from "@/ui";
import { useHostDashboardStats } from "@/hooks/performance/useHostDashboardStats";

export default function AccountActivity() {
  const { dashboardStats, isLoading, isError, refetch } =
    useHostDashboardStats();
  console.log(dashboardStats.totalEarnings);
  if (isError) {
    return (
      <div className="space-y-6 2xl:space-y-8">
        <DashboardSectionTitle
          icon={Icons.ic_activity}
          title="Account Activity"
        />
        <div className="text-red-500 text-center p-8">
          Error loading dashboard data.
          <button
            onClick={() => refetch()}
            className="ml-2 px-3 py-1 bg-blue-500 text-white rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 2xl:space-y-8">
      <DashboardSectionTitle
        icon={Icons.ic_activity}
        title="Account Activity"
      />
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-[18px]">
          <ActivityCard
            primary
            title="Total Earnings"
            value={isLoading ? "-" : `₦${dashboardStats.totalEarnings}`}
            modalTitle={"Show Graph"}
            modalName="graph"
            modalIcon={Icons.ic_chart}
            isLoading={isLoading}
          />
          <ActivityCard
            title="Total onboarded vehicles"
            value={isLoading ? "-" : dashboardStats.totalOnboardedVehicles}
            isLoading={isLoading}
          />
          <ActivityCard
            title="Total Completed Rides"
            value={isLoading ? "-" : dashboardStats.totalCompletedRides}
            modalTitle={"Show Reviews"}
            modalName="review"
            modalIcon={Icons.ic_star_square}
            isLoading={isLoading}
          />
          <ActivityCard
            title="Total Wallet Balance"
            modalName="balance"
            value={isLoading ? "-" : `₦${dashboardStats.walletBalance}`}
            isLoading={isLoading}
          />
        </div>
        <TopRatedVehicle
          topRatedVehicle={dashboardStats.topRatedVehicle as any}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
