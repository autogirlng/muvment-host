"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { User } from "@/utils/types";
import { useHttp } from "@/hooks/useHttp";
import { DesktopNav, MobileNav } from "@/components/Navbar";
import Hero from "@/components/LandingPage/Hero";
import { Benefits } from "@/components/LandingPage";
import JoinUs from "@/components/LandingPage/JoinUs";
import Steps from "@/components/LandingPage/Steps";
import VehicleOptions from "@/components/LandingPage/VehicleOptions";
import Calculator from "@/components/LandingPage/Calculator";
import { VehiclePackages } from "@/components/LandingPage/VehiclePackages";
import Overview from "@/components/LandingPage/Overview";
import GetStarted from "@/components/LandingPage/GetStarted";
import Footer from "@/components/LandingPage/Footer";

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
