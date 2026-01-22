"use client";
import SectionTitle from "@/components/DashBoard/SectionTitle";
import { Icons } from "@/ui";
import dynamic from "next/dynamic";

// Dynamically import components that may use window
const Bookings = dynamic(() => import("@/components/Bookings"), {
  ssr: false,
});
const BookingsStats = dynamic(
  () => import("@/components/Bookings/BookingStats"),
  { ssr: false }
);

export default function BookingsPage() {
  return (
    <main className="py-8 2xl:py-11">
      <div className="space-y-10">
        {/* <SectionTitle
          title="Booking Analytics"
          icon={Icons.ic_activity}
        /> */}
        {/* <BookingsStats /> */}
      </div>
      <Bookings />
    </main>
  );
}
