"use client";

import { useState } from "react";
import { useAppSelector } from "@/lib/hooks";
import dynamic from "next/dynamic";
import HostRolePrompt from "@/components/Mou/HostRolePrompt";
import MouModal from "@/components/Mou/MouModal";
import DashboardHero from "@/components/DashBoard/DashboardHero";
import KycStepper from "@/components/DashBoard/KycStepper";

const AccountActivity = dynamic(
  () => import("@/components/AccountActivity/index"),
  {
    ssr: false,
  },
);
const BookingsOverview = dynamic(
  () => import("@/components/Bookings/BookingsOverview"),
  { ssr: false },
);

export default function DashboardPage() {
  const { user } = useAppSelector((state) => state.user);
  const [mouTrigger, setMouTrigger] = useState(0);

  const userData = user?.data as any;
  const role =
    userData?.userType ||
    userData?.role ||
    userData?.user_type ||
    (user as any)?.userType ||
    (user as any)?.role;
  const isHost = role === "HOST" || role === "host";

  return (
    <main className="space-y-5 pb-4 sm:space-y-6 sm:pb-6 lg:space-y-8 lg:pb-8">
      <HostRolePrompt />

      {isHost && (
        <>
          <MouModal trigger={mouTrigger} />
          <DashboardHero firstName={user?.data.firstName || "Host"} />
          <KycStepper onSignMou={() => setMouTrigger((t) => t + 1)} />
          <AccountActivity />
          <BookingsOverview />
        </>
      )}
    </main>
  );
}
