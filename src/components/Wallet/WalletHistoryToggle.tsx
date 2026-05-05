import cn from "classnames";

export type WalletHistoryTab = "payouts" | "earnings";

type Props = {
  value: WalletHistoryTab;
  onChange: (tab: WalletHistoryTab) => void;
};

export default function WalletHistoryToggle({ value, onChange }: Props) {
  return (
    <div
      className="inline-flex rounded-xl border border-grey-200 bg-grey-75 p-1 gap-1"
      role="tablist"
      aria-label="Wallet history view"
    >
      <button
        type="button"
        role="tab"
        aria-selected={value === "payouts"}
        className={cn(
          "px-4 py-2 rounded-lg text-xs md:text-sm font-semibold transition-colors whitespace-nowrap",
          value === "payouts"
            ? "bg-white text-primary-900 shadow-sm"
            : "text-grey-600 hover:text-grey-800"
        )}
        onClick={() => onChange("payouts")}
      >
        Booking payouts
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={value === "earnings"}
        className={cn(
          "px-4 py-2 rounded-lg text-xs md:text-sm font-semibold transition-colors whitespace-nowrap",
          value === "earnings"
            ? "bg-white text-primary-900 shadow-sm"
            : "text-grey-600 hover:text-grey-800"
        )}
        onClick={() => onChange("earnings")}
      >
        Earning history
      </button>
    </div>
  );
}
