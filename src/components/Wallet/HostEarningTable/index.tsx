import { hostEarningHistoryTableHeadItems } from "@/utils/data";
import type { HostEarningItem } from "@/types";
import { Table, TableBody, TableHead } from "@/components/Table";
import EmptyState from "@/components/EmptyState";
import HostEarningRow from "@/components/Wallet/HostEarningTable/HostEarningRow";

type Props = { items: HostEarningItem[] };

export default function HostEarningTable({ items }: Props) {
  return items.length > 0 ? (
    <Table className="md:mt-7">
      <TableHead tableHeadItems={hostEarningHistoryTableHeadItems} />
      <TableBody>
        {items.map((item, index) => (
          <HostEarningRow
            key={`${item.paidAt}-${item.paidBy?.email ?? index}`}
            item={item}
          />
        ))}
      </TableBody>
    </Table>
  ) : (
    <EmptyState
      title="No Data Yet"
      message="No earning history yet"
      image="/icons/empty_trnx_state.png"
    />
  );
}
