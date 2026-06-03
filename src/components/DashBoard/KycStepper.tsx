"use client";

import Link from "next/link";
import { useAppSelector } from "@/lib/hooks";
import { useMou } from "@/hooks/mou/useMou";
import useHostBankDetailsStatus from "@/hooks/useHostBankDetailsStatus";

interface KycStepperProps {
  onSignMou?: () => void;
}

function CheckIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none">
      <path d="M2 7l4 4 6-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function KycStepper({ onSignMou }: KycStepperProps) {
  const { user } = useAppSelector((state) => state.user);
  const { useGetHostMou } = useMou();
  const mouQuery = useGetHostMou();
  const bankStatus = useHostBankDetailsStatus();

  const bankCompleted = bankStatus.hasBankDetails;
  const bankLoading = bankStatus.isLoading;

  const userData = (user?.data as any) ?? (user as any);
  const phoneVerified = Boolean(userData?.phoneVerified);
  const mouCompleted = (mouQuery.data?.data ?? []).length > 0;

  const steps = [
    {
      id: "phone",
      number: 1,
      label: "Phone Verification",
      description: "Verify your phone number to secure your account",
      completed: phoneVerified,
      actionLabel: "Verify Now",
      actionLink: "/settings/verify-number",
    },
    {
      id: "mou",
      number: 2,
      label: "Sign MOU Agreement",
      description: "Sign the Memorandum of Understanding",
      completed: mouCompleted,
      actionLabel: "Sign Now",
      onAction: onSignMou,
    },
    {
      id: "bank",
      number: 3,
      label: "Add Bank Account",
      description: "Set up your withdrawal account for payouts",
      completed: bankCompleted,
      actionLabel: "Add Now",
      actionLink: "/settings/withdrawal-account",
    },
  ];

  const completedCount = steps.filter((s) => s.completed).length;
  const allCompleted = completedCount === steps.length;
  const progressPercent = Math.round((completedCount / steps.length) * 100);

  if (mouQuery.isLoading || bankLoading) return null;

  /* ─────────────────────── VERIFIED STATE ─────────────────────── */
  if (allCompleted) {
    return (
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary-800 via-primary-700 to-primary-500 text-white">
        {/* Decorative sparkles */}
        <span className="pointer-events-none absolute right-12 top-4 select-none text-2xl text-white/20">✦</span>
        <span className="pointer-events-none absolute right-24 top-9 select-none text-sm text-white/15">✦</span>
        <span className="pointer-events-none absolute right-8 bottom-5 select-none text-xs text-white/15">✦</span>

        {/* Large faded background shield */}
        <div className="pointer-events-none absolute -right-8 -bottom-8 text-white/[0.07]">
          <svg width="180" height="180" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
          </svg>
        </div>

        <div className="relative px-6 py-6 sm:px-8 sm:py-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">

            {/* Left — icon + text */}
            <div className="flex items-start gap-5 sm:items-center">
              {/* Shield badge */}
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/15 ring-2 ring-white/25 shadow-inner">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 2L3 6v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V6l-9-4z"
                    stroke="white"
                    strokeWidth="1.5"
                    fill="rgba(255,255,255,0.12)"
                  />
                  <path d="M8 12l3 3 5-6" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl font-extrabold tracking-tight sm:text-2xl">Account Verified</h2>
                  <span className="rounded-full bg-white/20 px-3 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white">
                    KYC Complete
                  </span>
                </div>
                <p className="mt-1.5 max-w-md text-sm leading-relaxed text-white/75">
                  Your identity is verified and your MOU is approved. You now have full access to all Muvment hosting features.
                </p>

                {/* Completed chips */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {[
                    { label: "Phone Verified" },
                    { label: "MOU Approved" },
                    { label: "Bank Account" },
                  ].map((item) => (
                    <span
                      key={item.label}
                      className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium ring-1 ring-white/20"
                    >
                      <CheckIcon size={10} />
                      {item.label}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right — big check */}
            <div className="hidden lg:flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-white/10 ring-4 ring-white/20">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <path d="M8 20l8 8L32 12" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>
      </section>
    );
  }

  /* ─────────────────────── PENDING / IN-PROGRESS STATE ─────────────────────── */
  return (
    <section className="overflow-hidden rounded-2xl border border-grey-200 bg-white shadow-sm">
      {/* Gradient top accent bar */}
      <div className="h-1.5 bg-gradient-to-r from-primary-800 via-primary-600 to-primary-400" />

      {/* Header */}
      <div className="border-b border-grey-100 px-6 py-5 sm:px-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-grey-800">Account Setup</h3>
            <p className="mt-0.5 text-sm text-grey-500">
              Complete your verification to unlock all Muvment features
            </p>
          </div>

          {/* Progress fraction */}
          <div className="shrink-0 text-right">
            <p className="text-2xl font-extrabold leading-none text-primary-500">
              {completedCount}
              <span className="text-base font-normal text-grey-300">/{steps.length}</span>
            </p>
            <p className="mt-0.5 text-xs text-grey-400">Completed</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-grey-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary-700 to-primary-400 transition-all duration-700"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <p className="mt-1.5 text-right text-[11px] text-grey-400">{progressPercent}% complete</p>
      </div>

      {/* Step rows */}
      <div className="divide-y divide-grey-100">
        {steps.map((step) => (
          <div
            key={step.id}
            className={`flex items-center gap-4 px-6 py-4 sm:px-8 transition-colors ${
              step.completed ? "bg-grey-50/60" : "bg-white hover:bg-grey-50/40"
            }`}
          >
            {/* Circle indicator */}
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-all ${
                step.completed
                  ? "bg-success-500 text-white shadow-sm"
                  : "border-2 border-grey-200 bg-white text-grey-500"
              }`}
            >
              {step.completed ? <CheckIcon size={16} /> : step.number}
            </div>

            {/* Label + description */}
            <div className="min-w-0 flex-1">
              <p
                className={`text-sm font-semibold ${
                  step.completed
                    ? "text-grey-400 line-through decoration-grey-300"
                    : "text-grey-800"
                }`}
              >
                {step.label}
              </p>
              <p className="mt-0.5 text-xs text-grey-400">{step.description}</p>
            </div>

            {/* Action / badge */}
            {step.completed ? (
              <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-success-50 px-3 py-1.5 text-xs font-semibold text-success-600 ring-1 ring-success-100">
                <CheckIcon size={10} />
                Done
              </span>
            ) : step.actionLink ? (
              <Link
                href={step.actionLink}
                className="shrink-0 rounded-full bg-primary-500 px-4 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-primary-600"
              >
                {step.actionLabel} &rarr;
              </Link>
            ) : (
              <button
                onClick={step.onAction}
                className="shrink-0 rounded-full bg-primary-500 px-4 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-primary-600"
              >
                {step.actionLabel} &rarr;
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Footer hint */}
      <div className="border-t border-grey-100 bg-grey-50 px-6 py-3 sm:px-8">
        <p className="text-xs text-grey-400">
          You can complete these steps at any time from{" "}
          <Link href="/settings/account-setup" className="font-medium text-primary-500 hover:text-primary-600">
            Account Settings
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
