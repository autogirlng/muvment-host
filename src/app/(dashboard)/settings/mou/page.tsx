"use client";

import MouDetails from "@/components/Mou/MouDetails";
import BackLink from "@/components/BackLink";

export default function MouSettingsPage() {
  return (
    <main className="space-y-10 2xl:space-y-[52px] py-[56px]">
      <BackLink backLink="/settings" />
      <MouDetails />
    </main>
  );
}
