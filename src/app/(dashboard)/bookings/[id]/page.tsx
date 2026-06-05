"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect } from "react";

import { Popup, FullPageSpinner, Icons } from "@/ui";
import BackLink from "@/components/BackLink";
import useBookingActions from "@/hooks/bookings/useBookingActions";
import useGetBookingById from "@/hooks/bookings/useGetBookingById";
import BookingInfoCards from "@/components/Bookings/BookingInfoCards";
import BookingActions from "@/components/Bookings/BookingActions";
import BookingVehicleCard from "@/components/Bookings/BookingVehicleCard";
import BookingReviewSection from "@/components/Bookings/BookingReviewSection";
import { MappedInformation } from "@/types";

export default function BookingDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const {
    isError,
    isLoading,
    bookingDetail,
    vehicleInfo,
    isVehicleLoading,
    bookingDates,
    invoiceNumber,
    formattedTotalPrice,
  } = useGetBookingById({ id });

  const {
    openReportModal,
    handleReportModal,
    reportBooking,
    setReport,
  } = useBookingActions({ id, invoiceNumber });

  useEffect(() => {
    if (!id) {
      router.push("/bookings");
    }
  }, [id, router]);

  if (isLoading) {
    return <FullPageSpinner />;
  }

  if (isError) {
    return <p>something went wrong</p>;
  }

  const bookingStatus = bookingDetail?.data.bookingStatus || "";
  const bookingId = bookingDetail?.data.bookingId || id;
  const customerName = bookingDetail?.data.booker?.fullName;

  return (
    <main className="py-14 space-y-[46px]">
      <BackLink backLink="/bookings" />
      <div className="space-y-14">
        <div className="flex items-start justify-between gap-4">
          <BookingInfoCards
            title="BOOKING INFORMATION"
            chipTitle="Booking dates"
            chipData={bookingDates as unknown as MappedInformation[]}
            nameTitle="Invoice number"
            nameValue={invoiceNumber}
            copyText={invoiceNumber !== "—" ? invoiceNumber : undefined}
            status={bookingStatus}
          >
            <div className="flex items-center gap-8">
              <div className="space-y-2">
                <p className="text-grey-500 text-sm 3xl:text-base">Amount</p>
                <p className="text-primary-500 text-4xl 3xl:text-h2">
                  {formattedTotalPrice}
                </p>
              </div>
            </div>
          </BookingInfoCards>

          <div className="block lg:hidden">
            <Popup
              className="!w-[150px]"
              trigger={
                <button className="block border border-grey-200 bg-white text-black rounded-lg p-2 w-fit mx-auto">
                  {Icons.ic_more}
                </button>
              }
              content={
                <BookingActions
                  openReportModal={openReportModal}
                  handleReportModal={handleReportModal}
                  handleReportTrip={(values) => reportBooking.mutate(values)}
                  setReport={setReport}
                  isLoadingReportTrip={reportBooking.isPending}
                />
              }
            />
          </div>

          <div className="hidden lg:block">
            <BookingActions
              openReportModal={openReportModal}
              handleReportModal={handleReportModal}
              handleReportTrip={(values) => reportBooking.mutate(values)}
              setReport={setReport}
              isLoadingReportTrip={reportBooking.isPending}
            />
          </div>
        </div>

        <BookingVehicleCard
          vehicle={vehicleInfo}
          isLoadingDetails={isVehicleLoading}
        />

        <BookingReviewSection
          bookingId={bookingId}
          customerName={customerName}
        />
      </div>
    </main>
  );
}
