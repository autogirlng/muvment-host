"use client";

import dynamic from "next/dynamic";

const Trips = dynamic(() => import("@/components/Trips"), { ssr: false });

export default function TripsPage() {
    return (
        <main className="space-y-5 pb-4 sm:space-y-6 sm:pb-6 lg:space-y-8 lg:pb-8">
            <Trips />
        </main>
    );
}
