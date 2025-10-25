import { ReactNode, Dispatch, SetStateAction } from "react";
import { BookingBadgeStatus, MappedInformation } from "@/types";

export interface BookingInfoCardsProps  {
    title: string;
    chipTitle: string;
    chipData: MappedInformation[];
    nameTitle: string;
    nameValue: string;
    link?: string;
    linkText?: string;
    copyText?: string;
    children?: ReactNode;
    status?: BookingBadgeStatus;
};

export interface PopupContentProps {
    handleAction: () => void;
    // openModal: boolean;
    handleModal: (value?: boolean) => void;
    isLoading: boolean;
};

export interface AcceptTripProps {
    handleAction: () => void;
    openModal: boolean;
    handleModal: (value?: boolean) => void;
    trigger: ReactNode;
    isLoading: boolean;
};

export interface DeclineTripProps  {
  handleAction: () => void;
  openModal: boolean;
  handleModal: (value?: boolean) => void;
  trigger: ReactNode;
  isLoading: boolean;
};

export interface PopupContentProps  {
  handleAction: () => void;
  handleModal: (value?: boolean) => void;
  isLoading: boolean;
};

export interface ReportTripProps  {
  handleAction: ({ message }: { message: string }) => void;
  openModal: boolean;
  handleModal: (value?: boolean) => void;
  trigger: ReactNode;
  isLoading: boolean;
  setReport: Dispatch<SetStateAction<string>>;
};

export interface PopupProps  {
    handleAction: ({ message }: { message: string }) => void;
    // openModal: boolean;
    handleModal: (value?: boolean) => void;
    isLoading: boolean;
    setReport: Dispatch<SetStateAction<string>>;
};


export interface BookingActionsProps  {
    bookingStatus: BookingBadgeStatus;

    openReportModal: boolean;
    handleReportModal: () => void;
    handleReportTrip: () => void;
    isLoadingReportTrip: boolean;
    setReport: Dispatch<SetStateAction<string>>;

    openAcceptModal: boolean;
    handleAcceptModal: () => void;
    handleAcceptTrip: () => void;
    isLoadingAcceptTrip: boolean;

    openDeclineModal: boolean;
    handleDeclineModal: () => void;
    handleDeclineTrip: () => void;
    isLoadingDeclineTrip: boolean;
};

export type BookingHistoryProps = { search?: string; filters?: Record<string, string[]> };




