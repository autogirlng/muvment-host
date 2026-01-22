import { BookingBadgeStatus, TransactionStatus } from "@/types";
import { BookingTableBadge, TransactionBadge } from "@/ui";
import { TableCellProps } from "./props";


const TableCell = ({ content, className, isBadge, type, icon }: TableCellProps) => (
    <td
        className={`px-6 py-[26px] whitespace-nowrap w-fit text-sm text-grey-700 ${className ?? ""
            }`}
    >
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
    </td>
);

export default TableCell;
