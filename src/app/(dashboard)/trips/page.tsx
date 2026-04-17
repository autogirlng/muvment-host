"use client";

import dynamic from "next/dynamic";
import DashboardInnerPage from "@/components/DashBoard/InnerPage";

const Trips = dynamic(() => import("@/components/Trips"), { ssr: false });

export default function TripsPage() {
    return (
        <DashboardInnerPage title="Trips">
            <Trips />
        </DashboardInnerPage>
    );
}
