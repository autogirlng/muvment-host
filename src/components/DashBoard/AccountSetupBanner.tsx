import Image from "next/image";
import Link from "next/link";
import { Icons } from "@/ui";

type AccountSetupBannerProps = {
  progress?: number;
};

export default function AccountSetupBanner({ progress = 0 }: AccountSetupBannerProps) {
  const clampedProgress = Math.min(100, Math.max(0, progress));
  const circumference = 2 * Math.PI * 34;
  const strokeDashoffset = circumference - (clampedProgress / 100) * circumference;

  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#FFF8E7] via-warning-75 to-[#F5C842] px-4 py-5 sm:px-6 sm:py-6 md:px-8 lg:px-10">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between md:gap-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-5 md:gap-6 lg:flex-1">
          <div className="relative mx-auto shrink-0 sm:mx-0">
            <span className="absolute -right-1 top-0 text-sm text-warning-500">✦</span>
            <span className="absolute -left-1 bottom-2 text-xs text-warning-400">✦</span>
            <svg
              className="h-[88px] w-[88px] sm:h-[96px] sm:w-[96px]"
              viewBox="0 0 80 80"
              aria-hidden
            >
              <circle cx="40" cy="40" r="34" fill="#FFFFFF" stroke="#F3A218" strokeWidth="3" />
              <circle
                cx="40"
                cy="40"
                r="34"
                fill="none"
                stroke="#865503"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                transform="rotate(-90 40 40)"
              />
              <text
                x="40"
                y="44"
                textAnchor="middle"
                className="fill-warning-700 text-[15px] font-bold"
                style={{ fontSize: "15px", fontWeight: 700, fill: "#865503" }}
              >
                {clampedProgress}%
              </text>
            </svg>
          </div>

          <div className="space-y-3 text-center sm:text-left">
            <div className="space-y-1.5">
              <h2 className="text-lg sm:text-xl font-bold text-warning-700">
                Complete Account Setup
              </h2>
              <p className="max-w-md text-xs sm:text-sm text-warning-700/90">
                Please complete account setup to get full access to Muvment&apos;s
                functionalities
              </p>
            </div>
            <Link
              href="/settings/account-setup"
              className="inline-flex items-center gap-2 rounded-full bg-warning-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-warning-500 sm:px-5 sm:py-3"
            >
              Complete Set up
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/15">
                {Icons.ic_chevron_right}
              </span>
            </Link>
          </div>
        </div>

        <div className="relative mx-auto h-[100px] w-[120px] shrink-0 sm:h-[120px] sm:w-[140px] md:h-[130px] md:w-[150px] lg:h-[140px] lg:w-[160px]">
          <Image
            src="/images/dashboard/account-setup-illustration.png"
            alt=""
            fill
            className="object-contain object-center"
          />
        </div>
      </div>
    </section>
  );
}
