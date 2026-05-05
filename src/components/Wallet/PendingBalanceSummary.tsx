import { Spinner } from "@/ui";
import { formatNgnAmount } from "@/utils/formatters";

type Props = {
  totalAmountToPay: number;
  totalPaidToHost: number;
  totalAmountHostHaveMade: number;
  /** `data.totalEarnings` from `/v1/host-performance/earning-history` */
  totalEarningsHistory: number;
  isLoading: boolean;
  isError: boolean;
  earningHistoryLoading: boolean;
  earningHistoryError: boolean;
};

function PayoutStatCard({
  label,
  value,
  isLoading,
  isError,
}: {
  label: string;
  value: number;
  isLoading: boolean;
  isError: boolean;
}) {
  return (
    <div className="rounded-3xl border border-primary-100 bg-primary-50 py-8 px-6 md:px-8 flex flex-col gap-4 justify-center min-h-[160px] shadow-[12px_4px_100px_0px_#00000008]">
      <p className="uppercase text-xs !font-semibold text-grey-600 tracking-wide leading-snug">
        {label}
      </p>
      <div className="min-h-[2.5rem] flex items-center">
        {isLoading ? (
          <Spinner />
        ) : isError ? (
          <p className="text-sm text-grey-700">Unable to load</p>
        ) : (
          <p className="text-xl md:text-2xl 2xl:text-h4 font-bold text-primary-900 tabular-nums leading-tight break-words">
            ₦{formatNgnAmount(value)}
          </p>
        )}
      </div>
    </div>
  );
}

export default function PendingBalanceSummary({
  totalAmountToPay,
  totalPaidToHost,
  totalAmountHostHaveMade,
  totalEarningsHistory,
  isLoading,
  isError,
  earningHistoryLoading,
  earningHistoryError,
}: Props) {
  return (
    <section className="space-y-4 md:space-y-5">
      <div>
        <h2 className="text-sm font-semibold text-grey-800">Host payout overview</h2>
        <p className="text-xs text-grey-500 mt-1 max-w-2xl">
          Pending balance totals plus your recorded earnings total from payment history.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
        <PayoutStatCard
          label="Pending to pay you"
          value={totalAmountToPay}
          isLoading={isLoading}
          isError={isError}
        />
        <PayoutStatCard
          label="Paid to host"
          value={totalPaidToHost}
          isLoading={isLoading}
          isError={isError}
        />
        <PayoutStatCard
          label="Total you have earned"
          value={totalAmountHostHaveMade}
          isLoading={isLoading}
          isError={isError}
        />
        <PayoutStatCard
          label="Total earnings"
          value={totalEarningsHistory}
          isLoading={earningHistoryLoading}
          isError={earningHistoryError}
        />
      </div>
    </section>
  );
}
