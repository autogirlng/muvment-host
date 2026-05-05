"use client";
import dynamic from "next/dynamic";

// Dynamically import components that may use window
const Bookings = dynamic(() => import("@/components/Bookings"), {
  ssr: false,
});

export default function BookingsPage() {
  return (
    <main className="py-[56px]">
      <Bookings />
    </main>
  );
}
