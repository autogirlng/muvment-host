import cn from "classnames";
import { ReactNode } from "react";

type BookingTab = "upcoming" | "history";

type BookingViewTabsProps = {
  activeTab: BookingTab;
  onTabChange: (tab: BookingTab) => void;
  upcomingCount?: number;
  upcomingContent: ReactNode;
  historyContent: ReactNode;
};

export default function BookingViewTabs({
  activeTab,
  onTabChange,
  upcomingCount,
  upcomingContent,
  historyContent,
}: BookingViewTabsProps) {
  return (
    <div className="space-y-4 sm:space-y-5">
      <div className="flex items-center gap-6 border-b border-grey-200">
        <button
          type="button"
          onClick={() => onTabChange("upcoming")}
          className={cn(
            "relative flex items-center gap-2 pb-3 text-sm font-medium transition-colors sm:text-base",
            activeTab === "upcoming"
              ? "text-primary-500 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-primary-500"
              : "text-grey-500 hover:text-grey-700",
          )}
        >
          Upcoming
          {upcomingCount != null && upcomingCount > 0 && (
            <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary-500 px-1.5 text-[10px] font-semibold text-white sm:text-xs">
              {upcomingCount > 99 ? "99+" : upcomingCount}
            </span>
          )}
        </button>
        <button
          type="button"
          onClick={() => onTabChange("history")}
          className={cn(
            "relative pb-3 text-sm font-medium transition-colors sm:text-base",
            activeTab === "history"
              ? "text-primary-500 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-primary-500"
              : "text-grey-500 hover:text-grey-700",
          )}
        >
          History
        </button>
      </div>

      <div>{activeTab === "upcoming" ? upcomingContent : historyContent}</div>
    </div>
  );
}
