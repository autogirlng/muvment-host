import { transactionTableHeadItems } from "@/utils/data";
import { Transaction } from "@/types";
import TableHead from "@/components/Table/TableHead";
import EmptyState from "@/components/EmptyState";
import TransactionRow from "@/components/Wallet/TransactionTable/TransactionRow";

type Props = { items: Transaction[] };

export default function TransactionTable({ items }: Props) {
  return items.length > 0 ? (
    <div className="overflow-auto">
      <table className="w-full min-w-full divide-y divide-grey-200 border-t border-grey-200 bg-white md:mt-7">
        <TableHead tableHeadItems={transactionTableHeadItems} />
        <tbody className="divide-y divide-grey-200 ">
          {items?.map((item, index) => (
            <TransactionRow key={index} items={item} />
          ))}
        </tbody>
      </table>
    </div>
  ) : (
    <EmptyState
      title="No Data Yet"
      message="No Transaction History"
      image="/icons/empty_booking_state.png"
    />
  );
}
