"use client";

import dynamic from "next/dynamic";
import BackLink from "@/components/BackLink";
import { FullPageSpinner } from "@/ui";

const Complaints = dynamic(() => import("@/components/Settings/Complaints"), {
  ssr: false,
  loading: () => <FullPageSpinner />,
});

export default function ComplaintsPage() {
  return (
    <main className="py-[56px]">
      <BackLink backLink="/settings" />
      <div className="mt-8">
        <Complaints />
      </div>
    </main>
  );
}
