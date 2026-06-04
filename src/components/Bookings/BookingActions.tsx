import { forwardRef, ReactNode } from "react";
import { BookingBadgeStatus } from "@/types";
import DeclineTrip from "@/components/Bookings/modals/DeclineTrip";
import ReportTrip from "@/components/Bookings/modals/ReportTrip";
import { TableActionButton } from "@/components/Table/TableActionButton";
import { Icons } from "@/ui";
import AcceptTrip from "@/components/Bookings/modals/AcceptTrip";
import { BookingActionsProps } from "./props";

const BookingActions = ({
    bookingStatus,

    openReportModal,
    handleReportModal,
    handleReportTrip,
    isLoadingReportTrip,
    setReport,

    handleAcceptTrip,
    openAcceptModal,
    handleAcceptModal,
    isLoadingAcceptTrip,

    openDeclineModal,
    handleDeclineModal,
    handleDeclineTrip,
    isLoadingDeclineTrip,
}: BookingActionsProps) => {
    return (
        <div className="flex flex-col items-start gap-2 lg:flex-row lg:items-center">
            <AcceptTrip
                trigger={
                    <TableActionButton
                        variant="success"
                        text={
                            bookingStatus === BookingBadgeStatus.APPROVED
                                ? "Accepted"
                                : "Accept"
                        }
                        icon={Icons.ic_done_circle}
                        disabled={bookingStatus === BookingBadgeStatus.APPROVED}
                    />
                }
                handleAction={handleAcceptTrip}
                openModal={openAcceptModal}
                handleModal={handleAcceptModal}
                isLoading={isLoadingAcceptTrip}
            />

            <DeclineTrip
                trigger={
                    <TableActionButton
                        variant="danger"
                        text="Decline"
                        icon={Icons.ic_cancel_circle}
                        disabled={bookingStatus === BookingBadgeStatus.CANCELLED}
                    />
                }
                openModal={openDeclineModal}
                handleModal={handleDeclineModal}
                handleAction={handleDeclineTrip}
                isLoading={isLoadingDeclineTrip}
            />

            <ReportTrip
                trigger={
                    <TableActionButton
                        variant="neutral"
                        text="Report"
                        icon={Icons.ic_info}
                    />
                }
                openModal={openReportModal}
                handleModal={handleReportModal}
                handleAction={handleReportTrip}
                isLoading={isLoadingReportTrip}
                setReport={setReport}
            />
        </div>
    );
};

type ActionButtonProps = {
    icon?: ReactNode;
    color: string;
    text: string;
    onClick?: () => void;
    disabled?: boolean;
};

/** @deprecated Use TableActionButton from @/components/Table */
const ActionButton = forwardRef<HTMLButtonElement, ActionButtonProps>(
    ({ icon, color, text, onClick, disabled = false }, ref) => {
        return (
            <button
                ref={ref}
                type="button"
                className={`inline-flex w-full items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-white lg:w-auto ${color}`}
                onClick={onClick}
                disabled={disabled}
            >
                {icon} <span>{text}</span>
            </button>
        );
    }
);
ActionButton.displayName = "ActionButton";

export default BookingActions;
export { TableActionButton };
