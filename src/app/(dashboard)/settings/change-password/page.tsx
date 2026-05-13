"use client";

import ChangePassword from "@/components/Settings/ChangePassword";
import BackLink from "@/components/BackLink";

export default function ChangePasswordPage() {
  return (
    <main className="space-y-10 2xl:space-y-[52px] py-[56px]">
      <BackLink backLink="/settings" />
      <ChangePassword />
    </main>
  );
}
