"use client";

import React, { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { ShieldAlert } from "lucide-react";
import { BlurredDialog } from "@/ui/dialog";
import useAuth from "@/hooks/useAuth";
import { useHttp } from "@/hooks/useHttp";

export default function HostRolePrompt() {
  const { data: session, status } = useSession();
  const { switchToHostMutation } = useAuth();
  const http = useHttp();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let mounted = true;

    const checkRole = async () => {
      if (status !== "authenticated" || !session?.user) return;

      // 1. Check role directly from the session first
      const roleFromSession = (session.user as any)?.role;
      if (roleFromSession) {
        if (roleFromSession === "CUSTOMER") {
          setOpen(true);
        }
        return;
      }

      // 2. Fallback: Fetch profile to determine role if not in session
      try {
        // Ensure path matches your setup (e.g., "/v1/users/me")
        const res = await http.get<{ data?: any; userType?: string; role?: string; user_type?: string }>("/v1/users/me");
        if (!mounted) return;

        const user = res?.data ?? res;
        const role = user?.userType || user?.role || user?.user_type;

        if (role === "CUSTOMER") {
          setOpen(true);
        }
      } catch (err) {
        console.error("Failed to verify user role:", err);
      }
    };

    checkRole();

    return () => {
      mounted = false;
    };
  }, [session, status, http]);

  const handleCancel = () => {
    // Immediately sign out and redirect to login or landing
    signOut({ callbackUrl: "/login?reason=hosts_only" });
  };

  const handleBecomeHost = () => {
    switchToHostMutation.mutate(undefined, {
      onSuccess: () => {
        // After switching tokens on the backend, force sign out 
        // so the user logs in fresh with the new HOST role/tokens.
        signOut({ callbackUrl: "/login?switched_to_host=true" });
      },
    });
  };

  // Enforce the gate: intercept attempts to close the dialog
  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      handleCancel();
    }
  };

  return (
    <BlurredDialog
      trigger={<></>}
      open={open}
      onOpenChange={handleOpenChange}
      title={
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 flex items-center justify-center bg-orange-50 rounded-full text-orange-600">
            <ShieldAlert strokeWidth={1.5} className="w-5 h-5" />
          </div>
          <span className="tracking-wide text-grey-900 font-medium">
            Host Access Required
          </span>
        </div>
      }
      description="This platform is exclusively for hosts. You are currently logged in as a customer. Would you like to switch your account to a Host profile to proceed?"
      content={
        <div className="flex gap-4 justify-end mt-6">
          <button
            onClick={handleCancel}
            disabled={switchToHostMutation.isPending}
            className="px-5 py-2.5 rounded-xl bg-grey-50 text-grey-600 hover:bg-grey-100 transition-colors text-sm font-medium tracking-wide disabled:opacity-50"
          >
            No, sign me out
          </button>
          <button
            onClick={handleBecomeHost}
            disabled={switchToHostMutation.isPending}
            className="px-5 py-2.5 rounded-xl bg-primary-600 text-white hover:bg-primary-700 transition-colors text-sm font-medium tracking-wide disabled:opacity-50 flex items-center justify-center min-w-[160px]"
          >
            {switchToHostMutation.isPending ? "Switching..." : "Yes, become a host"}
          </button>
        </div>
      }
    />
  );
}