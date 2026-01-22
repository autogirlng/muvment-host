import React from "react";
import ActivityCard from "@/components/ActivityCard";
import TopRatedVehicle from "@/components/AccountActivity/TopRatedVehicle";
import DashboardSectionTitle from "@/components/DashBoard/SectionTitle";
import { Icons } from "@/ui";
import useDashboardStats from "@/hooks/useHostStats";


export default function AccountActivity() {
    const { isError, isLoading, dashboardStats } = useDashboardStats();
    console.log(dashboardStats)

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
                        value={`${dashboardStats?.totalEarnings || "-"}`}
                        modalTitle={"Show Graph"}
                        modalName="graph"
                        modalIcon={Icons.ic_chart}
                        isLoading={isLoading}
                    />
                    <ActivityCard
                        title="Total onboarded vehicles"
                        value={`${dashboardStats?.totalOnboardedVehicles || "-"}`}
                        isLoading={isLoading}
                    />
                    <ActivityCard
                        title="Total Completed Rides"
                        value={`${dashboardStats?.totalOnboardedVehicles || "-"}`}
                        // modalTitle={
                        //   dashboardStats?.totalCompletedRides ? "Show Reviews" : ""
                        // }
                        modalTitle={"Show Reviews"}
                        modalName="review"
                        modalIcon={Icons.ic_star_square}
                        isLoading={isLoading}
                    />
                    <ActivityCard
                        title="Total Wallet Balance"
                        modalName="balance"
                        value={`${dashboardStats?.walletBalance || "-"}`}
                        isLoading={isLoading}
                    />
                </div>
                <TopRatedVehicle
                    topRatedVehicle={dashboardStats?.topRatedVehicle || null}
                    isLoading={isLoading}
                />
            </div>
        </div>
    );
}
