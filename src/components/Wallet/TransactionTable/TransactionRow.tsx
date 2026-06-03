import { format } from "date-fns";
import { Transaction, TransactionType } from "@/types";
import { Popup, Icons, MoreButton } from "@/ui";
import { TableCell, TableRow } from "@/components/Table";
import { tableCellBaseClass, tableCellValueClass, tableMobileTitleClass } from "@/components/Table/tableStyles";

const TransactionRow = ({ items }: { items: Transaction }) => {
    return (
        <TableRow>
            <TableCell
                content={items?.transactionId}
                className="!font-semibold text-grey-900"
            />
            <TableCell
                content={
                    items?.date
                        ? `${format(new Date(items?.date), "MMM d, yyyy")} | ${format(new Date(items?.date), "hh:mma")}`
                        : "-"
                }
                className="text-grey-900"
            />
            <TableCell
                content={items?.bookingId || "-"}
                className="text-primary-500"
            />
            <TableCell
                content={items?.type.toLocaleLowerCase()}
                icon={
                    items.type === TransactionType.CREDIT
                        ? Icons.ic_credit
                        : items.type === TransactionType.DEBIT
                            ? Icons.ic_debit
                            : ""
                }
                className="capitalize"
            />
            <TableCell content={"-"} />
            <TableCell
                content={items?.origin.toLocaleLowerCase()}
                className="capitalize"
            />
            <TableCell content={`${items.currencyCode} ${items?.amount}`} />
            <TableCell content={items?.status} isBadge type="transaction" />
            <td className={tableCellBaseClass}>
                <span className={tableMobileTitleClass}>Actions</span>
                <div className={tableCellValueClass}>
                    <Popup
                        trigger={<MoreButton className="!mx-0 lg:mx-auto" />}
                        content={
                            <>
                                <p className="!text-xs !font-semibold 3xl:!text-base">Actions</p>
                                <ul className="space-y-2 *:py-2">
                                    <li className="!text-xs 3xl:!text-base">
                                        Download transaction reciept
                                    </li>
                                </ul>
                            </>
                        }
                    />
                </div>
            </td>
        </TableRow>
    );
};

export default TransactionRow;
