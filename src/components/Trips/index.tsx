"use client";

import { AppTabs } from "@/ui";
import dynamic from "next/dynamic";

const UpcomingTrips = dynamic(
    () => import("@/components/Trips/UpcomingTrips"),
    { ssr: false }
);
const CompletedTrips = dynamic(
    () => import("@/components/Trips/CompletedTrips"),
    { ssr: false }
);

export default function Trips() {
    const tabs = [
        {
            name: "Upcoming Trips",
            value: "upcoming",
            content: <UpcomingTrips />,
        },
        {
            name: "Completed Trips",
            value: "completed",
            content: <CompletedTrips />,
        },
    ];

    return (
        <AppTabs
            label="trips tab"
            tabs={tabs}
            tabClass="flex-none"
            contentClass="bg-transparent !mt-10 !p-0"
        />
    );
}
