import { useHttp } from "@/hooks/useHttp";
import { handleErrors } from "@/utils/functions";
import { BookingInformation, ErrorResponse } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useState } from "react";
import { toast } from "react-toastify";

export default function useBookingActions({ id }: { id?: string }) {
  const http = useHttp();
  const queryClient = useQueryClient();

  // =============== decline a booking =============== //
  const [openDeclineModal, setOpenDeclineModal] = useState<boolean>(false);
  const handleDeclineModal = () => {
    setOpenDeclineModal(!openDeclineModal);
  };
  const declineBooking = useMutation({
    mutationFn: () =>
      http.put<BookingInformation>(`/api/bookings/updateStatus/${id}`, {
        status: "CANCELLED",
      }),
    onSuccess: (data) => {
      console.log("Decline Bookings successful", data);
      queryClient.setQueryData(["getBookingById", id], () => data);

      queryClient.invalidateQueries({
        queryKey: ["getBookings"],
      });
      queryClient.invalidateQueries({
        queryKey: ["getUpcomingBookings"],
      });
      toast.error("Trip Declined Successfully");
      setOpenDeclineModal(false);
    },
    onError: (error: AxiosError<ErrorResponse>) =>
      handleErrors(error, "Decline Listing"),
  });

  // =============== report a booking =============== //
  const [report, setReport] = useState<string>("");
  const [openReportModal, setOpenReportModal] = useState<boolean>(false);
  const handleReportModal = () => {
    setOpenReportModal(!openReportModal);
  };
  const reportBooking = useMutation({
    mutationFn: (values: { message: string }) =>
      http.post<BookingInformation>(`/api/report-trip/booking`, {
        ...values,
        bookingId: id,
      }),

    onSuccess: (data) => {
      console.log("Report Bookings successful", data);
      queryClient.setQueryData(["getBookingById", id], () => data);

      queryClient.invalidateQueries({
        queryKey: ["getBookings"],
      });
      queryClient.invalidateQueries({
        queryKey: ["getUpcomingBookings"],
      });

      toast.success("Trip Reported Successfully");
      setOpenReportModal(false);
    },

    onError: (error: AxiosError<ErrorResponse>) =>
      handleErrors(error, "Report Bookings"),
  });

  // =============== accept a booking =============== //
  const [openAcceptModal, setOpenAcceptModal] = useState<boolean>(false);
  const handleAcceptModal = () => {
    setOpenAcceptModal(!openAcceptModal);
  };
  const acceptBooking = useMutation({
    mutationFn: () =>
      http.put<BookingInformation>(`/api/bookings/updateStatus/${id}`, {
        status: "APPROVED",
      }),

    onSuccess: (data) => {
      console.log("Accept Bookings successful", data);
      queryClient.setQueryData(["getBookingById", id], () => data);

      queryClient.invalidateQueries({
        queryKey: ["getBookings"],
      });
      queryClient.invalidateQueries({
        queryKey: ["getUpcomingBookings"],
      });

      toast.success("Trip Accepted Successfully");
      setOpenAcceptModal(false);
    },

    onError: (error: AxiosError<ErrorResponse>) =>
      handleErrors(error, "Accept Listing"),
  });

  return {
    declineBooking,
    acceptBooking,
    reportBooking,

    openReportModal,
    handleReportModal,
    report,
    setReport,

    openAcceptModal,
    handleAcceptModal,

    openDeclineModal,
    handleDeclineModal,
  };
}
