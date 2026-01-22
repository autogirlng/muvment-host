"use client";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
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
  const [userToken, setUserToken] = useState<string>("");

  useEffect(() => {
    const user_token = window.localStorage.getItem("user_token");
    setUserToken(user_token || "");
  }, []);

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
