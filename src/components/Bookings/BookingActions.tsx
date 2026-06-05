import { Dispatch, SetStateAction } from "react";
import { BookingBadgeStatus } from "@/types";
import ReportTrip from "@/components/Bookings/modals/ReportTrip";
import { TableActionButton } from "@/components/Table/TableActionButton";
import { Icons } from "@/ui";

export type BookingActionsProps = {
  openReportModal: boolean;
  handleReportModal: () => void;
  handleReportTrip: (values: { message: string }) => void;
  isLoadingReportTrip: boolean;
  setReport: Dispatch<SetStateAction<string>>;
  bookingStatus?: BookingBadgeStatus;
};

const BookingActions = ({
  openReportModal,
  handleReportModal,
  handleReportTrip,
  isLoadingReportTrip,
  setReport,
}: BookingActionsProps) => {
  return (
    <div className="flex flex-col items-start gap-2 lg:flex-row lg:items-center">
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

export default BookingActions;
