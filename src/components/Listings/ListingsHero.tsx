"use client";

import PageHero from "@/components/DashBoard/PageHero";
import { useAppSelector } from "@/lib/hooks";

export default function ListingsHero() {
  const { user } = useAppSelector((state) => state.user);

  return (
    <PageHero
      firstName={user?.data?.firstName || "Host"}
      subtitle="Vehicle Listings"
      imageSrc="/images/dashboard/hero-banner.png"
    />
  );
}
