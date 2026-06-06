import { useHttp } from "@/hooks/useHttp";
import { handleErrors } from "@/utils/functions";
import { ErrorResponse } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useState } from "react";
import { toast } from "react-toastify";
import type { Complaint, CreateComplaintPayload } from "@/hooks/complaints/types";
import type { ApiResponse } from "@/types/trip";

export default function useBookingActions({
  id,
  invoiceNumber,
}: {
  id?: string;
  invoiceNumber?: string;
}) {
  const http = useHttp();
  const queryClient = useQueryClient();

  const [report, setReport] = useState<string>("");
  const [openReportModal, setOpenReportModal] = useState<boolean>(false);
  const handleReportModal = () => {
    setOpenReportModal(!openReportModal);
  };

  const reportBooking = useMutation({
    mutationFn: async (values: { message: string }) => {
      if (!id?.trim()) {
        throw new Error("Booking id is required");
      }

      const description = values.message.trim();
      const payload: CreateComplaintPayload = {
        title: invoiceNumber
          ? `Booking report — ${invoiceNumber}`
          : "Booking report",
        description,
        type: "COMPLAINT",
        complaintCause: "BOOKING",
        bookingId: id.trim(),
      };

      return http.post<ApiResponse<Complaint>>("/complaints", payload);
    },

    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["getBookingById", id] });
      queryClient.invalidateQueries({ queryKey: ["host", "complaints"] });
      queryClient.invalidateQueries({ queryKey: ["getBookings"] });
      queryClient.invalidateQueries({ queryKey: ["getUpcomingBookings"] });

      const invoiceId = response?.data?.invoiceId;
      toast.success(
        invoiceId
          ? `Report submitted successfully. Reference: ${invoiceId}`
          : "Report submitted successfully"
      );
      setReport("");
      setOpenReportModal(false);
    },

    onError: (error: AxiosError<ErrorResponse>) =>
      handleErrors(error, "Report booking"),
  });

  return {
    reportBooking,
    openReportModal,
    handleReportModal,
    report,
    setReport,
  };
}
