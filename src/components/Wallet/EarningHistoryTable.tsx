import TableHead from "@/components/Table/TableHead";
import TableCell from "@/components/Table/TableCell";
import { formatNgnAmount } from "@/utils/formatters";

type Props = {
    totalPending: number;
    totalPaid: number;
    totalEarnings: number;
};

const tableHeadItems = ["Metric", "Amount"];

export default function EarningHistoryTable({
    totalPending,
    totalPaid,
    totalEarnings,
}: Props) {
    const rows = [
        { metric: "Total pending", amount: totalPending },
        { metric: "Total paid", amount: totalPaid },
        { metric: "Total earnings", amount: totalEarnings },
    ];

    return (
        <div className="overflow-auto bg-grey-50 lg:bg-white rounded-xl lg:rounded-none p-4 lg:p-0">
            <table className="block lg:table w-full min-w-full lg:divide-y divide-grey-200 lg:border-t border-grey-200 bg-white md:mt-7">
                <TableHead tableHeadItems={tableHeadItems} />
                <tbody className="block lg:table-row-group lg:divide-y divide-grey-200">
                    {rows.map((row) => (
                        <tr
                            key={row.metric}
                            className="block lg:table-row bg-white border-2 border-grey-200 lg:border-none hover:border-grey-300 lg:hover:bg-grey-50 rounded-xl lg:rounded-none mb-4 lg:mb-0 p-4 lg:p-0 shadow-sm lg:shadow-none transition-all"
                        >
                            <TableCell
                                title="Metric"
                                content={row.metric}
                                className="!text-grey-900 !font-medium"
                            />
                            <TableCell
                                title="Amount"
                                content={`₦${formatNgnAmount(row.amount)}`}
                                className="!text-grey-900 !font-semibold tabular-nums"
                            />
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
