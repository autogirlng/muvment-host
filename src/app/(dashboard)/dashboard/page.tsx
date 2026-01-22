"use client";
import { useAppSelector } from "@/lib/hooks";
import Link from "next/link";
import dynamic from "next/dynamic";

// Dynamically import components that may use window
const AccountActivity = dynamic(() => import("@/components/AccountActivity"), {
  ssr: false,
});
const BookingsOverview = dynamic(
  () => import("@/components/Bookings/BookingsOverview"),
  { ssr: false }
);

export default function DashboardPage() {
  const { user } = useAppSelector((state) => state.user);

  return (
    <main className="py-8 2xl:py-11 space-y-11 2xl:space-y-[68px]">
      {/* complete tasks component starts */}
      {/* {(!user?.withdrawalAccountVerified || !user?.phoneVerified) && ( */}
      {!(user?.data.phoneVerified) && (

        <div className="py-4 px-6 2xl:px-[33px] bg-warning-400 rounded-[32px] text-white space-y-[18px]">
          <div className="space-y-2">
            <h6 className="text-xl 2xl:text-h6 !font-bold">
              Complete Account Setup
            </h6>
            <p className="text-xs 2xl:text-sm">
              Please complete account setup to get full access to Muvment&apos;s
              functionalities
            </p>
          </div>
          <Link
            href="/account-setup"
            className="block w-fit text-sm 2xl:text-base text-white !font-semibold py-2 2xl:py-3 px-3 2xl:px-4 rounded-[63px] bg-warning-700 hover:text-warning-400 hover:bg-white"
          >
            View Tasks Left
          </Link>
        </div>
      )}

      <AccountActivity />
      <BookingsOverview />
    </main>
  );
}
