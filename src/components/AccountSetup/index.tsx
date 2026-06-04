"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAppSelector } from "@/lib/hooks";
import { useKycStatus } from "@/hooks/useKycStatus";
import { useSession } from "next-auth/react";
import { baseAPIURL } from "@/utils/constants";

type StoredBankDetails = {
  bankName: string;
  accountName: string;
  accountNumber: string;
};

export function AccountSetupTasks() {
  const { user } = useAppSelector((state) => state.user);
  const { data: session } = useSession();
  const kyc = useKycStatus();

  const [bankDetails, setBankDetails] = useState<StoredBankDetails | null>(null);

  const userData = (user?.data as any) ?? (user as any);
  const emailVerified = kyc.emailVerified;
  const email = userData?.email ?? "";
  const bankCompleted = kyc.bankAdded;
  const mouPending = kyc.mouSubmitted && !kyc.mouApproved && kyc.mouStatus === "PENDING";

  // Fetch full bank details for display when bank is set up
  useEffect(() => {
    if (!bankCompleted) return;
    const token = (session as any)?.user?.accessToken ?? "";
    if (!token || !baseAPIURL) return;

    fetch(`${baseAPIURL}/hosts/me/bank-details`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((body) => {
        const d = body?.data;
        if (d && typeof d === "object") {
          setBankDetails({
            bankName: d.bankName ?? "",
            accountName: d.accountName ?? "",
            accountNumber: d.accountNumber ?? "",
          });
        }
      })
      .catch(() => {});
  }, [bankCompleted, session]);

  const steps = [
    {
      id: "phone",
      number: 1,
      label: "Phone Verification",
      description: "Verify your phone number to secure your account",
      completed: kyc.phoneVerified,
      actionLabel: "Verify Now",
      actionLink: "/settings/verify-number",
    },
    {
      id: "mou",
      number: 2,
      label: "Sign MOU Agreement",
      description: mouPending
        ? "Submitted — awaiting admin approval"
        : "Sign the Memorandum of Understanding",
      completed: kyc.mouApproved,
      pending: mouPending,
      actionLabel: "Sign Now",
      actionLink: "/settings/mou",
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

  const allCompleted = steps.every((s) => s.completed);
  const isLoading = kyc.isLoading;

  return (
    <div className="space-y-6">
      {/* Email status row */}
      <div className="flex items-center justify-between rounded-xl border border-grey-200 bg-grey-50 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-500">
            <svg width="16" height="13" viewBox="0 0 20 16" fill="none">
              <path d="M18 0H2C.9 0 0 .9 0 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V2c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V2l8 5 8-5v2z" fill="currentColor" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-grey-800">{email || "Email address"}</p>
            <p className="text-xs text-grey-500">Email address</p>
          </div>
        </div>
        <span
          className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
            emailVerified ? "bg-success-100 text-success-600" : "bg-warning-75 text-warning-700"
          }`}
        >
          {emailVerified && (
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M1.5 5l2.5 2.5 4.5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
          {emailVerified ? "Verified" : "Not verified"}
        </span>
      </div>

      {/* All-verified banner */}
      {!isLoading && allCompleted && (
        <div className="flex items-center gap-3 rounded-xl border border-success-100 bg-success-50 px-5 py-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-success-500 text-white text-base font-bold">
            ✓
          </div>
          <div>
            <p className="font-semibold text-success-600">KYC Complete</p>
            <p className="text-sm text-success-500">All verification steps have been completed successfully.</p>
          </div>
        </div>
      )}

      {/* Steps list */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 animate-pulse rounded-xl bg-grey-100" />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {steps.map((step) => (
            <div
              key={step.id}
              className={`flex items-center gap-4 rounded-xl border px-5 py-4 ${
                step.completed ? "border-success-100 bg-success-50" : "border-grey-200 bg-white"
              }`}
            >
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                  step.completed ? "bg-success-500 text-white" : "bg-grey-200 text-grey-600"
                }`}
              >
                {step.completed ? (
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2 7l4 4 6-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  step.number
                )}
              </div>

              <div className="flex flex-1 items-center justify-between gap-3">
                <div>
                  <p className={`text-sm font-medium ${step.completed ? "text-success-600" : "text-grey-800"}`}>
                    {step.label}
                  </p>
                  <p className="text-xs text-grey-500">{step.description}</p>
                </div>

                {step.completed ? (
                  <span className="shrink-0 rounded-full bg-success-100 px-3 py-1 text-xs font-medium text-success-600">
                    Completed
                  </span>
                ) : (step as any).pending ? (
                  <span className="shrink-0 rounded-full bg-warning-75 px-3 py-1 text-xs font-medium text-warning-700">
                    Pending approval
                  </span>
                ) : (
                  <Link
                    href={step.actionLink}
                    className="shrink-0 rounded-full bg-primary-500 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-primary-600"
                  >
                    {step.actionLabel}
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Bank account details (shown when added) */}
      {bankCompleted && bankDetails && (
        <div className="rounded-xl border border-grey-200 bg-white p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-grey-700">Bank Account Details</h4>
            <Link
              href="/settings/withdrawal-account"
              className="text-xs font-medium text-primary-500 hover:text-primary-600 transition-colors"
            >
              Update
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <p className="mb-0.5 text-xs text-grey-500">Bank Name</p>
              <p className="text-sm font-medium text-grey-800">{bankDetails.bankName}</p>
            </div>
            <div>
              <p className="mb-0.5 text-xs text-grey-500">Account Name</p>
              <p className="text-sm font-medium text-grey-800">{bankDetails.accountName}</p>
            </div>
            <div>
              <p className="mb-0.5 text-xs text-grey-500">Account Number</p>
              <p className="text-sm font-medium text-grey-800">{bankDetails.accountNumber}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
