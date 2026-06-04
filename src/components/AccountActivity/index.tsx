import React from "react";
import TopRatedVehicle from "@/components/AccountActivity/TopRatedVehicle";
import DashboardSectionTitle from "@/components/DashBoard/SectionTitle";
import DashboardStatCard from "@/components/DashBoard/DashboardStatCard";
import { Icons } from "@/ui";
import useDashboardStats from "@/hooks/useHostStats";

const DollarIcon = () => (
  <span className="text-sm font-bold leading-none text-white">$</span>
);

export default function AccountActivity() {
  const { isLoading, dashboardStats } = useDashboardStats();

  return (
    <section className="space-y-4 sm:space-y-5 lg:space-y-6">
      <DashboardSectionTitle icon={Icons.ic_activity} title="Account Activity" />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-7 xl:col-span-8">
          <DashboardStatCard
            title="Total Earnings"
            value={`${dashboardStats?.totalAmountHostHaveMade || "-"}`}
            icon={<DollarIcon />}
            iconTone="purple"
            valueTone="primary"
            isLoading={isLoading}
          />
          <DashboardStatCard
            title="Total onboarded vehicles"
            value={`${dashboardStats?.totalOnboardedVehicles || "-"}`}
            icon={Icons.ic_car}
            iconTone="green"
            isLoading={isLoading}
          />
          <DashboardStatCard
            title="Total Completed Rides"
            value={`${dashboardStats?.totalCompletedRides ?? "-"}`}
            icon={Icons.ic_wheel}
            iconTone="blue"
            isLoading={isLoading}
          />
          <DashboardStatCard
            title="Total Wallet Balance"
            modalName="balance"
            value={`${dashboardStats?.walletBalance || "-"}`}
            icon={Icons.ic_wallet}
            iconTone="orange"
            isLoading={isLoading}
          />
        </div>
        <div className="lg:col-span-5 xl:col-span-4">
          <TopRatedVehicle
            topRatedVehicle={dashboardStats?.topRatedVehicle || null}
            isLoading={isLoading}
          />
        </div>
      </div>
    </section>
  );
}
