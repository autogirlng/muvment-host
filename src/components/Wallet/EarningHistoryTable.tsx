import { format } from "date-fns";
import { earningHistoryTableHeadItems } from "@/utils/data";
import TableHead from "@/components/Table/TableHead";
import TableCell from "@/components/Table/TableCell";
import EmptyState from "@/components/EmptyState";

interface PaidBy {
    fullName: string;
    email: string;
}

interface HostEarningItem {
    amountPaid: number;
    paidAt: string;
    paidBy: PaidBy;
}

type Props = {
    items: HostEarningItem[];
    totalEarnings?: number;
};

export default function EarningHistoryTable({ items, totalEarnings }: Props) {
    return items.length > 0 ? (
        <div className="space-y-4">
            {totalEarnings !== undefined && (
                <div className="flex items-center gap-2">
                    <span className="text-sm text-grey-500">Total Earnings:</span>
                    <span className="text-lg font-semibold text-grey-900">
                        NGN {totalEarnings.toLocaleString()}
                    </span>
                </div>
            )}
            <div className="overflow-auto">
                <table className="w-full min-w-full divide-y divide-grey-200 border-t border-grey-200 bg-white md:mt-7">
                    <TableHead tableHeadItems={earningHistoryTableHeadItems} />
                    <tbody className="divide-y divide-grey-200">
                        {items.map((item, index) => (
                            <tr key={index}>
                                <TableCell
                                    content={item.paidBy.fullName}
                                    className="!text-grey-900 !font-medium"
                                />
                                <TableCell content={item.paidBy.email} />
                                <TableCell content={`NGN ${item.amountPaid.toLocaleString()}`} />
                                <TableCell
                                    content={
                                        item.paidAt
                                            ? format(new Date(item.paidAt), "MMM dd, yyyy")
                                            : "N/A"
                                    }
                                />
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    ) : (
        <EmptyState
            title="No Transaction History"
            message="Your transaction history will appear here"
            image="/icons/empty_trnx_state.png"
            imageSize="w-[182px] 3xl:w-[265px]"
        />
    );
}
