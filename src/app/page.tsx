"use client";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useHttp } from "@/hooks/useHttp";
import { DesktopNav } from "@/components/Navbar";
import { User } from "@/types";
// import Benefits from "@/components/LandingPageComponents/Benefits";
// import Calculator from "@/components/LandingPageComponents/Calculator";
// import Footer from "@/components/LandingPageComponents/Footer";
// import Hero from "@/components/LandingPageComponents/Hero";
// import JoinUs from "@/components/LandingPageComponents/JoinUs";
// import Overview from "@/components/LandingPageComponents/Overview";
// import Steps from "@/components/LandingPageComponents/Steps";
// import VehicleOptions from "@/components/LandingPageComponents/VehicleOptions";
// import VehiclePackages from "@/components/LandingPageComponents/VehiclePackages";
// import GetStarted from "@/components/LandingPageComponents/GetStarted";
// import MobileNav from "@/components/Navbar/MobileNav";

import Link from "next/link";
import Button from "@/ui/button";





export default function HomePage() {
  const http = useHttp();
  const [userToken, setUserToken] = useState<string>("");

  useEffect(() => {
    const token = window.localStorage.getItem("user_token");
    setUserToken(token || "");
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
      <div className="flex min-h-screen items-center justify-center bg-red text-white text-4xl font-bold">
        Tailwind is working! 🚀
      </div>
      <section className="bg-grey-75 h-full flex relative">
        <div className="flex flex-col md:flex-row items-center justify-center h-full w-full md:w-1/2">
          <div className="w-full max-w-[550px] 3xl:max-w-[650px] text-grey-900 text-center md:text-left space-y-6 md:space-y-[38px] px-7 md:px-10 pt-20 md:pt-[160px] 3xl:pt-[218px] pb-10 md:pb-[200px] 3xl:pb-[302px]">
            <h1 className="text-h3 sm:text-h2 3xl:text-h1">
              Start Earning With Muvment Today
            </h1>
            <p className="text-sm sm:text-base 3xl:text-h6">
              Join our community of successful hosts and experience a new way to
              earn extra income effortlessly.
            </p>
            <div className="flex flex-col md:flex-row gap-6 items-center max-w-[220px] md:max-w-fit mx-auto md:mx-0">
              <Link href="/signup" className="!w-full md:!w-fit">
                <Button
                  color="primary"
                  variant="filled"
                  radius="lg"
                  className="!w-full md:!w-fit"
                >
                  Sign Up
                </Button>
              </Link>
              <Link href="/#calculator" className="!w-full md:!w-fit">
                <Button
                  color="transparent"
                  variant="outlined"
                  radius="lg"
                  className="!w-full md:!w-fit"
                >
                  Calculate earnings
                </Button>
              </Link>
            </div>
          </div>
          <div className="w-full h-[345px] sm:h-[480px] md:h-full md:w-1/2 md:absolute right-0 top-0">
            {/* <Image
              src="/images/landing/hero.png"
              alt=""
              width={884}
              height={910}
              className=" object-cover h-full w-full"
            /> */}
          </div>
        </div>
      </section>
      {/* <MobileNav user={data ?? null} userToken={userToken} />
      <Hero />
      <Benefits />
      <JoinUs />
      <Steps />
      <VehicleOptions />
      <Calculator />
      <VehiclePackages />
      <Overview />
      <GetStarted />
      <Footer /> */}
    </main>
  );
}
