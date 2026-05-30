"use client";

import PageHero from "@/components/DashBoard/PageHero";
import { useAppSelector } from "@/lib/hooks";

export default function TripsHero() {
  const { user } = useAppSelector((state) => state.user);

  return (
    <PageHero
      firstName={user?.data?.firstName || "Host"}
      subtitle="Trips Overview"
      imageSrc="/images/dashboard/bookings-analytics-hero.png"
    />
  );
}
