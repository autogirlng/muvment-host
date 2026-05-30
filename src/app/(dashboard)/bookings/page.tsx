"use client";
import dynamic from "next/dynamic";

// Dynamically import components that may use window
const Bookings = dynamic(() => import("@/components/Bookings"), {
  ssr: false,
});

export default function BookingsPage() {
  return (
    <main className="space-y-5 pb-4 sm:space-y-6 sm:pb-6 lg:space-y-8 lg:pb-8">
      <Bookings />
    </main>
  );
}
