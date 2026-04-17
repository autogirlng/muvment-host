"use client";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { User } from "@/types";
import { useHttp } from "@/hooks/useHttp";
import { DesktopNav, MobileNav } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  Benefits,
  VehiclePackages,
  Hero,
  JoinUs,
  Steps,
  VehicleOptions,
  Calculator,
  Overview,
  GetStarted
} from "@/components/LandingPage";
import { ElectricalVehicleHero } from "@/components/LandingPage/ElectricVehicleHero";


export default function HomePage() {
  const http = useHttp();
  const { data: session } = useSession();
  const userToken = session?.user?.accessToken || "";

  const { data } = useQuery({
    queryKey: ["getUser"],
    queryFn: () => http.get<User>(`/api/user`),
    enabled: !!userToken,
    retry: false,
  });

  return (
    <main className="overflow-x-hidden">
      <DesktopNav user={data ?? null} userToken={userToken} />
      <MobileNav user={data ?? null} userToken={userToken} />
      <Hero />
      <ElectricalVehicleHero />
      <Benefits />
      <JoinUs />
      <Steps />
      <VehicleOptions />
      <Calculator />
      <VehiclePackages />
      <Overview />
      <GetStarted />
      <Footer />

    </main>
  );
}
