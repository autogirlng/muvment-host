"use client";

import PageHero from "@/components/DashBoard/PageHero";
import { useAppSelector } from "@/lib/hooks";

export default function BookingAnalyticsHeader() {
  const { user } = useAppSelector((state) => state.user);

  return (
    <PageHero
      firstName={user?.data?.firstName || "Host"}
      subtitle="Booking Analytics"
      imageSrc="/images/dashboard/bookings-analytics-hero.png"
    />
  );
}
