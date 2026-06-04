"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { useKycStatus } from "@/hooks/useKycStatus";

interface KycGateProps {
  children: ReactNode;
}

export default function KycGate({ children }: KycGateProps) {
  const { phoneVerified, bankAdded, mouSubmitted, mouStatus, isLoading } =
    useKycStatus();

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  // Build list of blockers in order
  const blockers: { text: string; link?: string; linkText?: string }[] = [];

  if (!phoneVerified) {
    blockers.push({
      text: "Your phone number is not verified",
      link: "/settings/verify-number",
      linkText: "Verify now",
    });
  }
  if (!bankAdded) {
    blockers.push({
      text: "You haven't added your bank account",
      link: "/settings/withdrawal-account",
      linkText: "Add now",
    });
  }
  if (!mouSubmitted) {
    blockers.push({
      text: "You haven't signed the MOU agreement",
      link: "/dashboard",
      linkText: "Sign now",
    });
  } else if (mouStatus === "PENDING") {
    blockers.push({ text: "Your MOU is pending admin approval — please check back soon" });
  } else if (mouStatus === "REJECTED") {
    blockers.push({ text: "Your MOU was rejected — please contact support for assistance" });
  }

  if (blockers.length === 0) return <>{children}</>;

  // Derive heading based on context
  const allPhoneAndBankDone = phoneVerified && bankAdded;
  let heading = "Verification Pending";
  let subheading = "Please complete the steps below to access your wallet.";

  if (allPhoneAndBankDone && !mouSubmitted) {
    heading = "MOU Not Signed";
    subheading = "Please sign the MOU agreement to access your wallet.";
  } else if (allPhoneAndBankDone && mouStatus === "PENDING") {
    heading = "MOU Pending Approval";
    subheading = "Your MOU has been submitted and is awaiting admin approval. Please check back soon.";
  } else if (allPhoneAndBankDone && mouStatus === "REJECTED") {
    heading = "MOU Rejected";
    subheading = "Your MOU was rejected. Please contact support for assistance.";
  }

  return (
    <div className="relative min-h-[600px]">
      {/* Blurred background content */}
      <div className="pointer-events-none select-none blur-sm" aria-hidden>
        {children}
      </div>

      {/* Blocking overlay */}
      <div className="absolute inset-0 flex items-start justify-center pt-20 bg-white/70 backdrop-blur-[2px]">
        <div className="mx-4 w-full max-w-md rounded-2xl border border-grey-200 bg-white p-6 shadow-xl space-y-5">
          {/* Warning icon */}
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-warning-75">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                stroke="#865503"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <line x1="12" y1="9" x2="12" y2="13" stroke="#865503" strokeWidth="2" strokeLinecap="round" />
              <line x1="12" y1="17" x2="12.01" y2="17" stroke="#865503" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>

          {/* Text */}
          <div className="text-center">
            <h3 className="text-lg font-semibold text-grey-800">{heading}</h3>
            <p className="mt-1 text-sm text-grey-500">{subheading}</p>
          </div>

          {/* Blocker items */}
          <ul className="space-y-3">
            {blockers.map((item, i) => (
              <li
                key={i}
                className="flex items-start gap-3 rounded-xl border border-warning-75 bg-warning-75 px-4 py-3"
              >
                <span className="mt-0.5 shrink-0 text-warning-500">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M8 5v4M8 10.5h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </span>
                <span className="flex-1 text-sm text-grey-700">
                  {item.text}
                  {item.link && (
                    <>
                      {" "}
                      &mdash;{" "}
                      <Link
                        href={item.link}
                        className="font-semibold text-primary-500 hover:text-primary-600"
                      >
                        {item.linkText} &rarr;
                      </Link>
                    </>
                  )}
                </span>
              </li>
            ))}
          </ul>

          <Link
            href="/settings/account-setup"
            className="block w-full rounded-xl bg-primary-500 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-primary-600"
          >
            Go to Account Setup
          </Link>
        </div>
      </div>
    </div>
  );
}
