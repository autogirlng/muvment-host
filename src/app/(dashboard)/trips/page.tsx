"use client";

import dynamic from "next/dynamic";

const Trips = dynamic(() => import("@/components/Trips"), { ssr: false });

export default function TripsPage() {
    return (
        <main className="py-[56px]">
            <Trips />
        </main>
    );
}
