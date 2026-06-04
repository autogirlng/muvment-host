"use client";

import Link from "next/link";
import { useKycStatus } from "@/hooks/useKycStatus";

/**
 * Full-page block shown when a host tries to create a listing without completing
 * KYC + an APPROVED MOU. Reads everything from /users/me via useKycStatus.
 */
export default function KycRequiredNotice({ onSignMou }: { onSignMou?: () => void }) {
  const kyc = useKycStatus();

  const items: { label: string; done: boolean; pending?: boolean; pendingText?: string; link?: string; linkText?: string; onAction?: () => void; actionText?: string }[] = [
    {
      label: "Verify your phone number",
      done: kyc.phoneVerified,
      link: "/settings/verify-number",
      linkText: "Verify",
    },
    {
      label: "Add your bank account",
      done: kyc.bankAdded,
      link: "/settings/withdrawal-account",
      linkText: "Add",
    },
    {
      label: "Get your MOU approved",
      done: kyc.mouApproved,
      pending: kyc.mouSubmitted && !kyc.mouApproved && kyc.mouStatus === "PENDING",
      pendingText: "Pending approval",
      ...(kyc.mouStatus === "REJECTED"
        ? { onAction: onSignMou, actionText: "Re-sign" }
        : !kyc.mouSubmitted
        ? { onAction: onSignMou, actionText: "Sign" }
        : {}),
    },
  ];

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="w-full max-w-md space-y-5 rounded-2xl border border-grey-200 bg-white p-6 shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-warning-75">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
              stroke="#865503" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="12" y1="9" x2="12" y2="13" stroke="#865503" strokeWidth="2" strokeLinecap="round" />
            <line x1="12" y1="17" x2="12.01" y2="17" stroke="#865503" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>

        <div className="text-center">
          <h3 className="text-lg font-semibold text-grey-800">Complete Verification First</h3>
          <p className="mt-1 text-sm text-grey-500">
            You need verified KYC and an approved MOU before you can create a listing.
          </p>
        </div>

        <ul className="space-y-2">
          {items.map((item) => (
            <li
              key={item.label}
              className="flex items-center justify-between gap-3 rounded-xl border border-grey-100 bg-grey-50 px-4 py-3"
            >
              <span className="flex items-center gap-2 text-sm text-grey-700">
                {item.done && (
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-success-500 text-white">
                    <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
                      <path d="M1.5 5l2.5 2.5 4.5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                )}
                {item.label}
              </span>

              {item.done ? (
                <span className="shrink-0 rounded-full bg-success-100 px-2.5 py-1 text-xs font-medium text-success-600">Done</span>
              ) : item.pending ? (
                <span className="shrink-0 rounded-full bg-warning-75 px-2.5 py-1 text-xs font-medium text-warning-700">{item.pendingText}</span>
              ) : item.link ? (
                <Link href={item.link} className="shrink-0 rounded-full bg-primary-500 px-3 py-1 text-xs font-medium text-white hover:bg-primary-600">
                  {item.linkText}
                </Link>
              ) : item.onAction ? (
                <button onClick={item.onAction} className="shrink-0 rounded-full bg-primary-500 px-3 py-1 text-xs font-medium text-white hover:bg-primary-600">
                  {item.actionText}
                </button>
              ) : null}
            </li>
          ))}
        </ul>

        <div className="flex gap-3 pt-1">
          <Link
            href="/listings"
            className="flex-1 rounded-xl border border-grey-200 py-2.5 text-center text-sm font-semibold text-grey-700 hover:bg-grey-50"
          >
            Back to Listings
          </Link>
          <Link
            href="/dashboard"
            className="flex-1 rounded-xl bg-primary-500 py-2.5 text-center text-sm font-semibold text-white hover:bg-primary-600"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
