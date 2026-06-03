import { transactionTableHeadItems } from "@/utils/data";
import { Transaction } from "@/types";
import { Table, TableBody, TableHead } from "@/components/Table";
import EmptyState from "@/components/EmptyState";
import TransactionRow from "@/components/Wallet/TransactionTable/TransactionRow";

type Props = { items: Transaction[] };

export default function TransactionTable({ items }: Props) {
  return items.length > 0 ? (
    <Table className="md:mt-7">
      <TableHead tableHeadItems={transactionTableHeadItems} />
      <TableBody>
        {items?.map((item, index) => (
          <TransactionRow key={index} items={item} />
        ))}
      </TableBody>
    </Table>
  ) : (
    <EmptyState
      title="No Data Yet"
      message="No Transaction History"
      image="/icons/empty_booking_state.png"
    />
  );
}
