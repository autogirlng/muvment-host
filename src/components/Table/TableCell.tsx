import cn from "classnames";
import { ReactNode } from "react";
import { BookingBadgeStatus, TransactionStatus, VehicleStatus } from "@/types";
import { BookingTableBadge, TransactionBadge, TripTableBadge, VehicleListingBadge } from "@/ui";
import { TableCellProps } from "./props";
import { tableCellBaseClass, tableCellValueClass, tableMobileTitleClass } from "./tableStyles";

function renderBadge(content: string | ReactNode, type?: TableCellProps["type"]) {
    if (type === "transaction") {
        return <TransactionBadge status={content as TransactionStatus} />;
    }
    if (type === "listing") {
        return <VehicleListingBadge status={content as VehicleStatus} />;
    }
    if (type === "trip") {
        return <TripTableBadge status={String(content)} />;
    }
    return <BookingTableBadge status={content as BookingBadgeStatus} />;
}

const TableCell = ({ content, className, isBadge, type, icon, title }: TableCellProps) => (
    <td className={cn(tableCellBaseClass, className)}>
        {title && <span className={tableMobileTitleClass}>{title}</span>}

        <div className={tableCellValueClass}>
            {icon ? (
                <div className="flex items-center gap-2.5">
                    <span className="shrink-0 text-grey-500">{icon}</span>
                    <span className="text-grey-800">{content}</span>
                </div>
            ) : isBadge ? (
                renderBadge(content, type)
            ) : (
                <span className="text-grey-700">{content}</span>
            )}
        </div>
    </td>
);

export default TableCell;
