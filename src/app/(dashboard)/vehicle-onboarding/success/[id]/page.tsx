"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/ui";

export default function VehicleOnboardingSuccessPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [vehicleName, setVehicleName] = useState("vehicle");
  const vehicleId = params.id;

  useEffect(() => {
    if (!vehicleId) {
      router.push("/vehicle-onboarding");
      return;
    }

    const storedName = sessionStorage.getItem("submittedVehicleName");
    if (storedName) {
      setVehicleName(storedName);
    }
  }, [vehicleId, router]);

  return (
    <main className="p-8 min-h-screen h-full w-full flex items-center justify-center">
      <div className="space-y-12 flex flex-col items-center text-center max-w-2xl">
        <Image
          src="/icons/success_confetti.png"
          alt=""
          height={100}
          width={100}
        />
        <h2 className="text-h5 md:text-h3 3xl:text-4xl">
          Your {vehicleName} has been submitted for review
        </h2>
        <p className="text-base text-grey-600 max-w-lg">
          We&apos;ve received your listing. Our team will review it and notify you once
          it&apos;s approved.
        </p>
        <div className="flex flex-col sm:flex-row gap-[18px]">
          <Link href={vehicleId ? `/listings/${vehicleId}` : "/listings"}>
            <Button variant="outlined" className="px-6">
              View Listing
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="filled" color="primary" className="px-6">
              Go to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
