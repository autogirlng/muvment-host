"use client";
import useUser from "@/hooks/useUser";
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
  const { getUser, session } = useUser();
  const userToken = session?.user?.accessToken || "";

  return (
    <main className="overflow-x-hidden">
      <DesktopNav user={getUser.data ?? null} userToken={userToken} />
      <MobileNav user={getUser.data ?? null} userToken={userToken} />
      <Hero isLoggedIn={!!userToken} />
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
