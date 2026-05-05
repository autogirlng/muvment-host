import { hostEarningHistoryTableHeadItems } from "@/utils/data";
import type { HostEarningItem } from "@/types";
import TableHead from "@/components/Table/TableHead";
import EmptyState from "@/components/EmptyState";
import HostEarningRow from "@/components/Wallet/HostEarningTable/HostEarningRow";

type Props = { items: HostEarningItem[] };

export default function HostEarningTable({ items }: Props) {
  return items.length > 0 ? (
    <div className="overflow-auto">
      <table className="w-full min-w-full divide-y divide-grey-200 border-t border-grey-200 bg-white md:mt-7">
        <TableHead tableHeadItems={hostEarningHistoryTableHeadItems} />
        <tbody className="divide-y divide-grey-200 ">
          {items.map((item, index) => (
            <HostEarningRow
              key={`${item.paidAt}-${item.paidBy?.email ?? index}`}
              item={item}
            />
          ))}
        </tbody>
      </table>
    </div>
  ) : (
    <EmptyState
      title="No Data Yet"
      message="No earning history yet"
      image="/icons/empty_trnx_state.png"
    />
  );
}
