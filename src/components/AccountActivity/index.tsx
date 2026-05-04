import React from "react";
import ActivityCard from "@/components/ActivityCard";
import TopRatedVehicle from "@/components/AccountActivity/TopRatedVehicle";
import DashboardSectionTitle from "@/components/DashBoard/SectionTitle";
import { Icons } from "@/ui";
import { useHostDashboardStats } from "@/hooks/performance/useHostDashboardStats";

export default function AccountActivity() {
  const { dashboardStats, loadingStates, errorStates, refetch } = useHostDashboardStats();

  // THE ULTIMATE CHECK: Open your console and look for this green text!
  console.log("%c UI RENDER CHECK:", "color: #00ff00; font-weight: bold;", {
    earningsValue: dashboardStats.totalEarnings,
    isEarningsLoading: loadingStates.earnings,
    hasError: errorStates.earnings
  });

  return (
    <div className="space-y-6 2xl:space-y-8">
      <div className="flex items-center justify-between">
        <DashboardSectionTitle
          icon={Icons.ic_activity}
          title="Account Activity"
        />
        {(Object.values(errorStates).some(Boolean)) && (
           <button onClick={() => refetch()} className="text-xs text-primary-500 hover:underline">
             Retry failed data
           </button>
        )}
      </div>
      
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-[18px]">
          <ActivityCard
            primary
            title="Total Earnings"
            value={
              errorStates.earnings ? "Error" : 
              loadingStates.earnings ? "-" : 
              `₦${dashboardStats.totalEarnings.toLocaleString()}`
            }
            modalTitle={"Show Graph"}
            modalName="graph"
            modalIcon={Icons.ic_chart}
            isLoading={loadingStates.earnings}
          />
          <ActivityCard
            title="Total onboarded vehicles"
            value={
              errorStates.vehicles ? "Error" : 
              loadingStates.vehicles ? "-" : 
              dashboardStats.totalOnboardedVehicles
            }
            isLoading={loadingStates.vehicles}
          />
          <ActivityCard
            title="Total Completed Rides"
            value={
              errorStates.trips ? "Error" : 
              loadingStates.trips ? "-" : 
              dashboardStats.totalCompletedRides
            }
            modalTitle={"Show Reviews"}
            modalName="review"
            modalIcon={Icons.ic_star_square}
            isLoading={loadingStates.trips}
          />
          <ActivityCard
            title="Total Wallet Balance"
            modalName="balance"
            value={
              errorStates.earnings ? "Error" : 
              loadingStates.earnings ? "-" : 
              `₦${dashboardStats.walletBalance.toLocaleString()}`
            }
            isLoading={loadingStates.earnings}
          />
        </div>
        <TopRatedVehicle
          topRatedVehicle={dashboardStats.topRatedVehicle as any}
          isLoading={loadingStates.topRated}
        />
      </div>
    </div>
  );
}