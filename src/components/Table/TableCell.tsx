import { BookingBadgeStatus, TransactionStatus } from "@/types";
import { BookingTableBadge, TransactionBadge } from "@/ui";
import { TableCellProps } from "./props";


const TableCell = ({ content, className, isBadge, type, icon, title }: TableCellProps) => (
    <td
        className={`px-4 py-3 lg:px-6 lg:py-[26px] lg:whitespace-nowrap w-full lg:w-fit text-sm text-grey-700 flex justify-between items-center lg:table-cell border-b lg:border-none last:border-0 border-grey-100 ${className ?? ""}`}
    >
        {/* Mobile Title */}
        {title && <span className="font-semibold text-grey-500 lg:hidden w-1/2 break-words text-left">{title}</span>}

        <div className="w-1/2 lg:w-auto text-right lg:text-left flex justify-end lg:justify-start break-words overflow-hidden">
            {icon ? (
                <div className="flex items-center gap-3">
                    {icon}
                    <span>{content}</span>
                </div>
            ) : isBadge ? (
                type === "transaction" ? (
                    <TransactionBadge status={content as TransactionStatus} />
                ) : (
                    <BookingTableBadge status={content as BookingBadgeStatus} />
                )
            ) : (
                content
            )}
        </div>
    </td>
);

export default TableCell;
