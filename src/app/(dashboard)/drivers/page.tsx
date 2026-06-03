"use client";

import dynamic from "next/dynamic";
import { FullPageSpinner } from "@/ui";

const Drivers = dynamic(() => import("@/components/Drivers"), {
  ssr: false,
  loading: () => <FullPageSpinner />,
});

export default function DriversPage() {
  return (
    <main className="space-y-5 pb-4 sm:space-y-6 sm:pb-6 lg:space-y-8 lg:pb-8">
      <Drivers />
    </main>
  );
}
