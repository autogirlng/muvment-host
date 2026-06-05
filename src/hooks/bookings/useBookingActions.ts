import { useHttp } from "@/hooks/useHttp";
import { handleErrors } from "@/utils/functions";
import { ErrorResponse } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useState } from "react";
import { toast } from "react-toastify";
import type { CreateComplaintPayload } from "@/hooks/complaints/types";

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
    mutationFn: (values: { message: string }) => {
      const description = values.message.trim();
      const payload: CreateComplaintPayload = {
        title: invoiceNumber
          ? `Booking report — ${invoiceNumber}`
          : "Booking report",
        description,
        type: "COMPLAINT",
      };
      if (invoiceNumber?.trim()) {
        payload.invoiceNumber = invoiceNumber.trim();
      }
      return http.post("/complaints", payload);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getBookingById", id] });
      queryClient.invalidateQueries({ queryKey: ["host", "complaints"] });
      queryClient.invalidateQueries({ queryKey: ["getBookings"] });
      queryClient.invalidateQueries({ queryKey: ["getUpcomingBookings"] });

      toast.success("Report submitted successfully");
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
