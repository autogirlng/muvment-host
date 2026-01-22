"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { PaymentBadge, Popup, FullPageSpinner, Icons } from "@/ui";
import BackLink from "@/components/BackLink";
import useBookingActions from "@/hooks/bookings/useBookingActions";
import useGetBookingById from "@/hooks/bookings/useGetBookingById";
import BookingInfoCards from "@/components/Bookings/BookingInfoCards";
import BookingActions from "@/components/Bookings/BookingActions";
import {
  BookingBadgeStatus,
  MappedInformation,
  PaymentBadgeStatus,
} from "@/types";

export default function BookingDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();

  const {
    isError,
    isLoading,
    bookingDetail,
    vehicleDetails,
    bookingDates,
    contactInformation,
  } = useGetBookingById({ id: params.id });

  const {
    openReportModal,
    handleReportModal,
    reportBooking,
    report,
    setReport,

    openAcceptModal,
    handleAcceptModal,
    acceptBooking,

    openDeclineModal,
    handleDeclineModal,
    declineBooking,
  } = useBookingActions({ id: params.id });

  useEffect(() => {
    if (!params.id) {
      router.push("/bookings");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  if (isLoading) {
    return <FullPageSpinner />;
  }

  if (isError) {
    return <p>something went wrong </p>;
  }

  return (
    <main className="py-14 space-y-[46px]">
      <BackLink backLink="/bookings" />
      <div className="space-y-14">
        {/* booking info */}
        <div className="flex items-start justify-between">
          <BookingInfoCards
            title="BOOKING INFORMATION"
            chipTitle="Booking Dates"
            chipData={bookingDates as MappedInformation[]}
            nameTitle="Booking ID"
            nameValue={bookingDetail?.data.bookingId || ""}
            copyText={bookingDetail?.data.bookingId || ""}
            status={bookingDetail?.data.bookingStatus || ""}
          >
            <div className="flex items-center gap-8">
              <div className="space-y-2">
                <p className="text-grey-500 text-sm 3xl:text-base">Amount</p>
                <p className="text-primary-500 text-4xl 3xl:text-h2">
                  {`NGN ${bookingDetail?.data.totalPrice}`}
                </p>
              </div>
              {/* <div className="space-y-2">
                <p className="text-grey-500 text-sm 3xl:text-base">
                  Payment Status
                </p>
                <p className="text-primary-500 text-4xl 3xl:text-h2">
                  <PaymentBadge
                    status={
                      bookingDetail?.paymentStatus.toLocaleLowerCase() as PaymentBadgeStatus
                    }
                  />
                </p>
              </div> */}
            </div>
          </BookingInfoCards>
          <div className="block lg:hidden">
            <Popup
              className="!w-[150px]"
              trigger={
                <button
                  className={
                    "block border border-grey-200 bg-white text-black rounded-lg p-2 w-fit mx-auto"
                  }
                >
                  {Icons.ic_more}
                </button>
              }
              content={
                <BookingActions
                  bookingStatus={
                    bookingDetail?.data.bookingStatus as BookingBadgeStatus
                  }
                  openReportModal={openReportModal}
                  handleReportModal={handleReportModal}
                  handleReportTrip={() =>
                    reportBooking.mutate({ message: report })
                  }
                  setReport={setReport}
                  isLoadingReportTrip={reportBooking.isPending}
                  handleAcceptTrip={() => acceptBooking.mutate()}
                  openAcceptModal={openAcceptModal}
                  handleAcceptModal={handleAcceptModal}
                  isLoadingAcceptTrip={acceptBooking.isPending}
                  openDeclineModal={openDeclineModal}
                  handleDeclineModal={handleDeclineModal}
                  handleDeclineTrip={() => declineBooking.mutate()}
                  isLoadingDeclineTrip={declineBooking.isPending}
                />
              }
            />
          </div>
          <div className="hidden lg:block">
            <BookingActions
              bookingStatus={bookingDetail?.data.bookingStatus as BookingBadgeStatus}
              openReportModal={openReportModal}
              handleReportModal={handleReportModal}
              handleReportTrip={() => reportBooking.mutate({ message: report })}
              setReport={setReport}
              isLoadingReportTrip={reportBooking.isPending}
              handleAcceptTrip={() => acceptBooking.mutate()}
              openAcceptModal={openAcceptModal}
              handleAcceptModal={handleAcceptModal}
              isLoadingAcceptTrip={acceptBooking.isPending}
              openDeclineModal={openDeclineModal}
              handleDeclineModal={handleDeclineModal}
              handleDeclineTrip={() => declineBooking.mutate()}
              isLoadingDeclineTrip={declineBooking.isPending}
            />
          </div>
        </div>
        {/* guest info */}
        <BookingInfoCards
          title="GUEST INFORMATION"
          chipTitle="Contact Information"
          chipData={contactInformation as MappedInformation[]}
          nameTitle="Guest Name"
          nameValue={bookingDetail?.data.booker.fullName || ""}
        />

        {/* vehicle info */}
        <BookingInfoCards
          title="VEHICLE INFORMATION"
          chipTitle="Vehicle Details"
          chipData={vehicleDetails as MappedInformation[]}
          nameTitle="Vehicle Requested"
          nameValue={bookingDetail?.data.vehicle.name || ""}
          link={`/listings/${bookingDetail?.data.vehicle.id}`}
          linkText="View Vehicle"
        />
      </div>
    </main>
  );
}
